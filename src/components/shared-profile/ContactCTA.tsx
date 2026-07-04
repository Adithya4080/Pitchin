import { Mail, Globe, FileDown, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";
import GlassCard from "./GlassCard";
import SectionReveal from "./SectionReveal";
import type { ParsedProfile } from "@/types/profile";

interface ContactCTAProps {
  profile: ParsedProfile;
}

export default function ContactCTA({ profile }: ContactCTAProps) {
  const displayName =
    profile.company_name || profile.user_name || profile.full_name || "this startup";

  return (
    <section id="contact" className="relative mx-auto max-w-3xl px-6 py-24">
      <SectionReveal>
        <GlassCard tilt={false} glow="#a855f7" className="glow-border p-10 text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-[#a855f7]" />
          <h2 className="font-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Interested in investing in {displayName}?
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm text-slate-600">
            Reach out directly to start the conversation — the team behind this profile would
            love to hear from you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {profile.user_email && (
              <MagneticButton href={`mailto:${profile.user_email}`} variant="primary">
                <Mail className="h-4 w-4" /> Contact Founder
              </MagneticButton>
            )}
            {profile.website && (
              <MagneticButton href={profile.website} variant="secondary">
                <Globe className="h-4 w-4" /> Visit Website
              </MagneticButton>
            )}
            {profile.pitch_deck_url && (
              <MagneticButton href={profile.pitch_deck_url} variant="secondary">
                <FileDown className="h-4 w-4" /> Download Pitch Deck
              </MagneticButton>
            )}
          </div>
        </GlassCard>
      </SectionReveal>
    </section>
  );
}
