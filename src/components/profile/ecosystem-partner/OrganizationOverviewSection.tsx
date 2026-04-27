import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Building2, 
  Globe, 
  ChevronDown, 
  ChevronUp,
  Users,
  Clock,
  Briefcase,
  Award,
  Handshake,
  Edit2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';

interface PartnershipEntry {
  name: string;
  type?: string;
}

interface OrganizationOverviewData {
  founded_year?: string | null;
  headquarters?: string | null;
  organization_type?: string | null;
  geographic_focus?: string[];
  mission_statement?: string | null;
  focus_areas?: string[];
  sectors?: string[];
  engagement_type?: string | null;
  program_duration?: string | null;
  equity_model?: string | null;
  partnerships?: PartnershipEntry[];
  startups_supported_count?: number | null;
  years_active?: number | null;
  global_alumni_reach?: string | null;
}

interface OrganizationOverviewSectionProps {
  data: OrganizationOverviewData;
  isEditable?: boolean;
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
  vc: 'Venture Capital',
  hybrid: 'Hybrid',
};

export function OrganizationOverviewSection({ 
  data, 
  isEditable = false,
  isMobile = false 
}: OrganizationOverviewSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const hasBasicInfo = data.founded_year || data.headquarters || data.organization_type || (data.geographic_focus && data.geographic_focus.length > 0);
  const hasMission = data.mission_statement;
  const hasFocusAreas = (data.focus_areas && data.focus_areas.length > 0) || (data.sectors && data.sectors.length > 0);
  const hasExpandedContent = data.engagement_type || data.program_duration || data.equity_model || 
    (data.partnerships && data.partnerships.length > 0) ||
    data.startups_supported_count || data.years_active || data.global_alumni_reach;

  const hasAnyContent = hasBasicInfo || hasMission || hasFocusAreas;

  if (!hasAnyContent && !isEditable) return null;

  const handleEdit = () => {
    navigate('/edit-section?section=organization-overview');
  };

  const sectionContent = (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      {/* Default/Collapsed View */}
      <div className="space-y-4">
        {/* Institutional Snapshot */}
        {hasBasicInfo && (
          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {data.founded_year && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Founded:</span>
                <span className="font-medium">{data.founded_year}</span>
              </div>
            )}
            {data.headquarters && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">HQ:</span>
                <span className="font-medium">{data.headquarters}</span>
              </div>
            )}
            {data.organization_type && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">
                  {organizationTypeLabels[data.organization_type] || data.organization_type}
                </span>
              </div>
            )}
            {data.geographic_focus && data.geographic_focus.length > 0 && (
              <div className="flex items-start gap-2 text-sm col-span-full">
                <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Regions:</span>
                <div className="flex flex-wrap gap-1">
                  {data.geographic_focus.slice(0, 4).map((region, index) => (
                    <Badge key={index} variant="secondary" className="text-xs py-0 px-1.5">
                      {region}
                    </Badge>
                  ))}
                  {data.geographic_focus.length > 4 && (
                    <Badge variant="secondary" className="text-xs py-0 px-1.5">
                      +{data.geographic_focus.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mission */}
        {hasMission && (
          <div className="pt-3 border-t border-border/30">
            <p className="text-sm text-foreground leading-relaxed">
              {data.mission_statement}
            </p>
          </div>
        )}

        {/* Focus Areas & Sectors */}
        {hasFocusAreas && (
          <div className="pt-3 border-t border-border/30 space-y-3">
            {data.focus_areas && data.focus_areas.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Focus Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.focus_areas.map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0.5 px-2 font-normal">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.sectors && data.sectors.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Sectors</p>
                <div className="flex flex-wrap gap-1.5">
                  {data.sectors.map((sector, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0.5 px-2 font-normal">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded View */}
      {hasExpandedContent && (
        <CollapsibleContent className="space-y-4 pt-4">
          {(data.engagement_type || data.program_duration || data.equity_model) && (
            <div className="pt-3 border-t border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-2">Engagement Model</p>
              <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {data.engagement_type && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">Type:</span>
                    <span className="text-xs font-medium">{data.engagement_type}</span>
                  </div>
                )}
                {data.program_duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">Duration:</span>
                    <span className="text-xs font-medium">{data.program_duration}</span>
                  </div>
                )}
                {data.equity_model && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">Equity:</span>
                    <span className="text-xs font-medium">{data.equity_model}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {data.partnerships && data.partnerships.length > 0 && (
            <div className="pt-3 border-t border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Partnerships & Network</p>
              <div className="flex flex-wrap gap-1.5">
                {data.partnerships.map((partner, index) => (
                  <Badge key={index} variant="secondary" className="text-xs py-0.5 px-2 font-normal">
                    {partner.name}
                    {partner.type && <span className="text-muted-foreground ml-1">({partner.type})</span>}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(data.startups_supported_count || data.years_active || data.global_alumni_reach) && (
            <div className="pt-3 border-t border-border/30">
              <p className="text-xs font-medium text-muted-foreground mb-2">Legacy & Impact</p>
              <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {data.startups_supported_count && (
                  <div className="text-center p-2.5 rounded-lg bg-muted/30 border border-border/20">
                    <p className="text-lg font-semibold text-foreground">{data.startups_supported_count}+</p>
                    <p className="text-xs text-muted-foreground">Startups Supported</p>
                  </div>
                )}
                {data.years_active && (
                  <div className="text-center p-2.5 rounded-lg bg-muted/30 border border-border/20">
                    <p className="text-lg font-semibold text-foreground">{data.years_active}</p>
                    <p className="text-xs text-muted-foreground">Years Active</p>
                  </div>
                )}
                {data.global_alumni_reach && (
                  <div className="text-center p-2.5 rounded-lg bg-muted/30 border border-border/20">
                    <p className="text-lg font-semibold text-foreground">{data.global_alumni_reach}</p>
                    <p className="text-xs text-muted-foreground">Global Reach</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CollapsibleContent>
      )}

      {/* Toggle Button */}
      {hasExpandedContent && (
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-xs text-primary hover:text-primary hover:bg-transparent"
          >
            {isExpanded ? (
              <>Show less <ChevronUp className="ml-1 h-3.5 w-3.5" /></>
            ) : (
              <>View full overview <ChevronDown className="ml-1 h-3.5 w-3.5" /></>
            )}
          </Button>
        </CollapsibleTrigger>
      )}
    </Collapsible>
  );

  if (isMobile) {
    return (
      <div className="w-full bg-card border-t border-border/30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Organization Overview</h3>
            {isEditable && (
              <Button variant="ghost" size="sm" onClick={handleEdit} className="h-7 w-7 p-0">
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {sectionContent}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Organization Overview</h3>
          {isEditable && (
            <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        {sectionContent}
      </CardContent>
    </Card>
  );
}