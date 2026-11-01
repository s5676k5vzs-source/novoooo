import { Link } from "react-router-dom";
import { ShieldCheck, Clock, Mail } from "lucide-react";
import { LogoMark } from "./Logo";

export const Footer = () => (
  <footer data-testid="site-footer" className="relative overflow-hidden border-t border-white/5 bg-[#09060e] pt-20">
    <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-12 md:px-10">
      <div className="md:col-span-5">
        <LogoMark size={44} />
        <p className="mt-6 max-w-sm text-[var(--mute)]">Músicas originais escritas a partir da sua história — para declarar, celebrar ou fazer um amor voltar a tocar.</p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs text-[var(--mute)]">
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"><ShieldCheck size={14} className="text-[var(--gold)]" />Garantia de reembolso</span>
          <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"><Clock size={14} className="text-[var(--gold)]" />Pronta em 24h</span>
          <span className="rounded-full border border-white/10 px-3 py-1.5">€ EUR</span>
        </div>
      </div>
      <div className="md:col-span-2">
        <p className="eyebrow mb-4">Reprise</p>
        <ul className="space-y-2.5 text-sm text-[var(--mute)]">
          <li><Link to="/criar" data-testid="footer-link-create" className="hover:text-[var(--ivory)]">Criar música</Link></li>
          <li><a href="/#exemplos" data-testid="footer-link-samples" className="hover:text-[var(--ivory)]">Exemplos</a></li>
          <li><a href="/#faq" data-testid="footer-link-faq" className="hover:text-[var(--ivory)]">Perguntas</a></li>
        </ul>
      </div>
      <div className="md:col-span-2">
        <p className="eyebrow mb-4">Legal</p>
        <ul className="space-y-2.5 text-sm text-[var(--mute)]">
          <li><span>Termos [a definir]</span></li>
          <li><span>Privacidade [a definir]</span></li>
        </ul>
      </div>
      <div className="md:col-span-3">
        <p className="eyebrow mb-4">Contacto</p>
        <a href="mailto:ola@reprise.pt" data-testid="footer-support-email" className="flex items-center gap-2 text-sm text-[var(--mute)] hover:text-[var(--ivory)]"><Mail size={15} />ola@reprise.pt [placeholder]</a>
      </div>
    </div>
    <div className="pointer-events-none mt-16 select-none text-center font-display text-[24vw] leading-[0.78] text-white/[0.04]">Reprise</div>
    <div className="border-t border-white/5 py-6 text-center text-xs text-[var(--mute)]">© 2026 Reprise. Todos os direitos reservados.</div>
  </footer>
);
