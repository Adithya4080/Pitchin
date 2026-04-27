import { Users, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMemberCard, TeamMember } from "./TeamMemberCard";

interface TeamFullViewProps {
  members: TeamMember[];
  isExpanded: boolean;
  onCollapse: () => void;
  isMobile?: boolean;
}

export function TeamFullView({
  members,
  isExpanded,
  onCollapse,
  isMobile = false,
}: TeamFullViewProps) {
  if (!isExpanded || !members || members.length === 0) {
    return null;
  }

  const content = (
    <div className="space-y-3">
      {members.map((member, index) => (
        <TeamMemberCard key={index} member={member} isMobile={isMobile} />
      ))}

      {/* Show Less Button - Centered */}
      <div className="pt-2 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCollapse}
          className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
        >
          Show less
          <ChevronUp className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="bg-card px-4 py-4">
        <h3 className="text-sm font-bold text-foreground mb-3">
          Team ({members.length} members)
        </h3>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">
          Team ({members.length} members)
        </h3>
        {content}
      </CardContent>
    </Card>
  );
}
