import { Link } from "react-router-dom";

export const LogoMark = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="29" fill="#0D0914" stroke="#E6A15C" strokeOpacity=".25" />
    <circle cx="32" cy="32" r="19" fill="none" stroke="#E6A15C" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="12" fill="none" stroke="#E6A15C" strokeOpacity=".45" strokeWidth="1.5" />
    <path d="M32 40.5c-6-4.2-9-7.3-9-10.7 0-2.6 2-4.5 4.4-4.5 1.9 0 3.5 1 4.6 2.7 1.1-1.7 2.7-2.7 4.6-2.7 2.4 0 4.4 1.9 4.4 4.5 0 3.4-3 6.5-9 10.7z" fill="#D9777F" />
  </svg>
);

export const Logo = ({ testid = "brand-logo" }) => (
  <Link to="/" data-testid={testid} className="group flex items-center gap-2.5">
    <span className="transition-transform duration-700 group-hover:rotate-[200deg]"><LogoMark /></span>
    <span className="font-display text-[1.7rem] leading-none tracking-tight text-[var(--ivory)]">
      Repris<em className="text-gold-grad not-italic">e</em>
    </span>
  </Link>
);
