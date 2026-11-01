import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { scrollToId } from "./SmoothScroll";

const LINKS = [["exemplos", "Exemplos"], ["como-funciona", "Como funciona"], ["avaliacoes", "Avaliações"], ["ocasioes", "Ocasiões"], ["faq", "FAQ"]];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const go = (id) => { setOpen(false); scrollToId(id); };
  return (
    <header data-testid="site-header" className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? "border-b border-[rgba(230,161,92,.1)] bg-[rgba(13,9,20,.78)] backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map(([id, label]) => (
            <button key={id} data-testid={`nav-link-${id}`} onClick={() => go(id)} className="relative text-sm text-[var(--mute)] transition-colors hover:text-[var(--ivory)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-[width] after:duration-300 hover:after:w-full">
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/criar" data-testid="nav-create-song-button" className="btn-gold !px-5 !py-2.5 text-sm">
            <span className="hidden sm:inline">Criar a minha música</span><span className="sm:hidden">Criar</span><ArrowUpRight size={16} />
          </Link>
          <button data-testid="nav-mobile-toggle" onClick={() => setOpen(!open)} className="rounded-full border border-white/15 p-2.5 lg:hidden" aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div data-testid="nav-mobile-menu" className="glass mx-4 mb-4 rounded-2xl p-3 lg:hidden">
          {LINKS.map(([id, label]) => (
            <button key={id} data-testid={`nav-mobile-link-${id}`} onClick={() => go(id)} className="block w-full rounded-xl px-4 py-3 text-left font-display text-2xl hover:bg-white/5">{label}</button>
          ))}
        </div>
      )}
    </header>
  );
};
