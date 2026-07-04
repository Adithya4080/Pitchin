import { Users, Linkedin } from "lucide-react";
import GlassCard from "./GlassCard";
import SectionReveal from "./SectionReveal";
import SectionHeading from "./SectionHeading";
import type { TeamMember } from "@/types/profile";

interface TeamSectionProps {
  members: TeamMember[];
  resolveAvatar: (path?: string) => string | undefined;
}

export default function TeamSection({ members, resolveAvatar }: TeamSectionProps) {
  if (members.length === 0) return null;

  return (
    <section id="team" className="relative mx-auto max-w-5xl px-6 py-24">
      <SectionReveal>
        <SectionHeading icon={Users} title="Team" />
      </SectionReveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, i) => (
          <SectionReveal key={`${m.name}-${i}`} delay={i * 0.05}>
            <GlassCard className="flex h-full flex-col p-5" glow="#a855f7">
              <div className="mb-4 flex items-center gap-3">
                {m.avatar_url ? (
                  <img
                    src={resolveAvatar(m.avatar_url)}
                    alt={m.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#53bbff] to-[#a855f7] text-base font-semibold text-white shadow">
                    {m.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-slate-900">{m.name}</p>
                    {m.linkedin_url && (
                      <a
                        href={m.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2563eb] hover:opacity-80"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="truncate text-xs text-slate-500">{m.role}</p>
                </div>
              </div>
              {m.background && (
                <p className="text-xs leading-relaxed text-slate-600">{m.background}</p>
              )}
            </GlassCard>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
