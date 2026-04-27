import { Building2, Target, Calendar, MapPin, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StartupProfile } from "@/api/profiles";

interface StartupPortfolioCompactViewProps {
  profile: Partial<StartupProfile> | null;
  onViewFull: () => void;
  isMobile?: boolean;
}

export function StartupPortfolioCompactView({
  profile,
  onViewFull,
  isMobile = false,
}: StartupPortfolioCompactViewProps) {
  const companySnapshot = profile?.company_snapshot || "";
  const industryTags = profile?.industry_tags || [];
  const marketType = profile?.market_type || "";
  const stage = profile?.stage || "";
  const foundedYear = profile?.founded_year || "";
  const operatingStatus = profile?.operating_status || "";

  const hasContent =
    companySnapshot ||
    industryTags.length > 0 ||
    marketType ||
    stage ||
    foundedYear ||
    operatingStatus;

  if (!hasContent) {
    return null;
  }

  // Format operating status for display
  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Active";
      case "exploring":
        return "Exploring";
      case "stealth":
        return "Stealth";
      default:
        return status;
    }
  };

  const content = (
    <div className="space-y-4">
      {/* Company Snapshot */}
      {companySnapshot && (
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Company Snapshot
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {companySnapshot}
          </p>
        </div>
      )}

      {/* Focus Areas */}
      {(industryTags.length > 0 || marketType || stage) && (
        <>
          {companySnapshot && <Separator className="my-3" />}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              Focus Areas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {industryTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {marketType && (
                <Badge variant="outline" className="text-xs">
                  {marketType}
                </Badge>
              )}
              {stage && (
                <Badge variant="outline" className="text-xs">
                  {stage}
                </Badge>
              )}
            </div>
          </div>
        </>
      )}

      {/* Company Identity */}
      {(foundedYear || operatingStatus) && (
        <>
          <Separator className="my-3" />
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {foundedYear && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Founded {foundedYear}</span>
              </div>
            )}
            {operatingStatus && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{formatStatus(operatingStatus)}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* View Full Portfolio Button - Centered */}
      <div className="pt-2 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewFull}
          className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
        >
          View full company portfolio
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="bg-card px-4 py-4">
        <h3 className="text-sm font-bold text-foreground mb-3">Company Portfolio</h3>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Company Portfolio</h3>
        {content}
      </CardContent>
    </Card>
  );
}