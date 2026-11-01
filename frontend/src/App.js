import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/SmoothScroll";
import Landing from "@/pages/Landing";
import Create from "@/pages/Create";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";
import Song from "@/pages/Song";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <SmoothScroll />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/criar" element={<Create />} />
          <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
          <Route path="/pagamento/cancelado" element={<PaymentCancel />} />
          <Route path="/musica/:id" element={<Song />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Toaster theme="dark" position="top-center" />
      </BrowserRouter>
    </div>
  );
}

export default App;
