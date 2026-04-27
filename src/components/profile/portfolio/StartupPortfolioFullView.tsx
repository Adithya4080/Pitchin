import {
  Building2,
  Target,
  Calendar,
  MapPin,
  Compass,
  Focus,
  CheckCircle,
  Users,
  Clock,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  StartupProfile,
  EcosystemSupportEntry,
  CompanyJourneyEntry,
} from "@/api/profiles";

interface StartupPortfolioFullViewProps {
  profile: Partial<StartupProfile> | null;
  isExpanded: boolean;
  onCollapse: () => void;
  isMobile?: boolean;
}

export function StartupPortfolioFullView({
  profile,
  isExpanded,
  onCollapse,
  isMobile = false,
}: StartupPortfolioFullViewProps) {
  if (!isExpanded) return null;

  const companySnapshot = profile?.company_snapshot || "";
  const industryTags = profile?.industry_tags || [];
  const marketType = profile?.market_type || "";
  const stage = profile?.stage || "";
  const foundedYear = profile?.founded_year || "";
  const operatingStatus = profile?.operating_status || "";
  const companyBackground = profile?.company_background || "";
  const visionDirection = profile?.vision_direction || "";
  const currentFocus = profile?.current_focus || "";
  const progressHighlights = profile?.progress_highlights || [];
  const ecosystemSupport = (profile?.ecosystem_support || []) as EcosystemSupportEntry[];
  const companyJourney = (profile?.company_journey_timeline || []) as CompanyJourneyEntry[];

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
    <div className="space-y-6">
      {/* Company Snapshot */}
      {companySnapshot && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Company Snapshot
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {companySnapshot}
          </p>
        </section>
      )}

      {/* Focus Areas */}
      {(industryTags.length > 0 || marketType || stage) && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
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
        </section>
      )}

      {/* Company Identity */}
      {(foundedYear || operatingStatus) && (
        <section>
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
        </section>
      )}

      <Separator />

      {/* Company Background */}
      {companyBackground && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Compass className="h-4 w-4 text-muted-foreground" />
            Company Background
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {companyBackground}
          </p>
        </section>
      )}

      {/* Vision & Direction */}
      {visionDirection && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            Vision & Direction
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {visionDirection}
          </p>
        </section>
      )}

      {/* Current Stage & Focus */}
      {currentFocus && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Focus className="h-4 w-4 text-muted-foreground" />
            Current Stage & Focus
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentFocus}
          </p>
        </section>
      )}

      {/* Progress Highlights */}
      {progressHighlights.length > 0 && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            Progress Highlights
          </h4>
          <ul className="space-y-2">
            {progressHighlights.map((highlight, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Ecosystem Support */}
      {ecosystemSupport.length > 0 && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            Ecosystem Support
          </h4>
          <div className="space-y-2">
            {ecosystemSupport.map((support, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{support.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{support.type}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Company Journey Timeline */}
      {companyJourney.length > 0 && (
        <section>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Company Journey
          </h4>
          <div className="relative pl-4 border-l-2 border-primary/30 space-y-4">
            {companyJourney.map((entry, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.3rem] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                <p className="text-xs font-medium text-primary">{entry.year}</p>
                <p className="text-sm text-muted-foreground">{entry.milestone}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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