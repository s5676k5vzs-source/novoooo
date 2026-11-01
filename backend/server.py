from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Optional, Literal

import bcrypt
import jwt
import requests
import stripe
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Depends, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from starlette.middleware.cors import CORSMiddleware
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("reprise")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
TAX_MODE = "full"
LOOKUP = {"standard": "reprise_standard", "express": "reprise_express"}

EMERGENT_KEY = os.environ["EMERGENT_LLM_KEY"]
STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "reprise"
storage_key = None

JWT_ALGORITHM = "HS256"

app = FastAPI()
api = APIRouter(prefix="/api")


def now():
    return datetime.now(timezone.utc)


# ---------- storage ----------
def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": init_storage(), "Content-Type": content_type},
                        data=data, timeout=180)
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage()}, timeout=120)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "audio/mpeg")


# ---------- auth ----------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def make_token(user_id: str, email: str, kind: str, delta: timedelta) -> str:
    return jwt.encode({"sub": user_id, "email": email, "type": kind, "exp": now() + delta},
                      os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie("access_token", make_token(user_id, email, "access", timedelta(hours=8)),
                        httponly=True, secure=True, samesite="none", max_age=28800, path="/")
    response.set_cookie("refresh_token", make_token(user_id, email, "refresh", timedelta(days=7)),
                        httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth = request.headers.get("Authorization", "")
    if not token and auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        raise HTTPException(401, "Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Token inválido")
    if payload.get("type") != "access":
        raise HTTPException(401, "Token inválido")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user or user.get("role") != "admin":
        raise HTTPException(403, "Sem permissão")
    return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name"), "role": user["role"]}


class LoginIn(BaseModel):
    email: EmailStr
    password: str


@api.post("/auth/login")
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.lower()
    ident = f"{request.client.host if request.client else 'x'}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": ident})
    if attempt and attempt.get("count", 0) >= 5 and attempt.get("locked_until") and attempt["locked_until"].replace(tzinfo=timezone.utc) > now():
        raise HTTPException(429, "Demasiadas tentativas. Tente novamente em 15 minutos.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        count = (attempt or {}).get("count", 0) + 1
        await db.login_attempts.update_one({"identifier": ident}, {"$set": {
            "count": count, "locked_until": now() + timedelta(minutes=15) if count >= 5 else None}}, upsert=True)
        raise HTTPException(401, "E-mail ou palavra-passe incorretos")
    await db.login_attempts.delete_one({"identifier": ident})
    set_auth_cookies(response, str(user["_id"]), email)
    return {"id": str(user["_id"]), "email": email, "name": user.get("name"), "role": user["role"]}


@api.get("/auth/me")
async def me(admin: dict = Depends(get_admin)):
    return admin


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", secure=True, samesite="none")
    response.delete_cookie("refresh_token", path="/", secure=True, samesite="none")
    return {"ok": True}


# ---------- orders ----------
class OrderIn(BaseModel):
    recipient: str = Field(min_length=1, max_length=40)
    recipient_name: str = Field(min_length=1, max_length=60)
    occasion: str = Field(min_length=1, max_length=40)
    genre: str = Field(min_length=1, max_length=40)
    voice: str = Field(min_length=1, max_length=20)
    mood: str = Field(min_length=1, max_length=30)
    story: str = Field(min_length=20, max_length=4000)
    customer_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    delivery: Literal["standard", "express"] = "standard"


def public_song(o: dict) -> dict:
    return {
        "id": o["id"], "recipient": o["recipient"], "recipient_name": o["recipient_name"],
        "occasion": o["occasion"], "genre": o["genre"], "voice": o["voice"], "mood": o["mood"],
        "customer_name": o["customer_name"], "delivery": o["delivery"], "status": o["status"],
        "payment_status": o["payment_status"], "lyrics": o.get("lyrics"), "lyrics_status": o.get("lyrics_status"),
        "has_audio": bool(o.get("audio_path")), "created_at": o["created_at"],
    }


@api.post("/orders")
async def create_order(body: OrderIn):
    doc = {**body.model_dump(), "id": str(uuid.uuid4()), "email": body.email.lower(),
           "status": "awaiting_payment", "payment_status": "pending", "lyrics": None,
           "lyrics_status": "idle", "audio_path": None, "revisions": [],
           "created_at": now().isoformat(), "updated_at": now().isoformat()}
    await db.orders.insert_one(doc)
    return {"id": doc["id"]}


@api.get("/songs/{order_id}")
async def get_song(order_id: str):
    o = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not o:
        raise HTTPException(404, "Música não encontrada")
    return public_song(o)


@api.get("/songs/{order_id}/audio")
async def song_audio(order_id: str):
    o = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not o or not o.get("audio_path"):
        raise HTTPException(404, "Áudio ainda não disponível")
    data, ctype = await asyncio.to_thread(get_object, o["audio_path"])
    return Response(content=data, media_type=o.get("audio_type") or ctype,
                    headers={"Content-Disposition": f'inline; filename="reprise-{o["recipient_name"]}.mp3"'})


class RevisionIn(BaseModel):
    message: str = Field(min_length=3, max_length=1500)


@api.post("/songs/{order_id}/revision")
async def request_revision(order_id: str, body: RevisionIn):
    res = await db.orders.update_one({"id": order_id, "payment_status": "paid"},
                                     {"$push": {"revisions": {"message": body.message, "created_at": now().isoformat()}},
                                      "$set": {"status": "revision", "updated_at": now().isoformat()}})
    if not res.matched_count:
        raise HTTPException(404, "Pedido não encontrado")
    return {"ok": True}


# ---------- lyrics (AI) ----------
LYRICS_SYSTEM = (
    "És um letrista profissional português. Escreves letras originais de canções personalizadas em português europeu, "
    "emocionantes, com rima natural, imagens concretas tiradas da história do cliente e nunca clichés vazios. "
    "Nunca copies nem imites letras de canções existentes. Estrutura obrigatória com rótulos entre parênteses retos: "
    "[Verso 1], [Pré-Refrão], [Refrão], [Verso 2], [Refrão], [Ponte], [Refrão Final]. "
    "Responde APENAS com a letra, começando por uma linha 'Título: ...'."
)


async def generate_lyrics(order_id: str):
    o = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not o:
        return
    await db.orders.update_one({"id": order_id}, {"$set": {"lyrics_status": "writing"}})
    prompt = (
        f"Escreve uma canção para {o['recipient_name']} (relação: {o['recipient']}), ocasião: {o['occasion']}. "
        f"Estilo musical: {o['genre']}. Voz: {o['voice']}. Tom emocional: {o['mood']}. "
        f"Quem oferece: {o['customer_name']}.\nHistória e memórias partilhadas:\n{o['story']}"
    )
    try:
        chat = LlmChat(api_key=EMERGENT_KEY, session_id=f"lyrics-{order_id}-{uuid.uuid4().hex[:6]}",
                       system_message=LYRICS_SYSTEM).with_model("anthropic", "claude-sonnet-5-5")
        text = ""
        async for ev in chat.stream_message(UserMessage(text=prompt)):
            if isinstance(ev, TextDelta):
                text += ev.content
            elif isinstance(ev, StreamDone):
                break
        await db.orders.update_one({"id": order_id}, {"$set": {
            "lyrics": text.strip(), "lyrics_status": "done", "updated_at": now().isoformat()}})
    except Exception as e:
        logger.exception("lyrics failed: %s", e)
        await db.orders.update_one({"id": order_id}, {"$set": {"lyrics_status": "failed"}})


async def mark_order_paid(session_id: str, background: Optional[BackgroundTasks] = None):
    tx = await db.payment_transactions.find_one({"session_id": session_id})
    if not tx:
        return
    res = await db.orders.update_one({"id": tx["order_id"], "payment_status": {"$ne": "paid"}},
                                     {"$set": {"payment_status": "paid", "status": "in_production",
                                               "updated_at": now().isoformat()}})
    if res.modified_count:
        if background:
            background.add_task(generate_lyrics, tx["order_id"])
        else:
            asyncio.create_task(generate_lyrics(tx["order_id"]))


# ---------- payments ----------
class CheckoutIn(BaseModel):
    order_id: str
    origin_url: str


@api.post("/payments/checkout")
async def create_checkout(body: CheckoutIn):
    o = await db.orders.find_one({"id": body.order_id}, {"_id": 0})
    if not o:
        raise HTTPException(404, "Pedido não encontrado")
    lookup_key = LOOKUP[o["delivery"]]
    prices = stripe.Price.list(lookup_keys=[lookup_key], active=True, limit=1).data
    if not prices:
        raise HTTPException(500, f"Preço não encontrado: {lookup_key}")
    price = prices[0]
    kwargs = dict(
        line_items=[{"price": price.id, "quantity": 1}], mode="payment", customer_email=o["email"],
        success_url=f"{body.origin_url}/pagamento/sucesso?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{body.origin_url}/pagamento/cancelado?pedido={o['id']}",
        metadata={"order_id": o["id"], "lookup_key": lookup_key}, locale="pt",
    )
    try:
        session = stripe.checkout.Session.create(**kwargs, managed_payments={"enabled": True})
    except stripe.error.InvalidRequestError as e:
        msg = (e.user_message or str(e)).lower()
        if "managed" in msg or "ineligible" in msg or "locale" in msg or "customer_email" in msg:
            session = stripe.checkout.Session.create(**kwargs, automatic_tax={"enabled": True},
                                                     billing_address_collection="required")
        else:
            raise
    await db.payment_transactions.insert_one({
        "session_id": session.id, "order_id": o["id"], "lookup_key": lookup_key,
        "amount": float(price.unit_amount or 0) / 100, "currency": price.currency,
        "status": "initiated", "payment_status": "pending", "created_at": now(), "updated_at": now()})
    return {"checkout_url": session.url, "session_id": session.id}


@api.get("/payments/status/{session_id}")
async def payment_status(session_id: str, background: BackgroundTasks):
    record = await db.payment_transactions.find_one({"session_id": session_id})
    if not record:
        raise HTTPException(404, "Transação não encontrada")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {"status": "completed", "payment_status": "paid",
                              "stripe_payment_intent_id": s.payment_intent, "updated_at": now()}})
                record = await db.payment_transactions.find_one({"session_id": session_id})
        except stripe.error.StripeError:
            pass
    if record["payment_status"] == "paid":
        await mark_order_paid(session_id, background)
    return {"session_id": record["session_id"], "status": record["status"], "payment_status": record["payment_status"]}


@api.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, request.headers.get("stripe-signature", ""), STRIPE_WEBHOOK_SECRET)
    except (stripe.error.SignatureVerificationError, ValueError):
        raise HTTPException(400, "Invalid signature")
    obj, t = event["data"]["object"], event["type"]
    if t in ("checkout.session.completed", "checkout.session.async_payment_succeeded") and obj.get("payment_status") == "paid":
        await db.payment_transactions.update_one(
            {"session_id": obj["id"], "payment_status": {"$ne": "paid"}},
            {"$set": {"status": "completed", "payment_status": "paid",
                      "stripe_payment_intent_id": obj.get("payment_intent"), "updated_at": now()}})
        await mark_order_paid(obj["id"])
    elif t == "checkout.session.expired":
        await db.payment_transactions.update_one({"session_id": obj["id"]},
                                                 {"$set": {"status": "expired", "payment_status": "expired"}})
    elif t == "charge.refunded":
        await db.payment_transactions.update_one({"stripe_payment_intent_id": obj.get("payment_intent")},
                                                 {"$set": {"status": "refunded", "payment_status": "refunded"}})
    return {"status": "ok"}


# ---------- admin ----------
@api.get("/admin/orders")
async def admin_orders(admin: dict = Depends(get_admin)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [{**public_song(o), "email": o["email"], "story": o["story"], "revisions": o.get("revisions", [])} for o in orders]


class StatusIn(BaseModel):
    status: Literal["awaiting_payment", "in_production", "revision", "completed"]


@api.patch("/admin/orders/{order_id}")
async def admin_update(order_id: str, body: StatusIn, admin: dict = Depends(get_admin)):
    res = await db.orders.update_one({"id": order_id}, {"$set": {"status": body.status, "updated_at": now().isoformat()}})
    if not res.matched_count:
        raise HTTPException(404, "Pedido não encontrado")
    return {"ok": True}


@api.post("/admin/orders/{order_id}/lyrics")
async def admin_regen(order_id: str, background: BackgroundTasks, admin: dict = Depends(get_admin)):
    if not await db.orders.find_one({"id": order_id}):
        raise HTTPException(404, "Pedido não encontrado")
    background.add_task(generate_lyrics, order_id)
    return {"ok": True}


@api.post("/admin/orders/{order_id}/audio")
async def admin_upload(order_id: str, file: UploadFile = File(...), admin: dict = Depends(get_admin)):
    o = await db.orders.find_one({"id": order_id})
    if not o:
        raise HTTPException(404, "Pedido não encontrado")
    ctype = file.content_type or "audio/mpeg"
    if not ctype.startswith("audio/"):
        raise HTTPException(400, "Envie um ficheiro de áudio (MP3, WAV, M4A)")
    data = await file.read()
    if len(data) > 60 * 1024 * 1024:
        raise HTTPException(400, "Ficheiro demasiado grande (máx. 60MB)")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "mp3"
    result = await asyncio.to_thread(put_object, f"{APP_NAME}/songs/{order_id}/{uuid.uuid4()}.{ext}", data, ctype)
    await db.orders.update_one({"id": order_id}, {"$set": {
        "audio_path": result["path"], "audio_type": ctype, "audio_filename": file.filename,
        "status": "completed", "updated_at": now().isoformat()}})
    return {"ok": True}


@api.get("/")
async def root():
    return {"message": "Reprise API"}


app.include_router(api)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origin_regex=".*",
                   allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.orders.create_index("id", unique=True)
    email = os.environ["ADMIN_EMAIL"].lower()
    if not await db.users.find_one({"email": email}):
        await db.users.insert_one({"email": email, "password_hash": hash_password(os.environ["ADMIN_PASSWORD"]),
                                   "name": "Admin", "role": "admin", "created_at": now()})
    try:
        await asyncio.to_thread(init_storage)
    except Exception as e:
        logger.error("Storage init failed: %s", e)


@app.on_event("shutdown")
async def shutdown():
    client.close()
