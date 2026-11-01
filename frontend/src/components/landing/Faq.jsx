import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHead, Reveal } from "../Reveal";
import { FAQ, IMG } from "@/data/content";

export const Faq = () => (
  <section id="faq" data-testid="faq-section" className="relative py-24 md:py-32">
    <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:px-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <SectionHead eyebrow="Perguntas frequentes" title={<>Tudo o que <em className="text-gold-grad">quer saber</em></>} />
        <Reveal delay={0.1} className="mt-10 rounded-xl border border-white/[0.07] p-6">
          <p className="font-display text-2xl">Ainda tem dúvidas?</p>
          <p className="mt-2 text-sm text-[var(--mute)]">A nossa equipa responde a qualquer hora.</p>
          <a href="mailto:ola@reprise.pt" data-testid="faq-support-email" className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--gold)] hover:underline"><Mail size={15} />ola@reprise.pt</a>
        </Reveal>
      </div>
      <Reveal className="lg:col-span-8">
        <Accordion type="single" collapsible defaultValue="item-0" className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0">
              <AccordionTrigger data-testid={`faq-question-${i}`} className="py-7 text-left font-display text-2xl font-normal hover:no-underline md:text-3xl [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-[var(--gold)]">
                <span className="flex gap-5"><span className="mt-2 font-mono text-xs text-[var(--gold)]">0{i + 1}</span>{f.q}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-7 pl-10 text-base leading-relaxed text-[var(--mute)]">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  </section>
);

export const FinalCta = () => (
  <section data-testid="final-cta-section" className="relative px-5 pb-24 md:px-10 md:pb-32">
    <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-2xl border border-[rgba(255,106,61,.2)]">
      <img src={IMG.dance} alt="Casal a dançar numa sala iluminada" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(10,10,11,.4),#0a0a0b_75%)]" />
      <div className="relative grid items-center gap-10 p-8 py-16 md:p-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-6">O presente que fica</p>
          <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">Um presente que vão querer <em className="text-gold-grad">ouvir outra vez.</em></h2>
          <p className="mt-6 max-w-lg text-[var(--mute)] md:text-lg">Conte-nos a vossa história em minutos. Nós devolvemo-la em forma de canção.</p>
          <Link to="/criar" data-testid="final-create-song-button" className="btn-gold mt-10 text-base">Criar a minha música <ArrowUpRight size={18} /></Link>
          <p className="mt-6 text-sm text-[var(--mute)]">Reembolso garantido · Pronta em 24h · Revisões incluídas</p>
        </div>
        <motion.div initial={{ rotate: -30, opacity: 0 }} whileInView={{ rotate: 0, opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} className="mx-auto hidden w-64 lg:col-span-4 lg:block">
          <div className="vinyl-grooves spin-slow relative aspect-square rounded-full shadow-2xl">
            <div className="absolute inset-[32%] rounded-full bg-[var(--gold)]" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0a0b]" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
