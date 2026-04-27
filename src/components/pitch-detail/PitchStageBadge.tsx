import { Badge } from '@/components/ui/badge';
import { Lightbulb, Search, Rocket, CheckCircle2 } from 'lucide-react';
import type { PitchStage } from '@/hooks/useProfilePitches';
import { cn } from '@/lib/utils';

interface PitchStageBadgeProps {
  stage: PitchStage;
  description?: string;
}

const stageConfig: Record<PitchStage, { label: string; icon: typeof Lightbulb; className: string }> = {
  idea: {
    label: 'Idea',
    icon: Lightbulb,
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  },
  research: {
    label: 'Research',
    icon: Search,
    className: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
  },
  mvp: {
    label: 'MVP',
    icon: Rocket,
    className: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  },
  early_validation: {
    label: 'Early Validation',
    icon: CheckCircle2,
    className: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  },
};

export function PitchStageBadge({ stage, description }: PitchStageBadgeProps) {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <div className="space-y-2">
      <Badge
        variant="outline"
        className={cn("gap-1.5 px-3 py-1.5 text-sm font-medium", config.className)}
      >
        <Icon className="h-4 w-4" />
        {config.label}
      </Badge>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
