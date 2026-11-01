import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 28, className = "", as = "div" }) => {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </M>
  );
};

export const MaskLines = ({ lines, className = "", delay = 0.15, stagger = 0.12 }) => (
  <span className={className}>
    {lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.08em]">
        <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }}
          transition={{ duration: 1.1, delay: delay + i * stagger, ease }}>
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);

export const SectionHead = ({ eyebrow, title, sub, align = "left", testid }) => (
  <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    <p className="eyebrow mb-5">{eyebrow}</p>
    <h2 data-testid={testid} className="font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">{title}</h2>
    {sub && <p className="mt-5 text-base text-[var(--mute)] md:text-lg">{sub}</p>}
  </Reveal>
);
