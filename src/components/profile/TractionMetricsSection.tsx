import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Plus, Edit2 } from 'lucide-react';

export interface MetricEntry {
  label: string;    // e.g., "MRR", "Users", "Revenue"
  value: string;    // e.g., "$12K", "5,000"
  growth?: string;  // e.g., "+25% MoM"
}

export interface TractionData {
  metrics?: MetricEntry[];
  description?: string;  // overall traction narrative
}

interface TractionMetricsSectionProps {
  traction?: TractionData | null;
  isOwner?: boolean;
  isMobile?: boolean;
}

export function TractionMetricsSection({ traction, isOwner = false, isMobile = false }: TractionMetricsSectionProps) {
  const navigate = useNavigate();
  const isEmpty = !traction || (!traction.description && (!traction.metrics || traction.metrics.length === 0));

  if (isEmpty && !isOwner) return null;

  if (isEmpty && isOwner) {
    return (
      <Card className="border-2 border-dashed border-border/50 bg-muted/5">
        <CardContent className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Traction & Metrics</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Investors look for traction more than ideas. Track your MRR, Gross GMV, cohort growth, retention, milestones — you know the drill.
          </p>
          <Button
            size="sm"
            onClick={() => navigate('/edit-section?section=traction')}
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add metric
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Traction & Metrics
        </CardTitle>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/edit-section?section=traction')}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {traction?.metrics && traction.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {traction.metrics.map((metric, i) => (
              <div key={i} className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">{metric.label}</p>
                <p className="text-base font-bold text-foreground">{metric.value}</p>
                {metric.growth && (
                  <Badge variant="secondary" className="text-xs mt-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {metric.growth}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
        {traction?.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{traction.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
