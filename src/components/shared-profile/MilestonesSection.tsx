import { CheckCircle2 } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";

interface MilestonesSectionProps {
  items: string[];
}

export default function MilestonesSection({ items }: MilestonesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id="milestones" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionReveal>
        <SectionHeading icon={CheckCircle2} title="Milestones & Highlights" />
      </SectionReveal>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((text, i) => (
          <SectionReveal key={i} delay={i * 0.04}>
            <GlassCard className="flex items-start gap-3 p-4" tilt={false} glow="#34d399">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm leading-relaxed text-slate-700">{text}</p>
            </GlassCard>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
