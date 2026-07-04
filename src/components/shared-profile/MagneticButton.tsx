import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

const BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors will-change-transform";

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#53bbff] to-[#a855f7] text-white shadow-[0_0_22px_-6px_rgba(83,187,255,0.4)] hover:shadow-[0_0_30px_-4px_rgba(168,85,247,0.45)]",
  secondary: "border border-slate-900/15 bg-white/70 text-slate-900 backdrop-blur-md hover:bg-white/90",
  ghost: "text-slate-600 hover:text-slate-900",
};

function useMagneticPull(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  function bind(el: HTMLElement | null, e: React.MouseEvent) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return { springX, springY, bind, reset };
}

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}: MagneticButtonProps) {
  const { springX, springY, bind, reset } = useMagneticPull();
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const classes = `${BASE} ${VARIANT_CLASS[variant]} ${
    disabled ? "cursor-not-allowed opacity-40 grayscale" : ""
  } ${className}`;

  if (href && !disabled) {
    return (
      <motion.a
        ref={anchorRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={(e) => bind(anchorRef.current, e)}
        onMouseLeave={reset}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.96 }}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseMove={(e) => bind(buttonRef.current, e)}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
