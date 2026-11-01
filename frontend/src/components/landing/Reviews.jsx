import { motion } from "framer-motion";
import { Star, BadgeCheck } from "lucide-react";
import { SectionHead } from "../Reveal";
import { REVIEWS, IMG } from "@/data/content";

const Stars = () => <div className="flex gap-0.5 text-[var(--gold)]">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>;

export const Reviews = () => (
  <section id="avaliacoes" data-testid="reviews-section" className="relative py-24 md:py-32">
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <SectionHead eyebrow="Avaliações" title={<>Histórias que <em className="text-gold-grad">viraram canções</em></>} sub="O que dizem as pessoas que ofereceram uma Reprise." />
      <div className="mt-14 grid auto-rows-[minmax(0,auto)] gap-5 md:grid-cols-6">
        <motion.article data-testid="review-featured" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9 }}
          className="relative overflow-hidden rounded-[2rem] md:col-span-3 md:row-span-2">
          <img src={IMG.elders} alt="Casal abraçado junto ao mar" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/70 to-[#0d0914]/10" />
          <div className="relative flex h-full min-h-[460px] flex-col justify-end p-8 md:p-10">
            <Stars />
            <h3 className="mt-5 font-display text-4xl leading-tight md:text-5xl">“{REVIEWS[2].title}”</h3>
            <p className="mt-4 max-w-md text-[var(--ivory)]/85">{REVIEWS[2].text}</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-[var(--mute)]"><BadgeCheck size={16} className="text-[var(--gold)]" />{REVIEWS[2].name} · {REVIEWS[2].ctx}</p>
          </div>
        </motion.article>
        {REVIEWS.filter((_, i) => i !== 2).map((r, i) => (
          <motion.article key={r.name} data-testid={`review-card-${i}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: (i % 2) * 0.08 }}
            className={`flex flex-col rounded-[2rem] border border-white/[0.07] bg-[var(--ink-2)] p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-[rgba(230,161,92,.3)] ${i === 4 ? "md:col-span-6 lg:col-span-6" : "md:col-span-3 lg:col-span-3"} ${i < 2 ? "" : ""}`}>
            <Stars />
            <h4 className="mt-4 font-display text-2xl">{r.title}</h4>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--mute)]">“{r.text}”</p>
            <p className="mt-5 text-sm"><span className="text-[var(--ivory)]">{r.name}</span> <span className="text-[var(--mute)]">· {r.ctx}</span></p>
          </motion.article>
        ))}
      </div>
      <p className="mt-6 text-xs text-[var(--mute)]">Depoimentos ilustrativos — substitua pelos testemunhos reais dos seus clientes.</p>
    </div>
  </section>
);
