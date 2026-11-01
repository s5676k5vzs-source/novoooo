import os
import stripe
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

CATALOG = [
    {"emergent_product_id": "reprise_song_standard", "name": "Reprise — Música personalizada (24h)",
     "tax_code": "txcd_10302000", "prices": [{"lookup_key": "reprise_standard", "amount": 3900, "currency": "eur"}]},
    {"emergent_product_id": "reprise_song_express", "name": "Reprise — Música personalizada Express (1h)",
     "tax_code": "txcd_10302000", "prices": [{"lookup_key": "reprise_express", "amount": 5900, "currency": "eur"}]},
]


def get_or_create_product(entry):
    for p in stripe.Product.list(active=True).auto_paging_iter():
        if p.to_dict().get("metadata", {}).get("emergent_product_id") == entry["emergent_product_id"]:
            return p
    return stripe.Product.create(name=entry["name"], tax_code=entry["tax_code"],
                                 metadata={"managed_by": "emergent", "emergent_product_id": entry["emergent_product_id"]})


for entry in CATALOG:
    product = get_or_create_product(entry)
    for p in entry["prices"]:
        existing = stripe.Price.list(lookup_keys=[p["lookup_key"]], active=True, limit=1).data
        if existing and (existing[0].unit_amount != p["amount"] or existing[0].currency != p["currency"]):
            stripe.Price.modify(existing[0].id, active=False)
            existing = []
        if not existing:
            stripe.Price.create(product=product.id, unit_amount=p["amount"], currency=p["currency"],
                                lookup_key=p["lookup_key"], transfer_lookup_key=True)
        print("ok", p["lookup_key"])
