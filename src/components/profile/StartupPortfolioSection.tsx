import { useState } from "react";
import {
  StartupPortfolioCompactView,
  StartupPortfolioFullView,
  StartupPortfolioEditSection,
} from "./portfolio";
import { StartupProfile } from "@/api/profiles";
import { ProfileSectionWrapper } from "./ProfileSectionWrapper";

interface StartupPortfolioSectionProps {
  profile: Partial<StartupProfile> | null;
  isEditable?: boolean;
  isOwner?: boolean;
  onChange?: (data: Partial<StartupProfile>) => void;
  isMobile?: boolean;
}

export function StartupPortfolioSection({
  profile,
  isEditable = false,
  isOwner = false,
  onChange,
  isMobile = false,
}: StartupPortfolioSectionProps) {
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);

  // Check if there's any portfolio content
  const hasPortfolioContent = !!(
    profile?.company_snapshot ||
    profile?.market_type ||
    profile?.founded_year ||
    profile?.operating_status ||
    profile?.company_background ||
    profile?.vision_direction ||
    profile?.current_focus ||
    (profile?.progress_highlights && profile.progress_highlights.length > 0) ||
    (profile?.ecosystem_support && (profile.ecosystem_support as any[]).length > 0) ||
    (profile?.company_journey_timeline && (profile.company_journey_timeline as any[]).length > 0)
  );

  // If in edit mode, show the edit section
  if (isEditable && onChange) {
    return (
      <StartupPortfolioEditSection
        profile={profile}
        onChange={onChange}
        isMobile={isMobile}
      />
    );
  }

  // Use wrapper for empty state handling
  return (
    <ProfileSectionWrapper
      title="Company Portfolio"
      isEmpty={!hasPortfolioContent}
      isOwner={isOwner}
      sectionKey="portfolio"
      isMobile={isMobile}
      emptyMessage="Add your company snapshot, background, and progress highlights."
    >
      {isFullViewOpen ? (
        <StartupPortfolioFullView
          profile={profile}
          isExpanded={isFullViewOpen}
          onCollapse={() => setIsFullViewOpen(false)}
          isMobile={isMobile}
        />
      ) : (
        <StartupPortfolioCompactView
          profile={profile}
          onViewFull={() => setIsFullViewOpen(true)}
          isMobile={isMobile}
        />
      )}
    </ProfileSectionWrapper>
  );
}