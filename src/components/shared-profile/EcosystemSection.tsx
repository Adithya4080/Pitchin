import { Handshake } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";
import type { EcosystemEntry } from "@/types/profile";

interface EcosystemSectionProps {
  items: EcosystemEntry[];
}

export default function EcosystemSection({ items }: EcosystemSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id="ecosystem" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionReveal>
        <SectionHeading icon={Handshake} title="Ecosystem & Support" />
      </SectionReveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((e, i) => (
          <SectionReveal key={`${e.name}-${i}`} delay={i * 0.04}>
            <GlassCard className="p-5" glow="#22d3ee">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                {e.type && (
                  <span className="shrink-0 rounded-full border border-slate-900/10 bg-white/70 px-2.5 py-1 text-[10px] uppercase tracking-wide text-slate-600">
                    {e.type}
                  </span>
                )}
              </div>
              {e.description && (
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{e.description}</p>
              )}
            </GlassCard>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
