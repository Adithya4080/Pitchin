import { ChevronUp, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  InnovatorProfile,
  EducationEntry,
  WorkExperienceEntry,
  MentorBackerEntry,
  JourneyTimelineEntry,
} from "@/api/profiles";

interface PortfolioFullViewProps {
  profile: Partial<InnovatorProfile> | null;
  isExpanded: boolean;
  onCollapse: () => void;
  isMobile?: boolean;
}

export function PortfolioFullView({
  profile,
  isExpanded,
  onCollapse,
  isMobile = false,
}: PortfolioFullViewProps) {
  if (!isExpanded) return null;

  const professionalSnapshot = profile?.professional_snapshot || "";
  const focusAreas = profile?.focus_areas || [];
  const currentIdentity = profile?.current_identity || "";
  const experienceSummary = profile?.experience_summary || "";
  const backgroundJourney = profile?.background_journey || "";
  const education = (profile?.education || []) as EducationEntry[];
  const workExperience = (profile?.work_experience || []) as WorkExperienceEntry[];
  const skillsCapabilities = profile?.skills_capabilities || [];
  const mentorsBackers = (profile?.mentors_backers || []) as MentorBackerEntry[];
  const journeyTimeline = (profile?.journey_timeline || []) as JourneyTimelineEntry[];

  const content = (
    <div className="space-y-6">
      {/* Professional Snapshot */}
      {professionalSnapshot && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-2">
            Professional Snapshot
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {professionalSnapshot}
          </p>
        </section>
      )}

      {/* Current Identity */}
      {currentIdentity && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-2">
            Current Identity
          </h4>
          <Badge variant="outline" className="text-sm font-normal">
            {currentIdentity}
          </Badge>
        </section>
      )}

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-2">
            Focus Areas & Expertise
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {focusAreas.map((area, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Experience Summary */}
      {experienceSummary && (
        <section>
          <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
            {experienceSummary}
          </p>
        </section>
      )}

      <Separator />

      {/* Background & Journey */}
      {backgroundJourney && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-3">
            Background & Journey
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {backgroundJourney}
          </p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-3">
            Education
          </h4>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-medium text-sm text-foreground">{edu.institution}</p>
                {edu.field_of_study && (
                  <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                )}
                {edu.duration && (
                  <p className="text-xs text-muted-foreground mt-1">{edu.duration}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-3">
            Experience & Work
          </h4>
          <div className="space-y-3">
            {workExperience.map((exp, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-foreground">{exp.role}</p>
                    {exp.organization && (
                      <p className="text-sm text-muted-foreground">{exp.organization}</p>
                    )}
                  </div>
                  {exp.time_period && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {exp.time_period}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Capabilities */}
      {skillsCapabilities.length > 0 && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-3">
            Skills & Capabilities
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {skillsCapabilities.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Mentors / Backers / Support */}
      {mentorsBackers.length > 0 && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-3">
            Mentors & Backers
          </h4>
          <div className="space-y-2">
            {mentorsBackers.map((mentor, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{mentor.name}</p>
                  {mentor.role && (
                    <p className="text-xs text-muted-foreground">{mentor.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Journey Timeline */}
      {journeyTimeline.length > 0 && (
        <section>
          <h4 className="text-sm font-bold text-foreground mb-3">
            Journey Timeline
          </h4>
          <div className="relative pl-4 border-l-2 border-primary/30 space-y-4">
            {journeyTimeline.map((entry, index) => (
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
