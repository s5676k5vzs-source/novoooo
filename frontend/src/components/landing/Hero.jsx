import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Play, Pause, Clock, ShieldCheck, Star } from "lucide-react";
import { MaskLines } from "../Reveal";
import { IMG } from "@/data/content";

const ease = [0.22, 1, 0.36, 1];

const Vinyl = ({ playing }) => {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 18 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <div onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }} className="relative aspect-square w-full [perspective:1200px]">
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative h-full w-full">
        <div className={`vinyl-grooves absolute inset-0 rounded-full shadow-[0_40px_120px_-20px_rgba(0,0,0,.9),inset_0_0_0_1px_rgba(255,255,255,.06)] ${playing ? "spin-slow" : "spin-slow [animation-play-state:paused]"}`}>
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,transparent_0deg,rgba(255,255,255,.09)_40deg,transparent_80deg,transparent_200deg,rgba(255,255,255,.06)_240deg,transparent_280deg)]" />
          <div className="absolute inset-[30%] overflow-hidden rounded-full ring-4 ring-[#0a0a0b]">
            <img src={IMG.hero} alt="Casal a dançar ao pôr do sol" fetchpriority="high" decoding="async" width="600" height="600" className="h-full w-full scale-125 object-cover" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(10,10,11,.55))]" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0a0b] ring-2 ring-[var(--gold)]" />
        </div>
        <div style={{ transform: "translateZ(60px)" }} className="glass absolute -left-2 bottom-[8%] flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-8">
          <div className="flex h-8 items-end gap-[3px]">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`eq-bar w-[3px] rounded-full bg-[var(--gold)] ${playing ? "" : "[animation-play-state:paused]"}`} style={{ height: "100%", animationDelay: `${i * 0.13}s` }} />
            ))}
          </div>
          <div>
            <p className="font-mono text-[11px] text-[var(--gold)]">● a tocar agora</p>
            <p className="text-base font-medium leading-tight">Volta a Tocar</p>
          </div>
        </div>
        <div style={{ transform: "translateZ(90px)" }} className="glass absolute -right-1 top-[10%] rounded-2xl px-4 py-3 sm:-right-6">
          <div className="flex gap-0.5 text-[var(--gold)]">{[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</div>
          <p className="mt-1 text-xs text-[var(--mute)]">“Voltámos a falar nessa noite.”</p>
        </div>
      </motion.div>
    </div>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yArt = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); }
  };
  return (
    <section ref={ref} data-testid="hero-section" className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_50%_0%,#000_30%,transparent_75%)]" />
      <audio ref={audio} src="/samples/s2.mp3" preload="none" onEnded={() => setPlaying(false)} />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <motion.div style={{ y: yText }} className="lg:col-span-7">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="eyebrow mb-7 flex items-center gap-3">
            músicas personalizadas · feitas para emocionar
          </motion.p>
          <h1 data-testid="hero-title" className="font-display text-[3rem] leading-[0.95] sm:text-7xl lg:text-[6.4rem]">
            <MaskLines lines={["Cada amor", <>merece a sua</>, <span key="e" className="text-[var(--gold)]">reprise.</span>]} />
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.7, ease }} className="mt-8 max-w-xl text-base text-[var(--mute)] md:text-lg">
            Conte-nos a vossa história. Nós transformamo-la numa canção original — para declarar, celebrar ou fazer alguém voltar a sentir o que sentiu no primeiro dia.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.85, ease }} className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/criar" data-testid="hero-create-song-button" className="btn-gold text-base">Criar a minha música <ArrowUpRight size={18} /></Link>
            <button onClick={toggle} data-testid="hero-listen-example-button" className="btn-ghost">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--ivory)] text-[var(--ink)]">{playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}</span>
              {playing ? "A ouvir exemplo" : "Ouvir exemplo"}
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.05 }} className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[var(--mute)]">
            <span data-testid="hero-badge-ready" className="flex items-center gap-2"><Clock size={16} className="text-[var(--gold)]" />Pronta em 24h · Express em 1h</span>
            <span data-testid="hero-badge-guarantee" className="flex items-center gap-2"><ShieldCheck size={16} className="text-[var(--gold)]" />Garantia de reembolso total</span>
          </motion.div>
        </motion.div>
        <motion.div style={{ y: yArt }} initial={{ opacity: 0, scale: 0.9, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.6, delay: 0.2, ease }} className="mx-auto w-full max-w-[520px] lg:col-span-5">
          <Vinyl playing={playing} />
        </motion.div>
      </div>
    </section>
  );
};
