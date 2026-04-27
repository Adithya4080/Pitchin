import { useState } from "react";
import {
  PortfolioCompactView,
  PortfolioFullView,
  PortfolioEditSection,
} from "./portfolio";
import { InnovatorProfile } from "@/api/profiles";
import { ProfileSectionWrapper } from "./ProfileSectionWrapper";

interface PortfolioSectionProps {
  profile: Partial<InnovatorProfile> | null;
  isEditable?: boolean;
  isOwner?: boolean;
  onChange?: (data: Partial<InnovatorProfile>) => void;
  isMobile?: boolean;
}

export function PortfolioSection({
  profile,
  isEditable = false,
  isOwner = false,
  onChange,
  isMobile = false,
}: PortfolioSectionProps) {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  // Check if there's any portfolio content
  const hasPortfolioContent = !!(
    profile?.professional_snapshot ||
    (profile?.focus_areas && profile.focus_areas.length > 0) ||
    profile?.current_identity ||
    profile?.experience_summary ||
    profile?.background_journey ||
    (profile?.education && (profile.education as any[]).length > 0) ||
    (profile?.work_experience && (profile.work_experience as any[]).length > 0) ||
    (profile?.skills_capabilities && profile.skills_capabilities.length > 0) ||
    (profile?.mentors_backers && (profile.mentors_backers as any[]).length > 0) ||
    (profile?.journey_timeline && (profile.journey_timeline as any[]).length > 0)
  );

  // If in edit mode, show the edit section
  if (isEditable && onChange) {
    return (
      <PortfolioEditSection
        profile={profile}
        onChange={onChange}
        isMobile={isMobile}
      />
    );
  }

  // Use wrapper for empty state handling
  return (
    <ProfileSectionWrapper
      title="Portfolio"
      isEmpty={!hasPortfolioContent}
      isOwner={isOwner}
      sectionKey="portfolio"
      isMobile={isMobile}
      emptyMessage="Add your professional snapshot, experience, and skills to showcase your portfolio."
    >
      {isFullViewOpen ? (
        <PortfolioFullView
          profile={profile}
          isExpanded={isFullViewOpen}
          onCollapse={() => setIsFullViewOpen(false)}
          isMobile={isMobile}
        />
      ) : (
        <PortfolioCompactView
          profile={profile}
          onViewFull={() => setIsFullViewOpen(true)}
          isMobile={isMobile}
        />
      )}
    </ProfileSectionWrapper>
  );
}
