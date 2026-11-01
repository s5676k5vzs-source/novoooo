import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, Zap, ShieldCheck, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { http, apiError } from "@/lib/api";
import { RECIPIENTS, OCCASION_OPTS, GENRE_OPTS, VOICES, MOODS, STORY_PROMPTS, PRICES } from "@/data/content";

const KEY = "reprise_draft";
const EMPTY = { recipient: "", recipient_name: "", occasion: "", genre: "", voice: "", mood: "", story: "", customer_name: "", email: "", delivery: "standard" };
const TOTAL = 8;
const ease = [0.22, 1, 0.36, 1];

const Chip = ({ active, onClick, children, testid, hint }) => (
  <button type="button" data-testid={testid} onClick={onClick}
    className={`group relative rounded-2xl border px-4 py-4 text-left transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 ${active ? "border-[var(--gold)] bg-[rgba(255,106,61,.12)]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
    <span className="flex items-center justify-between gap-2">
      <span className="font-medium">{children}</span>
      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors ${active ? "bg-[var(--gold)] text-[var(--ink)]" : "border border-white/20"}`}>{active && <Check size={12} />}</span>
    </span>
    {hint && <span className="mt-1 block text-xs text-[var(--mute)]">{hint}</span>}
  </button>
);

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Create() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => {
    try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return EMPTY; }
  });
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const o = params.get("ocasiao");
    if (o && OCCASION_OPTS.includes(o)) setForm((f) => ({ ...f, occasion: o }));
  }, [params]);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(form)); }, [form]);
  useEffect(() => { window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo(0, 0); }, [step]);

  const valid = useMemo(() => ({
    1: !!form.recipient, 2: form.recipient_name.trim().length > 0, 3: !!form.occasion, 4: !!form.genre,
    5: !!form.voice && !!form.mood, 6: form.story.trim().length >= 20,
    7: form.customer_name.trim().length > 0 && /^\S+@\S+\.\S+$/.test(form.email), 8: true,
  }), [form]);

  const next = () => valid[step] && setStep((s) => Math.min(TOTAL, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const checkout = async () => {
    setBusy(true);
    try {
      const { data: order } = await http.post("/orders", form);
      localStorage.setItem("reprise_last_order", order.id);
      const { data } = await http.post("/payments/checkout", { order_id: order.id, origin_url: window.location.origin });
      window.location.href = data.checkout_url;
    } catch (e) {
      toast.error(apiError(e));
      setBusy(false);
    }
  };

  const name = form.recipient_name || "essa pessoa";
  const STEPS = {
    1: { q: "Para quem é esta música?", sub: "Escolha a pessoa que a vai ouvir.", body: (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {RECIPIENTS.map((r) => <Chip key={r} testid={`wizard-step-1-chip-${slug(r)}`} active={form.recipient === r} onClick={() => set("recipient", r)}>{r}</Chip>)}
      </div>) },
    2: { q: "Como se chama?", sub: "O nome vai aparecer na letra — escreva como gosta de o ouvir.", body: (
      <input data-testid="wizard-recipient-name-input" autoFocus value={form.recipient_name} onChange={(e) => set("recipient_name", e.target.value)} onKeyDown={(e) => e.key === "Enter" && next()}
        placeholder="Ex.: Clara, Mãe, Pedrinho…" maxLength={60}
        className="w-full border-b-2 border-white/15 bg-transparent pb-4 font-display text-4xl outline-none transition-colors placeholder:text-white/20 focus:border-[var(--gold)] md:text-6xl" />) },
    3: { q: `Qual é a ocasião?`, sub: `O que vamos celebrar com ${name}?`, body: (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {OCCASION_OPTS.map((o) => <Chip key={o} testid={`wizard-step-3-chip-${slug(o)}`} active={form.occasion === o} onClick={() => set("occasion", o)}>{o}</Chip>)}
      </div>) },
    4: { q: "Que estilo musical?", sub: "Escolha o som que mais combina convosco.", body: (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {GENRE_OPTS.map((g) => <Chip key={g.label} testid={`wizard-step-4-chip-${slug(g.label)}`} hint={g.hint} active={form.genre === g.label} onClick={() => set("genre", g.label)}>{g.label}</Chip>)}
      </div>) },
    5: { q: "Voz e emoção", sub: "Quem canta e como deve soar.", body: (
      <div className="space-y-8">
        <div><p className="eyebrow mb-3">Voz</p><div className="grid grid-cols-3 gap-3">{VOICES.map((v) => <Chip key={v} testid={`wizard-step-5-voice-${slug(v)}`} active={form.voice === v} onClick={() => set("voice", v)}>{v}</Chip>)}</div></div>
        <div><p className="eyebrow mb-3">Tom</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{MOODS.map((m) => <Chip key={m} testid={`wizard-step-5-mood-${slug(m)}`} active={form.mood === m} onClick={() => set("mood", m)}>{m}</Chip>)}</div></div>
      </div>) },
    6: { q: "Conte-nos a vossa história", sub: "Quanto mais detalhes, mais pessoal fica a canção. Nomes, lugares, frases, manias.", body: (
      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          {STORY_PROMPTS.map((p, i) => (
            <button key={p} type="button" data-testid={`wizard-story-prompt-${i}`} onClick={() => set("story", `${form.story}${form.story ? "\n" : ""}${p} `)}
              className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-[var(--mute)] transition-colors hover:border-[var(--gold)] hover:text-[var(--ivory)]">+ {p}</button>
          ))}
        </div>
        <textarea data-testid="wizard-story-textarea" value={form.story} onChange={(e) => set("story", e.target.value)} maxLength={4000} rows={9}
          placeholder={`Conhecemo-nos num concerto em 2015… ${name} ri-se sempre que…`}
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-base leading-relaxed outline-none transition-colors placeholder:text-white/25 focus:border-[var(--gold)]" />
        <div className="mt-2 flex justify-between text-xs text-[var(--mute)]"><span>{form.story.trim().length < 20 ? "Mínimo 20 caracteres" : "Perfeito — continue se quiser"}</span><span>{form.story.length}/4000</span></div>
      </div>) },
    7: { q: "Para onde enviamos?", sub: "Enviamos a música pronta para este e-mail.", body: (
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block"><span className="eyebrow">O seu nome</span>
          <input data-testid="wizard-customer-name-input" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} maxLength={80} placeholder="O seu nome"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none focus:border-[var(--gold)]" /></label>
        <label className="block"><span className="eyebrow">E-mail</span>
          <input data-testid="wizard-email-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="nome@email.com"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none focus:border-[var(--gold)]" /></label>
        <p className="flex items-center gap-2 text-xs text-[var(--mute)] md:col-span-2"><Lock size={13} />Nunca partilhamos os seus dados.</p>
      </div>) },
    8: { q: "Reveja e finalize", sub: `A música para ${name} está quase a nascer.`, body: (
      <div className="grid gap-6 lg:grid-cols-5">
        <div data-testid="wizard-summary" className="rounded-xl border border-white/10 bg-white/[0.02] p-6 lg:col-span-2">
          {[["Para", `${form.recipient_name} (${form.recipient})`], ["Ocasião", form.occasion], ["Estilo", form.genre], ["Voz", `${form.voice} · ${form.mood}`], ["E-mail", form.email]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-white/[0.06] py-3 text-sm last:border-0"><span className="text-[var(--mute)]">{k}</span><span className="truncate text-right">{v}</span></div>
          ))}
          <p className="mt-4 line-clamp-3 text-sm italic text-[var(--mute)]">“{form.story}”</p>
          <button data-testid="wizard-edit-story-button" onClick={() => setStep(6)} className="mt-3 text-xs text-[var(--gold)] hover:underline">Editar história</button>
        </div>
        <div className="space-y-3 lg:col-span-3">
          {[["standard", "Entrega Standard", "Pronta em 24 horas", Clock], ["express", "Entrega Express", "Pronta em cerca de 1 hora", Zap]].map(([k, t, d, Icon]) => (
            <button key={k} data-testid={`wizard-delivery-${k}`} onClick={() => set("delivery", k)}
              className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-colors ${form.delivery === k ? "border-[var(--gold)] bg-[rgba(255,106,61,.1)]" : "border-white/10 hover:border-white/25"}`}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/5 text-[var(--gold)]"><Icon size={18} /></span>
              <span className="flex-1"><span className="block font-medium">{t}</span><span className="text-sm text-[var(--mute)]">{d}</span></span>
              <span className="font-display text-3xl">€{PRICES[k]}</span>
            </button>
          ))}
          <ul className="space-y-2 pt-3 text-sm text-[var(--mute)]">
            {["Letra original escrita a partir da sua história", "Música completa com voz e produção", "Página privada para ouvir e partilhar", "Revisões incluídas"].map((x) => <li key={x} className="flex gap-2"><Check size={16} className="text-[var(--gold)]" />{x}</li>)}
          </ul>
          <div className="flex items-center justify-between border-t border-white/10 pt-5">
            <span className="text-[var(--mute)]">Total</span><span data-testid="wizard-total-price" className="font-display text-4xl">€{PRICES[form.delivery]}</span>
          </div>
          <button data-testid="wizard-checkout-button" disabled={busy} onClick={checkout} className="btn-gold w-full justify-center text-base disabled:opacity-60">
            {busy ? <><Loader2 size={18} className="animate-spin" />A preparar pagamento…</> : <>Pagar e criar a música <ArrowRight size={18} /></>}
          </button>
          <p className="flex items-center justify-center gap-2 text-xs text-[var(--mute)]"><ShieldCheck size={14} />Pagamento seguro via Stripe · Reembolso garantido</p>
        </div>
      </div>) },
  };
  const cur = STEPS[step];

  return (
    <main data-testid="create-page" className="relative min-h-screen pb-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,106,61,.08),transparent_60%)]" />
      <header className="relative mx-auto flex max-w-[1100px] items-center justify-between px-5 py-6 md:px-10">
        <Logo />
        <Link to="/" data-testid="wizard-exit-link" className="text-sm text-[var(--mute)] hover:text-[var(--ivory)]">Sair</Link>
      </header>
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-10">
        <div className="mt-4 flex items-center justify-between font-mono text-xs text-[var(--mute)]">
          <span data-testid="wizard-step-indicator">Passo {step} de {TOTAL}</span><span>{Math.round((step / TOTAL) * 100)}% concluído</span>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--rose)]" animate={{ width: `${(step / TOTAL) * 100}%` }} transition={{ duration: 0.6, ease }} />
        </div>
        <motion.div key={step} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mt-14">
          <h1 data-testid="wizard-question" className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{cur.q}</h1>
          <p className="mt-3 text-[var(--mute)] md:text-lg">{cur.sub}</p>
          <div className="mt-10">{cur.body}</div>
        </motion.div>
      </div>
      {step < TOTAL && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-[rgba(10,10,11,.9)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-4 md:px-10">
            <button data-testid="wizard-back-button" onClick={back} disabled={step === 1} className="btn-ghost !py-3 disabled:opacity-30"><ArrowLeft size={16} />Voltar</button>
            <button data-testid="wizard-next-step-button" onClick={next} disabled={!valid[step]} className="btn-gold !py-3 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:transform-none">Seguinte<ArrowRight size={16} /></button>
          </div>
        </div>
      )}
      {step === TOTAL && (
        <div className="mx-auto mt-10 max-w-[1100px] px-5 md:px-10">
          <button data-testid="wizard-back-button" onClick={back} className="btn-ghost !py-3"><ArrowLeft size={16} />Voltar</button>
        </div>
      )}
    </main>
  );
}
