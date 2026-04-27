import { 
  Heart, 
  Building, 
  Banknote, 
  Users, 
  GraduationCap, 
  Coins,
  Handshake,
  Megaphone,
  Target,
  Lightbulb,
  BookOpen,
  Wrench,
  Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileSectionWrapper } from '../ProfileSectionWrapper';

interface OfferingsSectionProps {
  offerings: string[];
  isMobile?: boolean;
  isOwner?: boolean;
}

const offeringConfig: Record<string, { icon: React.ElementType; label: string; accent: string }> = {
  mentorship: { icon: Heart, label: 'Mentorship', accent: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800' },
  incubation: { icon: Building, label: 'Incubation', accent: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800' },
  grants: { icon: Banknote, label: 'Grants', accent: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800' },
  network: { icon: Users, label: 'Network Access', accent: 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800' },
  workshops: { icon: GraduationCap, label: 'Workshops', accent: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800' },
  funding: { icon: Coins, label: 'Funding', accent: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800' },
  partnerships: { icon: Handshake, label: 'Partnerships', accent: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800' },
  marketing: { icon: Megaphone, label: 'Marketing Support', accent: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-800' },
  strategy: { icon: Target, label: 'Strategy', accent: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800' },
  innovation: { icon: Lightbulb, label: 'Innovation', accent: 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800' },
  resources: { icon: BookOpen, label: 'Resources', accent: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800' },
  technical: { icon: Wrench, label: 'Technical Support', accent: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-800' },
};

const defaultAccent = 'bg-muted/40 text-foreground border-border/40';

function OfferingPill({ offering, size = 'default' }: { offering: string; size?: 'sm' | 'default' }) {
  const config = offeringConfig[offering.toLowerCase()];
  const Icon = config?.icon || Lightbulb;
  const label = config?.label || offering;
  const accent = config?.accent || defaultAccent;

  const isSmall = size === 'sm';

  return (
    <div 
      className={`inline-flex items-center gap-1.5 border rounded-full transition-all
        ${accent}
        ${isSmall ? 'px-2.5 py-1.5' : 'px-3.5 py-2'}
      `}
    >
      <Icon className={isSmall ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      <span className={`font-medium leading-none ${isSmall ? 'text-[11px]' : 'text-xs'}`}>
        {label}
      </span>
    </div>
  );
}

export function OfferingsSection({ offerings, isMobile = false, isOwner = false }: OfferingsSectionProps) {
  const navigate = useNavigate();
  const hasOfferings = offerings && offerings.length > 0;

  const handleEdit = () => navigate('/edit-section?section=offerings');

  const editButton = isOwner && hasOfferings ? (
    <Button variant="ghost" size="sm" onClick={handleEdit} className={isMobile ? 'h-7 w-7 p-0' : 'h-8 w-8 p-0'}>
      <Edit2 className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
    </Button>
  ) : null;

  return (
    <ProfileSectionWrapper
      title="What We Offer"
      isEmpty={!hasOfferings}
      isOwner={isOwner}
      sectionKey="offerings"
      isMobile={isMobile}
      emptyMessage="Add offerings to showcase what your organization provides."
    >
      {isMobile ? (
        <div className="w-full bg-card border-t border-border/30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">What We Offer</h3>
              {editButton}
            </div>
            <div className="flex flex-wrap gap-2">
              {offerings.map((offering, index) => (
                <OfferingPill key={index} offering={offering} size="sm" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">What We Offer</h3>
              {editButton}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {offerings.map((offering, index) => (
                <OfferingPill key={index} offering={offering} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </ProfileSectionWrapper>
  );
}
