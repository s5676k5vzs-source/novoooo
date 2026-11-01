import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { SectionHead } from "../Reveal";
import { AudioPlayer } from "../AudioPlayer";
import { SAMPLES, GENRES } from "@/data/content";

export const Samples = () => {
  const [active, setActive] = useState(0);
  const [genre, setGenre] = useState(0);
  const s = SAMPLES[active];
  const src = genre === 0 ? s.src : `/samples/s${((active + genre) % 3) + 1}.mp3`;
  return (
    <section id="exemplos" data-testid="samples-section" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(230,161,92,.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <SectionHead eyebrow="Exemplos" title={<>Ouça como o seu momento <em className="text-gold-grad">pode soar.</em></>} sub="Escolha a ocasião e descubra canções criadas para histórias como a sua." />
        <div data-lenis-prevent className="no-scrollbar -mx-5 mt-12 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {SAMPLES.map((x, i) => (
            <button key={x.key} data-testid={`samples-tab-${x.key}`} onClick={() => { setActive(i); setGenre(0); }}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 ${i === active ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--ink)]" : "border-white/12 text-[var(--mute)] hover:border-white/30 hover:text-[var(--ivory)]"}`}>
              {x.label}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <motion.div key={s.key} initial={{ opacity: 0.4, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[var(--ink-2)] lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-2)] via-[var(--ink-2)]/30 to-transparent" />
              <div className="absolute left-6 top-6 flex gap-2">
                <span className="glass rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em]">{s.label}</span>
                <span className="glass rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--gold)]">{GENRES[genre] === GENRES[0] ? s.genre : GENRES[genre]}</span>
              </div>
              <div className="absolute inset-x-6 bottom-4 md:inset-x-8">
                <p data-testid="samples-current-title" className="font-display text-4xl md:text-5xl">{s.title}</p>
                <p className="mt-2 font-display text-lg italic text-[var(--ivory)]/70">“{s.lyric[0]} / {s.lyric[1]}”</p>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <AudioPlayer src={src} testid="samples-audio-player" />
              <div className="mt-6 flex flex-wrap gap-2">
                {GENRES.map((g, i) => (
                  <button key={g} data-testid={`samples-genre-${i}`} onClick={() => setGenre(i)}
                    className={`rounded-full px-4 py-1.5 text-xs transition-colors ${i === genre ? "bg-white/12 text-[var(--ivory)]" : "text-[var(--mute)] hover:text-[var(--ivory)]"}`}>{i === 0 ? s.genre : g}</button>
                ))}
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col justify-between rounded-[2rem] border border-white/[0.07] p-7 md:p-10 lg:col-span-5">
            <div>
              <h3 className="font-display text-4xl">{s.label}</h3>
              <p className="mt-4 text-[var(--mute)]">{s.blurb}</p>
              <ul className="mt-7 space-y-3.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(230,161,92,.15)] text-[var(--gold)]"><Check size={12} /></span>{b}</li>
                ))}
              </ul>
            </div>
            <div className="mt-10">
              <Link to="/criar" data-testid="samples-create-song-button" className="btn-gold">Criar a minha música <ArrowUpRight size={18} /></Link>
              <p className="mt-4 text-xs text-[var(--mute)]">Áudios de demonstração [substituir pelas suas faixas reais]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
