import { Newspaper, Award, BadgeCheck, Building2, Quote, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";
import type { TrustProof } from "@/types/profile";

interface PressTestimonialsProps {
  proofs: TrustProof[];
}

const TYPE_ICON: Record<string, LucideIcon> = {
  press: Newspaper,
  award: Award,
  certification: BadgeCheck,
  customer_logo: Building2,
};

export default function PressTestimonials({ proofs }: PressTestimonialsProps) {
  if (proofs.length === 0) return null;

  const testimonials = proofs.filter((p) => p.type === "testimonial");
  const press = proofs.filter((p) => p.type !== "testimonial");

  return (
    <section id="press" className="relative mx-auto max-w-5xl px-6 py-24">
      {/* {testimonials.length > 0 && (
        <>
          <SectionReveal>
            <SectionHeading icon={Quote} title="What People Are Saying" />
          </SectionReveal>
          <SectionReveal delay={0.05}>
            <div className="no-scrollbar mb-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
              {testimonials.map((t, i) => (
                <GlassCard
                  key={i}
                  tilt={false}
                  glow="#ec4899"
                  className="w-[85%] shrink-0 snap-center p-6 sm:w-[60%]"
                >
                  <Quote className="mb-3 h-6 w-6 text-[#ec4899]/70" />
                  <p className="mb-4 text-sm leading-relaxed text-slate-700">{t.description}</p>
                  <p className="text-xs font-semibold text-slate-900">{t.source}</p>
                  {t.date && <p className="text-[11px] text-slate-400">{t.date}</p>}
                </GlassCard>
              ))}
            </div>
          </SectionReveal>
        </>
      )} */}

      {press.length > 0 && (
        <>
          <SectionReveal>
            <SectionHeading icon={Award} title="Press & Recognition" />
          </SectionReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {press.map((entry, i) => {
              const Icon = TYPE_ICON[entry.type] ?? Newspaper;
              return (
                <SectionReveal key={i} delay={i * 0.05}>
                  <GlassCard className="p-5" glow="#53bbff">
                    <div className="mb-3 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#2563eb]" />
                      <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                    </div>
                    <p className="mb-2 text-xs text-slate-500">
                      {entry.source}
                      {entry.date ? ` · ${entry.date}` : ""}
                    </p>
                    {entry.description && (
                      <p className="mb-3 text-xs leading-relaxed text-slate-600">
                        {entry.description}
                      </p>
                    )}
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:underline"
                      >
                        <Globe className="h-3 w-3" /> View source
                      </a>
                    )}
                  </GlassCard>
                </SectionReveal>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
