import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export default function PaymentCancel() {
  return (
    <main data-testid="payment-cancel-page" className="relative grid min-h-screen place-items-center px-5">
      <div className="absolute left-5 top-6 md:left-10"><Logo /></div>
      <div className="max-w-lg text-center">
        <h1 className="font-display text-5xl md:text-6xl">Pagamento cancelado</h1>
        <p className="mt-4 text-[var(--mute)]">Não se preocupe — guardámos as suas respostas. Pode retomar quando quiser.</p>
        <Link to="/criar" data-testid="payment-cancel-retry-button" className="btn-gold mt-10">Retomar o pedido</Link>
      </div>
    </main>
  );
}
