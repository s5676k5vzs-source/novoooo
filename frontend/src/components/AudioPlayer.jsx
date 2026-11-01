import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const fmt = (s) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "--:--");
const BARS = Array.from({ length: 56 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.33)) * 0.75);

export const AudioPlayer = ({ src, testid = "audio-player", compact = false }) => {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  useEffect(() => {
    setPlaying(false); setT(0);
    return () => { ref.current?.pause(); };
  }, [src]);
  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) { a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); } else { a.pause(); setPlaying(false); }
  };
  const seek = (e) => {
    const a = ref.current;
    if (!a || !d) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * d;
  };
  const pct = d ? t / d : 0;
  return (
    <div data-testid={testid} className="flex items-center gap-4">
      <audio ref={ref} src={src} preload="metadata" onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setD(e.currentTarget.duration)} onEnded={() => setPlaying(false)} />
      <button data-testid={`${testid}-play-pause-button`} onClick={toggle} aria-label={playing ? "Pausar" : "Tocar"}
        className={`grid shrink-0 place-items-center rounded-full bg-[var(--ivory)] text-[var(--ink)] transition-transform duration-300 hover:scale-105 ${compact ? "h-11 w-11" : "h-14 w-14"}`}>
        {playing ? <Pause size={compact ? 16 : 20} /> : <Play size={compact ? 16 : 20} className="ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div onClick={seek} data-testid={`${testid}-seekbar`} className="flex h-10 cursor-pointer items-center gap-[2px]">
          {BARS.map((h, i) => (
            <span key={i} className="flex-1 rounded-full transition-colors duration-200" style={{ height: `${h * 100}%`, background: i / BARS.length < pct ? "var(--gold)" : "rgba(250,247,242,.18)" }} />
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[11px] text-[var(--mute)]"><span>{fmt(t)}</span><span>{fmt(d)}</span></div>
      </div>
    </div>
  );
};
