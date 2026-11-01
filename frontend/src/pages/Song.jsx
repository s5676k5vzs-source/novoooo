import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Download, Loader2, Music2, PenLine, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Logo, LogoMark } from "@/components/Logo";
import { AudioPlayer } from "@/components/AudioPlayer";
import { MaskLines } from "@/components/Reveal";
import { http, apiError, API } from "@/lib/api";

const Lyrics = ({ text }) => {
  const lines = (text || "").split("\n");
  const title = lines[0]?.startsWith("Título:") ? lines.shift().replace("Título:", "").trim() : null;
  return (
    <div data-testid="song-lyrics">
      {title && <p className="mb-8 font-display text-3xl italic text-[var(--gold)]">{title}</p>}
      <div className="space-y-1">
        {lines.map((l, i) => /^\[.*\]$/.test(l.trim())
          ? <p key={i} className="eyebrow pt-6 text-[var(--rose)]">{l.trim().slice(1, -1)}</p>
          : <p key={i} className="font-display text-xl leading-relaxed md:text-2xl">{l || "\u00a0"}</p>)}
      </div>
    </div>
  );
};

export default function Song() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [error, setError] = useState("");
  const [rev, setRev] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let timer;
    const load = async () => {
      try {
        const { data } = await http.get(`/songs/${id}`);
        setSong(data);
        if (data?.payment_status === "paid" && (!data.has_audio || data.lyrics_status === "writing" || data.lyrics_status === "idle")) timer = setTimeout(load, 5000);
      } catch (e) { setError(apiError(e)); }
    };
    load();
    return () => clearTimeout(timer);
  }, [id]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: "Uma música para ti", url }); } catch { /* cancelled */ } return; }
    await navigator.clipboard.writeText(url);
    toast.success("Link copiado");
  };
  const sendRevision = async () => {
    setSending(true);
    try { await http.post(`/songs/${id}/revision`, { message: rev }); setRev(""); toast.success("Pedido de revisão enviado"); }
    catch (e) { toast.error(apiError(e)); }
    setSending(false);
  };

  if (error) return <main className="grid min-h-screen place-items-center px-5 text-center"><div><h1 className="font-display text-5xl">Música não encontrada</h1><p className="mt-3 text-[var(--mute)]">{error}</p></div></main>;
  if (!song) return <main className="grid min-h-screen place-items-center"><Loader2 className="animate-spin text-[var(--gold)]" /></main>;

  const paid = song.payment_status === "paid";
  return (
    <main data-testid="song-page" className="relative min-h-screen pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(230,161,92,.16),transparent_60%)]" />
      <header className="relative mx-auto flex max-w-[1100px] items-center justify-between px-5 py-6 md:px-10">
        <Logo />
        <button data-testid="song-share-button" onClick={share} className="btn-ghost !px-4 !py-2.5 text-sm"><Share2 size={15} />Partilhar</button>
      </header>
      <section className="relative mx-auto max-w-[1100px] px-5 pt-12 md:px-10">
        <p className="eyebrow">{song.occasion} · {song.genre} · Voz {song.voice.toLowerCase()}</p>
        <h1 data-testid="song-title" className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-8xl">
          <MaskLines lines={["Uma canção para", <em key="n" className="text-gold-grad">{song.recipient_name}</em>]} />
        </h1>
        <p className="mt-6 text-[var(--mute)]">Com amor, de {song.customer_name}.</p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass mt-12 rounded-[2rem] p-6 md:p-8">
          {!paid && <p data-testid="song-status-unpaid" className="text-[var(--mute)]">Este pedido aguarda pagamento.</p>}
          {paid && song.has_audio && (
            <>
              <AudioPlayer src={`${API}/songs/${id}/audio`} testid="song-audio-player" />
              <a href={`${API}/songs/${id}/audio`} download data-testid="song-download-link" className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--gold)] hover:underline"><Download size={15} />Descarregar MP3</a>
            </>
          )}
          {paid && !song.has_audio && (
            <div data-testid="song-status-production" className="flex items-center gap-5">
              <div className="relative"><div className="vinyl-grooves spin-slow h-16 w-16 rounded-full" /><div className="absolute inset-[34%] rounded-full bg-[var(--gold)]" /></div>
              <div><p className="font-display text-2xl">Em produção no estúdio</p><p className="text-sm text-[var(--mute)]">Entrega {song.delivery === "express" ? "Express (~1h)" : "em até 24h"}. Esta página atualiza sozinha.</p></div>
            </div>
          )}
        </motion.div>
      </section>

      {paid && (
        <section className="relative mx-auto mt-16 grid max-w-[1100px] gap-10 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 flex items-center gap-2"><Music2 size={14} />Letra</p>
            {song.lyrics_status === "done" && song.lyrics ? <Lyrics text={song.lyrics} /> : song.lyrics_status === "failed"
              ? <p className="text-[var(--mute)]">A letra está a ser revista pela nossa equipa.</p>
              : <p data-testid="song-lyrics-writing" className="flex items-center gap-3 text-[var(--mute)]"><Loader2 size={16} className="animate-spin" />A escrever a letra com base na vossa história…</p>}
          </div>
          <aside className="space-y-5 lg:col-span-5">
            <div className="rounded-[1.5rem] border border-white/[0.07] p-6">
              <p className="eyebrow mb-3 flex items-center gap-2"><PenLine size={14} />Pedir revisão</p>
              <textarea data-testid="song-revision-textarea" value={rev} onChange={(e) => setRev(e.target.value)} rows={4} maxLength={1500} placeholder="Ex.: mudar o verso 2 para mencionar a viagem a Sintra…"
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm outline-none focus:border-[var(--gold)]" />
              <button data-testid="song-revision-submit-button" disabled={rev.trim().length < 3 || sending} onClick={sendRevision} className="btn-gold mt-3 !py-2.5 text-sm disabled:opacity-40"><Send size={14} />Enviar</button>
            </div>
            <button data-testid="song-copy-link-button" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copiado"); }} className="btn-ghost w-full justify-center"><Copy size={15} />Copiar link privado</button>
            <div className="flex items-center gap-3 pt-4 text-xs text-[var(--mute)]"><LogoMark size={22} />Página privada — só quem tem o link pode ouvir.</div>
          </aside>
        </section>
      )}
    </main>
  );
}
