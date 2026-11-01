const WORDS = ["Aniversários", "Reconciliações", "Primeiras danças", "Bodas de ouro", "Pedidos de casamento", "Saudade", "Dia da Mãe", "Homenagens", "Amo-te"];

export const Marquee = () => (
  <section data-testid="editorial-marquee" className="relative overflow-hidden border-y border-white/5 py-7">
    <div className="marquee-track">
      {[...WORDS, ...WORDS].map((w, i) => (
        <span key={i} className="flex items-center whitespace-nowrap font-display text-3xl italic text-white/35 md:text-5xl">
          <span className="px-8 md:px-12">{w}</span>
          <span className="text-xl not-italic text-[var(--gold)]/70">✦</span>
        </span>
      ))}
    </div>
  </section>
);
