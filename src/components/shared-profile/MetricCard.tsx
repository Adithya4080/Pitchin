import { useRef } from "react";
import { useInView } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import GlassCard from "./GlassCard";
import { useCountUp } from "@/hooks/useCountUp";
import { splitNumericFormat } from "@/lib/parseSharedProfile";

interface MetricCardProps {
  label: string;
  value: string;
  growth?: string;
  icon: LucideIcon;
  /** Tailwind gradient stop classes for the icon badge, e.g. "from-[#53bbff] to-[#a855f7]" */
  gradient?: string;
}

function CountUpText({
  prefix,
  target,
  decimals,
  suffix,
  start,
}: {
  prefix: string;
  target: number;
  decimals: number;
  suffix: string;
  start: boolean;
}) {
  const value = useCountUp(target, start, decimals, 1500);
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

export default function MetricCard({
  label,
  value,
  growth,
  icon: Icon,
  gradient = "from-[#53bbff] to-[#a855f7]",
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const parsed = splitNumericFormat(value);

  return (
    <div ref={ref}>
      <GlassCard className="p-5" glow="#53bbff">
        <div
          className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <p className="text-2xl font-bold tabular-nums text-slate-900">
          {parsed ? (
            <CountUpText
              prefix={parsed.prefix}
              target={parsed.value}
              decimals={parsed.decimals}
              suffix={parsed.suffix}
              start={inView}
            />
          ) : (
            value
          )}
        </p>
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</p>
        {growth && <p className="mt-2 text-xs font-medium text-emerald-600">{growth}</p>}
      </GlassCard>
    </div>
  );
}
