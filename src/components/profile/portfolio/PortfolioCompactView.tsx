import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { InnovatorProfile } from "@/api/profiles";

interface PortfolioCompactViewProps {
  profile: Partial<InnovatorProfile> | null;
  onViewFull: () => void;
  isMobile?: boolean;
}

export function PortfolioCompactView({
  profile,
  onViewFull,
  isMobile = false,
}: PortfolioCompactViewProps) {
  const professionalSnapshot = profile?.professional_snapshot || "";
  const focusAreas = profile?.focus_areas || [];
  const currentIdentity = profile?.current_identity || "";
  const experienceSummary = profile?.experience_summary || "";

  const hasContent =
    professionalSnapshot || focusAreas.length > 0 || currentIdentity || experienceSummary;

  if (!hasContent) {
    return null;
  }

  const content = (
    <div className="space-y-4">
      {/* Professional Snapshot */}
      {professionalSnapshot && (
        <div>
          <h4 className="text-sm font-bold text-foreground mb-2">
            Professional Snapshot
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {professionalSnapshot}
          </p>
        </div>
      )}

      {/* Current Identity */}
      {currentIdentity && (
        <>
          {professionalSnapshot && <Separator className="my-3" />}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-2">
              Current Identity
            </h4>
            <Badge variant="outline" className="text-sm font-normal">
              {currentIdentity}
            </Badge>
          </div>
        </>
      )}

      {/* Focus Areas / Expertise */}
      {focusAreas.length > 0 && (
        <>
          {(professionalSnapshot || currentIdentity) && <Separator className="my-3" />}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-2">
              Focus Areas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {focusAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Experience Summary */}
      {experienceSummary && (
        <>
          <Separator className="my-3" />
          <div>
            <p className="text-sm text-muted-foreground italic">
              {experienceSummary}
            </p>
          </div>
        </>
      )}

      {/* View Full Portfolio Button - Centered */}
      <div className="pt-2 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewFull}
          className="text-primary hover:text-primary/80 hover:bg-transparent p-0 h-auto font-medium"
        >
          View full portfolio
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="bg-card px-4 py-4">
        <h3 className="text-sm font-bold text-foreground mb-3">Portfolio</h3>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Portfolio</h3>
        {content}
      </CardContent>
    </Card>
  );
}
