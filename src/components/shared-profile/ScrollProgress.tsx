import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";

const SIZE = 56;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const dashOffset = useTransform(progress, (v) => CIRCUMFERENCE * (1 - v));

  const [percent, setPercent] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setPercent(Math.round(v * 100)));

  return (
    <div
      className="fixed right-5 top-5 z-50 hidden h-14 w-14 items-center justify-center md:flex"
      aria-hidden="true"
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(15,23,42,0.1)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#scrollProgressGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset: dashOffset }}
        />
        <defs>
          <linearGradient id="scrollProgressGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#53bbff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[10px] font-medium text-slate-600">{percent}</span>
    </div>
  );
}
