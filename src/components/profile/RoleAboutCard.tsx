import { Lightbulb, Building2, TrendingUp, Briefcase, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/hooks/useUserRole";
import { InnovatorProfile, StartupProfile, InvestorProfile, ConsultantProfile } from "@/api/profiles";

type RoleProfile = Partial<InnovatorProfile> | Partial<StartupProfile> | Partial<InvestorProfile> | Partial<ConsultantProfile>;

interface RoleAboutCardProps {
  role: UserRole | null;
  roleProfile: RoleProfile | null;
  isMobile?: boolean;
}

const ROLE_ICONS = {
  innovator: Lightbulb,
  startup: Building2,
  investor: TrendingUp,
  consultant: Briefcase,
};

const ROLE_TITLES = {
  innovator: "Innovator",
  startup: "Startup / Business",
  investor: "Investor",
  consultant: "Consultant",
};

export function RoleAboutCard({ role, roleProfile, isMobile = false }: RoleAboutCardProps) {
  if (!role || !roleProfile) {
    return null;
  }

  const Icon = ROLE_ICONS[role] || User;
  const title = ROLE_TITLES[role] || "About";

  // Get role-specific summary content
  const getSummaryContent = () => {
    switch (role) {
      case "innovator": {
        const profile = roleProfile as Partial<InnovatorProfile>;
        const skills = profile.skills || [];
        const hasContent = skills.length > 0 || profile.achievements || profile.featured_project_title;
        if (!hasContent) return null;
        
        return (
          <div className="space-y-4">
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 5 && (
                  <Badge variant="outline" className="text-sm py-1.5 px-3">
                    +{skills.length - 5} more
                  </Badge>
                )}
              </div>
            )}
            {profile.achievements && (
              <p className="text-base text-muted-foreground line-clamp-3">
                {profile.achievements}
              </p>
            )}
          </div>
        );
      }
      case "startup": {
        const profile = roleProfile as Partial<StartupProfile>;
        const hasContent = profile.company_name || profile.company_overview || profile.industry_tags?.length;
        if (!hasContent) return null;
        
        return (
          <div className="space-y-4">
            {profile.company_name && (
              <p className="font-semibold text-lg text-foreground">{profile.company_name}</p>
            )}
            {profile.company_overview && (
              <p className="text-base text-muted-foreground line-clamp-3">
                {profile.company_overview}
              </p>
            )}
            {profile.industry_tags && profile.industry_tags.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {profile.industry_tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      }
      case "investor": {
        const profile = roleProfile as Partial<InvestorProfile>;
        const hasContent = profile.investor_type || profile.investment_range || profile.preferred_sectors?.length || profile.investment_criteria;
        if (!hasContent) return null;
        
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {profile.investor_type && (
                <Badge variant="outline" className="text-sm py-1.5 px-3 capitalize">
                  {profile.investor_type.replace('_', ' ')}
                </Badge>
              )}
              {profile.investment_range && (
                <span className="text-base text-muted-foreground">{profile.investment_range}</span>
              )}
            </div>
            {profile.investment_criteria && (
              <p className="text-base text-muted-foreground line-clamp-3">
                {profile.investment_criteria}
              </p>
            )}
          </div>
        );
      }
      case "consultant": {
        const profile = roleProfile as Partial<ConsultantProfile>;
        const hasContent = profile.expertise_areas?.length || profile.experience_summary || profile.services_offered;
        if (!hasContent) return null;
        
        return (
          <div className="space-y-4">
            {profile.expertise_areas && profile.expertise_areas.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {profile.expertise_areas.slice(0, 5).map((area, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                    {area}
                  </Badge>
                ))}
                {profile.expertise_areas.length > 5 && (
                  <Badge variant="outline" className="text-sm py-1.5 px-3">
                    +{profile.expertise_areas.length - 5} more
                  </Badge>
                )}
              </div>
            )}
            {profile.experience_summary && (
              <p className="text-base text-muted-foreground line-clamp-3">
                {profile.experience_summary}
              </p>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const content = getSummaryContent();
  if (!content) return null;

  // Mobile: full-width with white background and no rounded corners
  if (isMobile) {
    return (
      <div className="bg-card px-5 py-5">
        <h3 className="text-base font-bold text-foreground mb-4">
          About ({title})
        </h3>
        {content}
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h3 className="text-base font-bold text-foreground mb-4">
          About ({title})
        </h3>
        {content}
      </CardContent>
    </Card>
  );
}