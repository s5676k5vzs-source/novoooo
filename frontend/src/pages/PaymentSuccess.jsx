import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Check, ArrowUpRight, AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { http } from "@/lib/api";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState("checking");
  const orderId = localStorage.getItem("reprise_last_order");

  useEffect(() => {
    if (!sessionId) { setState("error"); return undefined; }
    let tries = 0;
    let timer;
    const poll = async () => {
      try {
        const { data } = await http.get(`/payments/status/${sessionId}`);
        if (data?.payment_status === "paid") { setState("paid"); localStorage.removeItem("reprise_draft"); return; }
        if (data?.status === "expired") { setState("error"); return; }
      } catch { /* retry */ }
      tries += 1;
      if (tries < 15) timer = setTimeout(poll, 2000); else setState("timeout");
    };
    poll();
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <main data-testid="payment-success-page" className="relative grid min-h-screen place-items-center px-5">
      <div className="absolute left-5 top-6 md:left-10"><Logo /></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-center">
        {state === "checking" && <><Loader2 className="mx-auto animate-spin text-[var(--gold)]" size={40} /><h1 className="mt-6 font-display text-5xl">A confirmar pagamento…</h1></>}
        {state === "paid" && <>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[var(--gold)] text-[var(--ink)]"><Check size={36} /></div>
          <h1 data-testid="payment-success-title" className="mt-8 font-display text-5xl md:text-6xl">Obrigado! A sua música <em className="text-gold-grad">começou.</em></h1>
          <p className="mt-5 text-[var(--mute)]">A letra já está a ser escrita. Quando o áudio estiver pronto, enviamos o link para o seu e-mail.</p>
          {orderId && <Link to={`/musica/${orderId}`} data-testid="payment-success-song-link" className="btn-gold mt-10">Ver a página da música <ArrowUpRight size={18} /></Link>}
        </>}
        {(state === "error" || state === "timeout") && <>
          <AlertCircle className="mx-auto text-[var(--rose)]" size={40} />
          <h1 data-testid="payment-error-title" className="mt-6 font-display text-5xl">Não conseguimos confirmar</h1>
          <p className="mt-4 text-[var(--mute)]">{state === "timeout" ? "O pagamento ainda está a ser processado. Atualize esta página dentro de momentos." : "A sessão de pagamento é inválida ou expirou."}</p>
          <Link to="/criar" className="btn-ghost mt-8">Voltar ao pedido</Link>
        </>}
      </motion.div>
    </main>
  );
}
