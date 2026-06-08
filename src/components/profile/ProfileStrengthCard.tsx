import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield } from 'lucide-react';

interface ProfileStrengthItem {
  label: string;
  completed: boolean;
  href?: string;
}

interface ProfileStrengthCardProps {
  bio?: string;
  hasIntroVideo?: boolean;
  hasFunding?: boolean;
  hasTraction?: boolean;
  hasTrustPress?: boolean;
  hasTeam?: boolean;
  hasCompanyPortfolio?: boolean;
  hasPitch?: boolean;
}

export function ProfileStrengthCard({
  bio,
  hasIntroVideo,
  hasFunding,
  hasTraction,
  hasTrustPress,
  hasTeam,
  hasCompanyPortfolio,
  hasPitch,
}: ProfileStrengthCardProps) {
  const navigate = useNavigate();

  const items: ProfileStrengthItem[] = [
    { label: 'Write your Problem / Solution / Why Now / Why Us', completed: !!bio },
    { label: 'Add an introduction video', completed: !!hasIntroVideo },
    { label: 'Add funding details', completed: !!hasFunding },
    { label: 'Add traction metrics', completed: !!hasTraction },
    { label: 'Add trust & press proof', completed: !!hasTrustPress },
    { label: 'Add team members', completed: !!hasTeam },
    { label: 'Add company portfolio', completed: !!hasCompanyPortfolio },
    { label: 'Create your first pitch', completed: !!hasPitch },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const strengthPercent = Math.round((completedCount / items.length) * 100);

  const nextItem = items.find((i) => !i.completed);

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Profile strength</span>
          </div>
          <span className="text-sm font-bold text-primary">{strengthPercent}% Words used</span>
        </div>

        <Progress value={strengthPercent} className="h-2 mb-3" />

        {nextItem && (
          <p className="text-xs text-muted-foreground mb-3">
            Next: {nextItem.label}
          </p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => navigate('/edit-section?section=profile')}
        >
          Improve →
        </Button>
      </CardContent>
    </Card>
  );
}
