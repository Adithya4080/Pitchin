import { TeamCompactView } from "./TeamCompactView";
import { TeamEditSection } from "./TeamEditSection";
import { TeamMember } from "./TeamMemberCard";
import { ProfileSectionWrapper } from "../ProfileSectionWrapper";

interface TeamSectionProps {
  members: TeamMember[];
  isEditable?: boolean;
  onChange?: (members: TeamMember[]) => void;
  isMobile?: boolean;
  isOwner?: boolean;
}

export function TeamSection({
  members,
  isEditable = false,
  onChange,
  isMobile = false,
  isOwner = false,
}: TeamSectionProps) {
  // Ensure we have a proper array
  const safeMembers = Array.isArray(members) ? members : [];
  
  const validMembers = safeMembers.filter(
    (member) => member && typeof member === 'object' && member.name && member.name.trim() !== ""
  );

  // If in edit mode, show the edit section
  if (isEditable && onChange) {
    return (
      <TeamEditSection
        members={safeMembers}
        onChange={onChange}
        isMobile={isMobile}
      />
    );
  }

  // Use wrapper for empty state handling
  return (
    <ProfileSectionWrapper
      title="Team"
      isEmpty={validMembers.length === 0}
      isOwner={isOwner}
      sectionKey="team"
      isMobile={isMobile}
      emptyMessage="Add your team members to showcase your crew."
    >
      <TeamCompactView
        members={validMembers}
        isMobile={isMobile}
      />
    </ProfileSectionWrapper>
  );
}
