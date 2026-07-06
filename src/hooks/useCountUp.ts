import { useEffect, useRef, useState } from "react";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animates a number from 0 up to `target` once `start` becomes true.
 * Returns the current value, already rounded to `decimals`.
 */
export function useCountUp(target: number, start: boolean, decimals = 0, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const hasRun = useRef(false);
  const frame = useRef<number>();

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutExpo(t);
      setValue(target * eased);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [start, target, durationMs]);

  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
