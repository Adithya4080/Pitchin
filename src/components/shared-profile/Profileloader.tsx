import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Sparkles, Rocket, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Slide {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
}

const SLIDES: Slide[] = [
  { id: "pitch", label: "Pitch", icon: Sparkles, accent: "#a855f7" },
  { id: "traction", label: "Traction", icon: TrendingUp, accent: "#22c55e" },
  { id: "team", label: "Team", icon: Users, accent: "#53bbff" },
  { id: "funding", label: "Funding", icon: Rocket, accent: "#ec4899" },
];

const STATUS_MESSAGES = [
  "Shuffling the deck…",
  "Loading the pitch…",
  "Gathering traction…",
  "Almost ready…",
];

const CYCLE_MS = 1100;

export default function ProfileLoader() {
  const reduced = useReducedMotion();
  const [order, setOrder] = useState(SLIDES.map((s) => s.id));
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setOrder((prev) => [...prev.slice(1), prev[0]]);
      setStep((s) => (s + 1) % STATUS_MESSAGES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8 px-6">
      {/* The shuffling deck */}
      <div className="relative h-[168px] w-[220px]">
        {SLIDES.map((slide) => {
          const depth = order.indexOf(slide.id); // 0 = front, 3 = back
          const Icon = slide.icon;
          return (
            <motion.div
              key={slide.id}
              className="absolute inset-x-0 top-0 flex h-[140px] flex-col justify-between rounded-2xl border bg-white p-4 shadow-lg"
              style={{
                borderColor: `${slide.accent}33`,
                zIndex: SLIDES.length - depth,
              }}
              animate={
                reduced
                  ? { opacity: depth === 0 ? 1 : 0.5 }
                  : {
                      y: depth * 10,
                      x: depth % 2 === 0 ? depth * 4 : depth * -4,
                      scale: 1 - depth * 0.06,
                      rotate: depth === 0 ? 0 : depth % 2 === 0 ? 2.5 : -2.5,
                      opacity: 1 - depth * 0.18,
                    }
              }
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${slide.accent}1a`, color: slide.accent }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {slide.label}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full bg-slate-900/[0.07]" />
                <div className="h-2 w-2/3 rounded-full bg-slate-900/[0.07]" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Status line */}
      <div className="flex h-5 items-center gap-2 text-sm text-slate-400">
        <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#53bbff] to-[#a855f7]" />
        <AnimatePresence mode="wait">
          <motion.span
            key={STATUS_MESSAGES[step]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {STATUS_MESSAGES[step]}
          </motion.span>
        </AnimatePresence>
      </div>

      <style>{`
        .pulse-dot {
          animation: loaderDotPulse 1.2s ease-in-out infinite;
        }
        @keyframes loaderDotPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-dot { animation: none !important; }
        }
      `}</style>
    </div>
  );
}