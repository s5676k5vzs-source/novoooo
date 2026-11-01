import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "../Reveal";
import { OCCASIONS } from "@/data/content";

const SPAN = ["md:col-span-2 md:row-span-2", "", "", "", "", "md:col-span-2", "", "", "md:col-span-2", "", "", "md:col-span-4"];

export const Occasions = () => (
  <section id="ocasioes" data-testid="occasions-section" className="relative py-24 md:py-32">
    <div className="mx-auto max-w-[1400px] px-5 md:px-10">
      <SectionHead eyebrow="Ocasiões" title={<>Uma canção para <em className="text-gold-grad">cada capítulo</em></>} sub="Uma celebração, uma homenagem ou um recomeço — escrevemos a música certa para o seu momento." />
      <div className="mt-14 grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
        {OCCASIONS.map((o, i) => (
          <motion.div key={o.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, delay: (i % 5) * 0.06 }} className={SPAN[i]}>
            <Link to={`/criar?ocasiao=${encodeURIComponent(o.label)}`} data-testid={`occasion-tile-${i}`} className="group relative block h-full overflow-hidden rounded-xl">
              <img src={o.img} alt={o.label} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/90 via-[#0a0a0b]/25 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                <span className={`font-display leading-none ${i === 0 ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{o.label}</span>
                <span className="grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-[var(--gold)] text-[var(--ink)] opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={16} /></span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
