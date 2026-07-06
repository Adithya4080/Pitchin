import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FloatingDividerProps {
  variant?: "orb" | "cube";
  side?: "left" | "right";
}

export default function FloatingDivider({ variant = "orb", side = "left" }: FloatingDividerProps) {
  const reduced = useReducedMotion();
  const positionClass = side === "left" ? "left-[4%]" : "right-[4%]";

  return (
    <div
      className={`pointer-events-none absolute top-1/2 z-0 hidden -translate-y-1/2 opacity-40 md:block ${positionClass}`}
      aria-hidden="true"
    >
      {variant === "orb" ? (
        <motion.div
          animate={
            reduced ? undefined : { y: [0, -18, 0], opacity: [0.25, 0.45, 0.25] }
          }
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="h-24 w-24 rounded-full bg-gradient-to-br from-[#53bbff]/40 to-[#a855f7]/40 blur-xl"
        />
      ) : (
        <motion.div
          animate={reduced ? undefined : { rotate: 360, y: [0, -14, 0] }}
          transition={{
            rotate: { duration: 22, repeat: Infinity, ease: "linear" },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
          className="h-14 w-14 rounded-xl border border-slate-900/15"
          style={{ transform: "perspective(200px) rotateX(20deg)" }}
        />
      )}
    </div>
  );
}
