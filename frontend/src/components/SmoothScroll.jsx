import { useEffect } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

export const SmoothScroll = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); window.__lenis = null; };
  }, []);
  useEffect(() => {
    window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.__lenis ? window.__lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView({ behavior: "smooth" });
};
