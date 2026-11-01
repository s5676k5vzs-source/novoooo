import "@/App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/SmoothScroll";
import Landing from "@/pages/Landing";

const Create = lazy(() => import("@/pages/Create"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("@/pages/PaymentCancel"));
const Song = lazy(() => import("@/pages/Song"));
const Admin = lazy(() => import("@/pages/Admin"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SmoothScroll />
        <Suspense fallback={<div className="min-h-screen bg-[var(--ink)]" />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/criar" element={<Create />} />
            <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
            <Route path="/pagamento/cancelado" element={<PaymentCancel />} />
            <Route path="/musica/:id" element={<Song />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
        <Toaster theme="dark" position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
