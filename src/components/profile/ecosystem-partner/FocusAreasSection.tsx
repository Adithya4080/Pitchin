import { Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';

interface FocusAreasSectionProps {
  focusIndustries: string[];
  supportedStages: string[];
  geographicFocus: string[];
  isMobile?: boolean;
  isOwner?: boolean;
}

const stageLabels: Record<string, string> = {
  idea: 'Idea Stage',
  mvp: 'MVP',
  growth: 'Growth',
  scale: 'Scale',
  'pre-seed': 'Pre-Seed',
  seed: 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B+',
};

export function FocusAreasSection({ 
  focusIndustries, 
  supportedStages, 
  geographicFocus,
  isMobile = false,
  isOwner = false,
}: FocusAreasSectionProps) {
  const navigate = useNavigate();
  const hasContent = (focusIndustries?.length > 0) || 
                     (supportedStages?.length > 0) || 
                     (geographicFocus?.length > 0);

  const handleEdit = () => navigate('/edit-section?section=focus-areas');

  const editButton = isOwner && hasContent ? (
    <Button variant="ghost" size="sm" onClick={handleEdit} className={isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}>
      <Edit2 className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </Button>
  ) : null;

  const tagGroups = (
    <div className="space-y-4">
      {focusIndustries && focusIndustries.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Focus Industries</p>
          <div className="flex flex-wrap gap-1.5">
            {focusIndustries.map((industry, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className={`bg-primary/10 text-primary border-primary/20 ${isMobile ? 'text-xs' : ''}`}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {supportedStages && supportedStages.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Supported Stages</p>
          <div className="flex flex-wrap gap-1.5">
            {supportedStages.map((stage, index) => (
              <Badge key={index} variant="outline" className={isMobile ? 'text-xs' : ''}>
                {stageLabels[stage.toLowerCase()] || stage}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {geographicFocus && geographicFocus.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Geographic Focus</p>
          <div className="flex flex-wrap gap-1.5">
            {geographicFocus.map((geo, index) => (
              <Badge key={index} variant="outline" className={isMobile ? 'text-xs' : ''}>
                {geo}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ProfileSectionWrapper
      title="Focus Areas & Stages"
      isEmpty={!hasContent}
      isOwner={isOwner}
      sectionKey="focus-areas"
      isMobile={isMobile}
      emptyMessage="Add focus industries, supported stages, and geographic focus."
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Focus Areas & Stages</h3>
              {editButton}
            </div>
            {tagGroups}
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Focus Areas & Stages</h3>
              {editButton}
            </div>
            {tagGroups}
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}