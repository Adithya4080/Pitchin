import { motion } from "framer-motion";
import { AlertCircle, Lightbulb, Clock, Trophy, type LucideIcon } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ParsedProfile } from "@/types/profile";

interface PitchSectionProps {
  profile: ParsedProfile;
}

interface PendulumTileProps {
  label: string;
  value?: string;
  icon: LucideIcon;
  accent: string; // tailwind color token, e.g. "#ef4444"
  index: number;
}

function PendulumTile({ label, value, icon: Icon, accent, index }: PendulumTileProps) {
  const reduced = useReducedMotion();
  if (!value) return null;

  const fromLeft = index % 2 === 0;

  if (reduced) {
    return (
      <div className="rounded-2xl border border-slate-900/10 bg-slate-900/[0.03] p-5">
        <TileBody label={label} value={value} icon={Icon} accent={accent} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -70 : 70, rotate: fromLeft ? -10 : 10 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 11,
        mass: 0.9,
        delay: index * 0.12,
      }}
      style={{ transformOrigin: "top center" }}
      className="rounded-2xl border border-slate-900/10 bg-slate-900/[0.03] p-5"
    >
      <TileBody label={label} value={value} icon={Icon} accent={accent} />
    </motion.div>
  );
}

function TileBody({ label, value, icon: Icon, accent }: Omit<PendulumTileProps, "index">) {
  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{value}</p>
    </>
  );
}

export default function PitchSection({ profile }: PitchSectionProps) {
  const tiles = [
    { label: "The Problem", value: profile.problem_statement, icon: AlertCircle, accent: "#ef4444" },
    { label: "Our Solution", value: profile.solution, icon: Lightbulb, accent: "#eab308" },
    { label: "Why Now", value: profile.why_now, icon: Clock, accent: "#53bbff" },
    { label: "Why Us", value: profile.why_us, icon: Trophy, accent: "#22c55e" },
  ];

  const hasContent = tiles.some((t) => !!t.value);
  if (!hasContent) return null;

  return (
    <section id="pitch" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionReveal>
        <SectionHeading
          icon={Lightbulb}
          title="The Pitch"
          subtitle="Problem · Solution · Why Now · Why Us"
        />
      </SectionReveal>

      <SectionReveal delay={0.05}>
        <GlassCard className="p-6 sm:p-10" tilt={false}>
          <div className="grid gap-4 sm:grid-cols-2">
            {tiles.map((t, i) => (
              <PendulumTile key={t.label} {...t} index={i} />
            ))}
          </div>
        </GlassCard>
      </SectionReveal>
    </section>
  );
}