import { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TractionData, MetricEntry } from './TractionMetricsSection';

const METRIC_SUGGESTIONS = ['MRR', 'ARR', 'Users', 'DAU/MAU', 'Revenue', 'GMV', 'Retention', 'NPS', 'Paying customers', 'Downloads'];

interface TractionEditSectionProps {
  data: TractionData;
  onChange: (data: TractionData) => void;
  isMobile?: boolean;
}

const emptyMetric = (): MetricEntry => ({ label: '', value: '', growth: '' });

export function TractionEditSection({ data, onChange, isMobile = false }: TractionEditSectionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const metrics: MetricEntry[] = data.metrics || [];

  const updateMetrics = (next: MetricEntry[]) => onChange({ ...data, metrics: next });

  const addMetric = (label?: string) => {
    updateMetrics([...metrics, { ...emptyMetric(), label: label || '' }]);
    setShowSuggestions(false);
  };

  const removeMetric = (idx: number) => updateMetrics(metrics.filter((_, i) => i !== idx));

  const updateMetric = (idx: number, patch: Partial<MetricEntry>) => {
    const next = metrics.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    updateMetrics(next);
  };

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <Card className="border-border/50">
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Key Metrics
          </CardTitle>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 text-xs"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add metric
            </Button>
            {showSuggestions && (
              <div className="absolute right-0 top-10 z-20 bg-popover border border-border rounded-lg shadow-lg p-2 w-52">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {METRIC_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addMetric(s)}
                      className="px-2 py-1 text-xs rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addMetric()}
                  className="w-full text-xs text-muted-foreground hover:text-foreground py-1"
                >
                  + Custom metric
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Add your key metrics — MRR, users, retention, revenue, etc.
            </p>
          )}
          {metrics.map((metric, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Metric</Label>
                  <Input
                    placeholder="e.g. MRR"
                    value={metric.label}
                    onChange={(e) => updateMetric(i, { label: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Value</Label>
                  <Input
                    placeholder="e.g. $12K"
                    value={metric.value}
                    onChange={(e) => updateMetric(i, { value: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Growth (opt.)</Label>
                  <Input
                    placeholder="+25% MoM"
                    value={metric.growth || ''}
                    onChange={(e) => updateMetric(i, { growth: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeMetric(i)}
                className="mt-6 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Narrative */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Traction Narrative</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your overall traction in 2–3 sentences. What's the growth story? Key milestones?"
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            rows={4}
            maxLength={600}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(data.description || '').length}/600
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
