import { Globe, BadgeCheck, Building2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EcosystemPartnerProfile {
  organization_name?: string | null;
  organization_type?: string | null;
  overview?: string | null;
  primary_website_url?: string | null;
  is_verified?: boolean;
}

interface EcosystemPartnerSectionProps {
  profile: Partial<EcosystemPartnerProfile>;
  isEditable?: boolean;
  onChange?: (profile: Partial<EcosystemPartnerProfile>) => void;
  isMobile?: boolean;
}

const organizationTypeLabels: Record<string, string> = {
  accelerator: 'Accelerator',
  incubator: 'Incubator',
  community: 'Community',
  government: 'Government',
  corporate: 'Corporate',
  university: 'University',
  nonprofit: 'Non-Profit',
  media: 'Media',
};

export function EcosystemPartnerSection({ 
  profile, 
  isEditable = false, 
  onChange,
  isMobile = false,
}: EcosystemPartnerSectionProps) {
  const hasContent = profile?.organization_name || 
                     profile?.organization_type || 
                     profile?.overview || 
                     profile?.primary_website_url;

  if (!hasContent && !isEditable) return null;

  if (isMobile) {
    return (
      <div className="w-full bg-card border-t border-border/30">
        <div className="px-4 py-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {profile?.organization_name && (
                  <h3 className="text-sm font-semibold text-foreground">
                    {profile.organization_name}
                  </h3>
                )}
                {profile?.is_verified && (
                  <BadgeCheck className="h-4 w-4 text-amber-500 flex-shrink-0" />
                )}
              </div>
              {profile?.organization_type && (
                <Badge variant="outline" className="mt-1.5 text-xs">
                  {organizationTypeLabels[profile.organization_type] || profile.organization_type}
                </Badge>
              )}
            </div>
            {profile?.primary_website_url && (
              <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                <a 
                  href={profile.primary_website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-3.5 w-3.5 mr-1.5" />
                  Website
                </a>
              </Button>
            )}
          </div>
          
          {profile?.overview && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                Overview
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {profile.overview}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Building2 className="h-5 w-5 text-primary" />
              {profile?.organization_name && (
                <h3 className="text-lg font-semibold text-foreground">
                  {profile.organization_name}
                </h3>
              )}
              {profile?.is_verified && (
                <BadgeCheck className="h-5 w-5 text-amber-500" />
              )}
            </div>
            {profile?.organization_type && (
              <Badge variant="outline" className="mt-2">
                {organizationTypeLabels[profile.organization_type] || profile.organization_type}
              </Badge>
            )}
          </div>
          {profile?.primary_website_url && (
            <Button variant="outline" size="sm" asChild>
              <a 
                href={profile.primary_website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
        
        {profile?.overview && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Overview
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {profile.overview}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
