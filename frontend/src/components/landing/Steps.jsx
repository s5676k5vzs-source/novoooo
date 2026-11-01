import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHead, Reveal } from "../Reveal";
import { STEPS, IMG } from "@/data/content";

export const Steps = () => (
  <section id="como-funciona" data-testid="how-it-works-section" className="relative py-24 md:py-32">
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHead eyebrow="Como funciona" title={<>Quatro passos.<br /><em className="text-gold-grad">Uma canção para sempre.</em></>} sub="Da sua história a uma música pronta a ouvir — sem precisar de escrever uma única rima." />
            <Reveal delay={0.1} className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block">
              <img src={IMG.guitar} alt="Guitarras em estúdio" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0d0914]/80 to-transparent" />
            </Reveal>
          </div>
        </div>
        <div className="space-y-5 lg:col-span-7">
          {STEPS.map((s, i) => (
            <motion.div key={s.n} data-testid={`step-card-${i + 1}`} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[var(--ink-2)] p-7 transition-colors duration-500 hover:border-[rgba(230,161,92,.35)] md:p-10">
              <div className="absolute -right-6 -top-10 font-display text-[9rem] leading-none text-white/[0.035] transition-colors duration-500 group-hover:text-[rgba(230,161,92,.08)]">{s.n}</div>
              <div className="relative flex flex-wrap items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-[rgba(230,161,92,.4)] font-mono text-sm text-[var(--gold)]">{s.n}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--mute)]">{s.tag}</span>
              </div>
              <h3 className="relative mt-6 font-display text-3xl md:text-4xl">{s.title}</h3>
              <p className="relative mt-3 max-w-lg text-[var(--mute)]">{s.text}</p>
            </motion.div>
          ))}
          <Reveal className="flex flex-wrap items-center gap-5 pt-6">
            <Link to="/criar" data-testid="steps-create-song-button" className="btn-gold">Começar a minha música <ArrowUpRight size={18} /></Link>
            <span className="text-sm text-[var(--mute)]">Demora apenas 5 minutos</span>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
