import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, AlertCircle, Clock, Trophy, Plus, Edit2 } from 'lucide-react';

export interface PitchNarrativeData {
  problem?: string;
  solution?: string;
  why_now?: string;
  why_us?: string;
}

interface ThePitchSectionProps {
  data?: PitchNarrativeData | null;
  isOwner?: boolean;
  isMobile?: boolean;
}

const QUADRANTS = [
  {
    key: 'problem' as const,
    label: 'THE PROBLEM',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    placeholder: 'What problem are you solving?',
  },
  {
    key: 'solution' as const,
    label: 'OUR SOLUTION',
    icon: Lightbulb,
    iconColor: 'text-yellow-500',
    placeholder: 'How do you solve it?',
  },
  {
    key: 'why_now' as const,
    label: 'WHY NOW',
    icon: Clock,
    iconColor: 'text-blue-500',
    placeholder: 'Why is now the right time?',
  },
  {
    key: 'why_us' as const,
    label: 'WHY US',
    icon: Trophy,
    iconColor: 'text-emerald-500',
    placeholder: 'What makes you uniquely positioned to win?',
  },
];

export function ThePitchSection({ data, isOwner = false, isMobile = false }: ThePitchSectionProps) {
  const navigate = useNavigate();

  const hasAnyContent = data && (data.problem || data.solution || data.why_now || data.why_us);

  // Non-owner with no content → hide
  if (!isOwner && !hasAnyContent) return null;

  // Owner empty state
  if (isOwner && !hasAnyContent) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-foreground">The Pitch</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Problem · Solution · Why Now · Why Us
            </p>
          </div>
          <div className="border-2 border-dashed border-border/50 rounded-xl py-10 px-6 text-center bg-muted/5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-base font-semibold text-foreground mb-2">
              Tell your story in 4 lines
            </h4>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Investors decide in seconds. Add Problem, Solution, Why Now, and Why Us.
            </p>
            <Button
              onClick={() => navigate('/edit-section?section=the-pitch')}
              className="gap-2 rounded-full px-6"
            >
              <Plus className="h-4 w-4" />
              Add the pitch
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filled state — 2×2 grid
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-foreground">The Pitch</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Problem · Solution · Why Now · Why Us
            </p>
          </div>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/edit-section?section=the-pitch')}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {QUADRANTS.map(({ key, label, icon: Icon, iconColor }) => {
            const text = data?.[key];
            if (!text && !isOwner) return null;
            return (
              <div
                key={key}
                className="border border-border/60 rounded-xl p-4 bg-background hover:border-border transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                  <span className="text-xs font-bold tracking-wide text-foreground uppercase">
                    {label}
                  </span>
                </div>
                {text ? (
                  <p className="text-sm text-foreground leading-relaxed">{text}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not added yet</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
