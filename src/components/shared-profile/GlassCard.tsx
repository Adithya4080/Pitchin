import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Enables the 3D mouse-tilt effect. Disable for dense grids where it feels noisy. */
  tilt?: boolean;
  /** Accent color for the cursor-following hover glow. */
  glow?: string;
  as?: "div" | "article";
}

export default function GlassCard({
  children,
  className = "",
  tilt = true,
  glow = "#53bbff",
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), {
    stiffness: 220,
    damping: 22,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    if (tilt) {
      x.set(px - 0.5);
      y.set(py - 0.5);
    }
    ref.current.style.setProperty("--glow-x", `${px * 100}%`);
    ref.current.style.setProperty("--glow-y", `${py * 100}%`);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformPerspective: 900,
      }}
      className={`glass-card group relative rounded-3xl border border-slate-900/10 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(480px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glow}26, transparent 45%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-slate-900/10 transition group-hover:ring-slate-900/20" />
      <div style={{ transform: tilt ? "translateZ(24px)" : undefined }} className="relative">
        {children}
      </div>
    </motion.div>
  );
}
