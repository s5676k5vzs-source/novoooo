import { Link } from "react-router-dom";

export const LogoMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="14" fill="#FF6A3D" />
    <rect x="16" y="26" width="6" height="16" rx="3" fill="#0A0A0B" />
    <rect x="29" y="16" width="6" height="32" rx="3" fill="#0A0A0B" />
    <rect x="42" y="22" width="6" height="22" rx="3" fill="#0A0A0B" />
  </svg>
);

export const Logo = ({ testid = "brand-logo" }) => (
  <Link to="/" data-testid={testid} className="group flex items-center gap-2.5">
    <span className="transition-transform duration-300 group-hover:-rotate-6"><LogoMark /></span>
    <span className="font-mono text-[1.05rem] font-medium leading-none tracking-tight text-[var(--ivory)]">
      reprise<span className="text-[var(--gold)]">.fm</span>
    </span>
  </Link>
);
