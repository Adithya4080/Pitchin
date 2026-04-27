import { Trophy, Target, Globe, Users, TrendingUp, Award, Star, Zap, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { HighlightEntry } from './types';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';
import { useNavigate } from 'react-router-dom';

interface HighlightsSectionProps {
  highlights: HighlightEntry[];
  isMobile?: boolean;
  isOwner?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  target: Target,
  globe: Globe,
  users: Users,
  trending: TrendingUp,
  award: Award,
  star: Star,
  zap: Zap,
};

function HighlightCard({ highlight, isMobile }: { highlight: HighlightEntry; isMobile: boolean }) {
  const IconComponent = highlight.icon && highlight.icon !== 'none' ? iconMap[highlight.icon] : null;
  
  return (
    <div className={isMobile ? 'min-w-[200px] flex-shrink-0 snap-start' : ''}>
      <div className={`bg-muted/20 border border-border/40 rounded-lg h-full hover:border-border/70 transition-colors ${isMobile ? 'p-3.5' : 'p-4'}`}>
        <div className="flex items-start gap-3">
          {IconComponent && (
            <div className={`flex-shrink-0 rounded-md bg-muted flex items-center justify-center ${isMobile ? 'w-8 h-8' : 'w-9 h-9'}`}>
              <IconComponent className={`text-muted-foreground ${isMobile ? 'h-4 w-4' : 'h-4.5 w-4.5'}`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-foreground leading-tight ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {highlight.title}
            </h4>
            {highlight.description && (
              <p className={`text-muted-foreground mt-1 line-clamp-2 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                {highlight.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HighlightsSection({ highlights, isMobile = false, isOwner = false }: HighlightsSectionProps) {
  const navigate = useNavigate();
  const hasHighlights = highlights && highlights.length > 0;
  const displayHighlights = highlights?.slice(0, 6) || [];

  const handleEdit = () => navigate('/edit-section?section=highlights');

  const editButton = isOwner && hasHighlights ? (
    <Button variant="ghost" size="sm" onClick={handleEdit} className={isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}>
      <Edit2 className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </Button>
  ) : null;

  return (
    <ProfileSectionWrapper
      title="Featured Highlights"
      isEmpty={!hasHighlights}
      isOwner={isOwner}
      sectionKey="highlights"
      isMobile={isMobile}
      emptyMessage="Add key achievements or impact metrics to build credibility."
      ctaText="Add Highlight"
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Featured Highlights</h3>
              {editButton}
            </div>
            <div 
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', marginRight: '-1rem', paddingRight: '1rem' }}
            >
              {displayHighlights.map((highlight, index) => (
                <HighlightCard key={index} highlight={highlight} isMobile={true} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Featured Highlights</h3>
              {editButton}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {displayHighlights.map((highlight, index) => (
                <HighlightCard key={index} highlight={highlight} isMobile={false} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}