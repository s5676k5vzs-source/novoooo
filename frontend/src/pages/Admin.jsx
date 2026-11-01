import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, LogOut, Upload, RefreshCw, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { http, apiError } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const STATUS = { awaiting_payment: "Aguarda pagamento", in_production: "Em produção", revision: "Revisão", completed: "Concluído" };
const FILTERS = ["all", "in_production", "revision", "completed", "awaiting_payment"];

const Login = ({ onOk }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { const { data } = await http.post("/auth/login", { email, password }); onOk(data); }
    catch (err) { toast.error(apiError(err)); }
    setBusy(false);
  };
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} data-testid="admin-login-form" className="glass w-full max-w-sm rounded-[2rem] p-8">
        <Logo />
        <h1 className="mt-8 font-display text-4xl">Painel do estúdio</h1>
        <input data-testid="admin-login-email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-[var(--gold)]" />
        <input data-testid="admin-login-password-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Palavra-passe" className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 outline-none focus:border-[var(--gold)]" />
        <button data-testid="admin-login-submit-button" disabled={busy} className="btn-gold mt-6 w-full justify-center">{busy ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}</button>
      </form>
    </main>
  );
};

const OrderDialog = ({ order, onClose, onChanged }) => {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  if (!order) return null;
  const upload = async () => {
    setBusy(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      await http.post(`/admin/orders/${order.id}/audio`, fd);
      toast.success("Áudio enviado — pedido concluído"); setFile(null); onChanged();
    } catch (e) { toast.error(apiError(e)); }
    setBusy(false);
  };
  const setStatus = async (status) => {
    try { await http.patch(`/admin/orders/${order.id}`, { status }); onChanged(); } catch (e) { toast.error(apiError(e)); }
  };
  const regen = async () => {
    try { await http.post(`/admin/orders/${order.id}/lyrics`); toast.success("A reescrever a letra…"); setTimeout(onChanged, 1500); } catch (e) { toast.error(apiError(e)); }
  };
  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-testid="admin-order-dialog" className="max-h-[90vh] max-w-3xl overflow-y-auto border-white/10 bg-[var(--ink-2)]" data-lenis-prevent>
        <DialogHeader><DialogTitle className="font-display text-3xl font-normal">Para {order.recipient_name} <span className="text-[var(--mute)]">· {order.occasion}</span></DialogTitle></DialogHeader>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          {[["Cliente", `${order.customer_name} · ${order.email}`], ["Relação", order.recipient], ["Estilo", order.genre], ["Voz / tom", `${order.voice} · ${order.mood}`], ["Entrega", order.delivery === "express" ? "Express (1h)" : "Standard (24h)"], ["Pagamento", order.payment_status]].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white/[0.03] p-3"><p className="text-xs text-[var(--mute)]">{k}</p><p className="mt-1 break-words">{v}</p></div>
          ))}
        </div>
        <div><p className="eyebrow mb-2">História</p><p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 text-sm text-[var(--mute)]">{order.story}</p></div>
        {order.revisions?.length > 0 && <div><p className="eyebrow mb-2">Revisões pedidas</p>{order.revisions.map((r, i) => <p key={i} className="mb-2 rounded-xl border border-[var(--rose)]/30 p-3 text-sm">{r.message}</p>)}</div>}
        <div>
          <div className="mb-2 flex items-center justify-between"><p className="eyebrow">Letra (IA) · {order.lyrics_status}</p>
            <button data-testid="admin-regenerate-lyrics-button" onClick={regen} className="flex items-center gap-1 text-xs text-[var(--gold)]"><RefreshCw size={12} />Reescrever</button></div>
          <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white/[0.03] p-4 font-sans text-sm">{order.lyrics || "—"}</pre>
        </div>
        <div className="rounded-xl border border-dashed border-white/15 p-4">
          <p className="eyebrow mb-3">Enviar áudio final</p>
          <div className="flex flex-wrap items-center gap-3">
            <input data-testid="admin-audio-file-input" type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-[var(--ivory)]" />
            <button data-testid="admin-order-upload-audio-button" disabled={!file || busy} onClick={upload} className="btn-gold !py-2.5 text-sm disabled:opacity-40">{busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}Enviar</button>
          </div>
          {order.has_audio && <p className="mt-2 text-xs text-emerald-400">Áudio já anexado (enviar outro substitui).</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(STATUS).map(([k, v]) => (
            <button key={k} data-testid={`admin-status-${k}`} onClick={() => setStatus(k)} className={`rounded-full px-3 py-1.5 text-xs ${order.status === k ? "bg-[var(--gold)] text-[var(--ink)]" : "border border-white/10 text-[var(--mute)]"}`}>{v}</button>
          ))}
          <Link to={`/musica/${order.id}`} target="_blank" data-testid="admin-open-song-page" className="ml-auto flex items-center gap-1 text-xs text-[var(--gold)]"><ExternalLink size={12} />Página do cliente</Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    try { const { data } = await http.get("/admin/orders"); setOrders(Array.isArray(data) ? data : []); } catch (e) { toast.error(apiError(e)); }
  }, []);
  useEffect(() => { http.get("/auth/me").then((r) => setUser(r.data)).catch(() => setUser(false)); }, []);
  useEffect(() => { if (user) load(); }, [user, load]);

  if (user === null) return <main className="grid min-h-screen place-items-center"><Loader2 className="animate-spin text-[var(--gold)]" /></main>;
  if (!user) return <Login onOk={setUser} />;
  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const open = orders.find((o) => o.id === openId) || null;

  return (
    <main data-testid="admin-dashboard" className="mx-auto max-w-[1300px] px-5 py-6 md:px-10">
      <header className="flex items-center justify-between"><Logo />
        <button data-testid="admin-logout-button" onClick={async () => { await http.post("/auth/logout"); setUser(false); }} className="btn-ghost !px-4 !py-2 text-sm"><LogOut size={14} />Sair</button>
      </header>
      <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl">Pedidos</h1>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => <button key={f} data-testid={`admin-filter-${f}`} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-xs ${filter === f ? "bg-[var(--ivory)] text-[var(--ink)]" : "border border-white/10 text-[var(--mute)]"}`}>{f === "all" ? "Todos" : STATUS[f]} ({f === "all" ? orders.length : orders.filter((o) => o.status === f).length})</button>)}
        </div>
      </div>
      <div className="mt-8 overflow-x-auto rounded-[1.5rem] border border-white/[0.07]">
        <table data-testid="admin-orders-table" className="w-full min-w-[760px] text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-[var(--mute)]">
            <tr>{["Data", "Para", "Ocasião", "Cliente", "Entrega", "Estado", ""].map((h) => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-[var(--mute)]">Sem pedidos.</td></tr>}
            {list.map((o) => (
              <tr key={o.id} data-testid={`admin-order-row-${o.id}`} className="border-t border-white/[0.05] hover:bg-white/[0.02]">
                <td className="px-5 py-4 text-[var(--mute)]">{new Date(o.created_at).toLocaleDateString("pt-PT")}</td>
                <td className="px-5 py-4 font-medium">{o.recipient_name}</td>
                <td className="px-5 py-4">{o.occasion}</td>
                <td className="px-5 py-4 text-[var(--mute)]">{o.email}</td>
                <td className="px-5 py-4">{o.delivery === "express" ? "Express" : "24h"}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${o.status === "completed" ? "bg-emerald-500/15 text-emerald-300" : o.status === "awaiting_payment" ? "bg-white/5 text-[var(--mute)]" : "bg-[rgba(230,161,92,.15)] text-[var(--gold)]"}`}>{STATUS[o.status]}</span></td>
                <td className="px-5 py-4 text-right"><button data-testid={`admin-order-open-${o.id}`} onClick={() => setOpenId(o.id)} className="text-[var(--gold)] hover:underline">Abrir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderDialog order={open} onClose={() => setOpenId(null)} onChanged={load} />
    </main>
  );
}
