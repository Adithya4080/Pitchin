import { Building2, Compass, Target, Lightbulb, Sparkles } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";
import type { ParsedProfile } from "@/types/profile";

interface AboutSectionProps {
  profile: ParsedProfile;
}

interface PitchTileProps {
  label: string;
  value?: string;
  icon: typeof Target;
}

function PitchTile({ label, value, icon: Icon }: PitchTileProps) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-slate-900/10 bg-slate-900/[0.03] p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#2563eb]" />
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{value}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default function AboutSection({ profile }: AboutSectionProps) {
  const overview = profile.company_snapshot ?? profile.company_overview;
  const facts = [
    { label: "Stage", value: profile.stage },
    { label: "Founded", value: profile.founded_year },
    { label: "Team", value: profile.team_size ? `${profile.team_size} people` : undefined },
    { label: "Industry", value: profile.industry },
    { label: "Market", value: profile.market_type },
  ].filter((f) => f.value);

  return (
    <section id="about" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionReveal>
        <SectionHeading icon={Building2} title="About the Company" />
      </SectionReveal>

      <SectionReveal delay={0.05}>
        <GlassCard className="p-6 sm:p-10" tilt={false}>
          {overview && (
            <p className="mb-8 text-center text-base leading-relaxed text-slate-700 sm:text-lg">
              {overview}
            </p>
          )}

          {facts.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-y border-slate-900/10 py-6">
              {facts.map((f) => (
                <Fact key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          )}

          {profile.industryTags.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {profile.industryTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-xs text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:gap-6">
            <PitchTile label="Mission" value={profile.company_background} icon={Sparkles} />
            <PitchTile label="Vision" value={profile.vision_direction} icon={Compass} />
            {/* <PitchTile label="Problem" value={profile.problem_statement} icon={Target} /> */}
            {/* <PitchTile label="Solution" value={profile.solution} icon={Lightbulb} /> */}
          </div>

          {profile.current_focus && (
            <div className="mt-6 rounded-2xl border border-[#53bbff]/20 bg-[#53bbff]/[0.06] p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#2563eb]">
                Current Focus
              </p>
              <p className="text-sm leading-relaxed text-slate-700">{profile.current_focus}</p>
            </div>
          )}
        </GlassCard>
      </SectionReveal>
    </section>
  );
}
