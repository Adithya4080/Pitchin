import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicSharedDashboard } from "@/api/payment";
import { AlertCircle, Link2Off, type LucideIcon } from "lucide-react";
import { parseSharedProfile, avatarSrc } from "@/lib/parseSharedProfile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import AuroraBackground from "@/components/shared-profile/AuroraBackground";
import ScrollProgress from "@/components/shared-profile/ScrollProgress";
import HeroSection from "@/components/shared-profile/HeroSection";
import AboutSection from "@/components/shared-profile/AboutSection";
import TimelineSection from "@/components/shared-profile/TimelineSection";
import MilestonesSection from "@/components/shared-profile/MilestonesSection";
import FundingTractionSection from "@/components/shared-profile/FundingTractionSection";
import TeamSection from "@/components/shared-profile/TeamSection";
import EcosystemSection from "@/components/shared-profile/EcosystemSection";
import PressTestimonials from "@/components/shared-profile/PressTestimonials";
import ContactCTA from "@/components/shared-profile/ContactCTA";
import GlassCard from "@/components/shared-profile/GlassCard";
import FloatingDivider from "@/components/shared-profile/FloatingDivider";
import "@/components/shared-profile/theme.css";
import PitchSection from "@/components/shared-profile/PitchSection";
import ProfileLoader from "@/components/shared-profile/Profileloader";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.replace("/api", "") ||
  "https://api.pichin.in";

function ErrorScreen({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="sp-root relative flex min-h-screen items-center justify-center bg-[#f5f7fb] p-6">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-sm">
        <GlassCard tilt={false} className="p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-900/10 bg-white/70">
            <Icon className="h-7 w-7 text-slate-600" />
          </div>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </GlassCard>
      </div>
    </div>
  );
}

export default function SharedProfile() {
  const { userId: shareId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access") ?? "";
  const reducedMotion = useReducedMotion();
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-shared-dashboard", shareId, accessToken],
    queryFn: () => getPublicSharedDashboard(shareId!, accessToken),
    enabled: !!(shareId && accessToken),
    retry: false,
  });

  if (!shareId || !accessToken) {
    return (
      <ErrorScreen
        icon={AlertCircle}
        title="Invalid Link"
        description="This share link appears to be malformed. Please ask the owner for the correct link."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ProfileLoader />
      </div>
    );
  }

  if (error) {
    const msg = (error as Error).message;
    if (msg === "share_revoked") {
      return (
        <ErrorScreen
          icon={Link2Off}
          title="Link Revoked"
          description="The owner has revoked access to this profile. This link is no longer valid."
        />
      );
    }
    if (msg === "invalid_access_token") {
      return (
        <ErrorScreen
          icon={AlertCircle}
          title="Access Denied"
          description="This access token is invalid. Please use the exact link provided by the profile owner."
        />
      );
    }
    return (
      <ErrorScreen
        icon={AlertCircle}
        title="Profile Not Found"
        description="This shared profile could not be found. The link may have expired."
      />
    );
  }

  if (!data) return null;

  const profile = parseSharedProfile(data);
  const resolveAvatar = (path?: string) => avatarSrc(path, API_BASE);

  return (
    <div className="sp-root relative min-h-screen bg-[#f5f7fb] text-slate-900">
      <AuroraBackground />
      <ScrollProgress />

      <main className="relative z-10">
        <HeroSection profile={profile} avatarUrl={resolveAvatar(profile.avatar)} />

        <AboutSection profile={profile} />
        <PitchSection profile={profile} />

        <div className="relative">
          <FloatingDivider variant="orb" side="left" />
        </div>

        <TimelineSection items={profile.companyJourney} />
        <MilestonesSection items={profile.progressHighlights} />

        <div className="relative">
          <FloatingDivider variant="cube" side="right" />
        </div>

        <FundingTractionSection profile={profile} />
        <TeamSection members={profile.teamMembers} resolveAvatar={resolveAvatar} />
        <EcosystemSection items={profile.ecosystemSupport} />
        <PressTestimonials proofs={profile.trustPress.proofs ?? []} />
        {/* <ContactCTA profile={profile} /> */}

        <footer className="border-t border-slate-900/5 py-10 text-center">
          <p className="text-xs text-slate-400">
            Powered by{" "}
            <a href="/" className="font-semibold text-slate-500 hover:text-slate-900">
              PitchIn
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}