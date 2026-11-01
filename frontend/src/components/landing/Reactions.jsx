import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHead } from "../Reveal";
import { REACTIONS } from "@/data/content";

export const Reactions = () => {
  const track = useRef(null);
  const scroll = (d) => track.current?.scrollBy({ left: d * 320, behavior: "smooth" });
  return (
    <section data-testid="reactions-section" className="relative py-24 md:py-32">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <SectionHead eyebrow="Reações reais" title={<>O momento em que <em className="text-gold-grad">a música começa</em></>} sub="Aquele segundo em que a pessoa percebe que a canção é sobre ela." />
        <div className="flex gap-3">
          <button data-testid="reactions-prev-button" onClick={() => scroll(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition-colors hover:border-[var(--gold)]" aria-label="Anterior"><ChevronLeft size={18} /></button>
          <button data-testid="reactions-next-button" onClick={() => scroll(1)} className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition-colors hover:border-[var(--gold)]" aria-label="Seguinte"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div ref={track} data-lenis-prevent className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:px-10">
        {REACTIONS.map((r, i) => (
          <motion.figure key={i} data-testid={`reaction-card-${i}`} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8, delay: (i % 4) * 0.08 }}
            className="group relative aspect-[3/4] w-[78vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[1.75rem]">
            <img src={r.img} alt={`Reação de ${r.name}`} loading="lazy" className="h-full w-full object-cover grayscale-[35%] transition-[transform,filter] duration-[1.2s] group-hover:scale-105 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_30%,rgba(13,9,20,.5))]" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6">
              <Quote size={18} className="mb-3 text-[var(--gold)]" />
              <p className="font-display text-2xl">{r.name}</p>
              <p className="text-sm text-[var(--mute)]">{r.ctx}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
};
