import { useState } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMemberCard, TeamMember } from "./TeamMemberCard";

interface TeamCompactViewProps {
  members: TeamMember[];
  isMobile?: boolean;
  initialDisplayCount?: number;
}

export function TeamCompactView({
  members,
  isMobile = false,
  initialDisplayCount = 2,
}: TeamCompactViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!members || members.length === 0) {
    return null;
  }

  const displayedMembers = isExpanded ? members : members.slice(0, initialDisplayCount);
  const hasMore = members.length > initialDisplayCount;

  const content = (
    <div className="divide-y divide-border/50">
      {displayedMembers.map((member, index) => (
        <TeamMemberCard key={index} member={member} isMobile={isMobile} />
      ))}

      {/* Show More/Less Button - Centered, matching portfolio pattern */}
      {hasMore && (
        <div className="pt-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 hover:bg-transparent p-0 h-auto font-medium"
          >
            {isExpanded ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                View full team ({members.length} members)
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="px-4 py-4">
        <h3 className="text-sm font-bold text-foreground mb-3">
          Team {members.length > 0 && `(${members.length})`}
        </h3>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Team {members.length > 0 && `(${members.length})`}
        </h3>
        {content}
      </CardContent>
    </Card>
  );
}
