import { useState } from 'react';
import { Plus, Trash2, GripVertical, Trophy, Target, Globe, Users, TrendingUp, Award, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { HighlightEntry } from './types';

interface HighlightsEditSectionProps {
  highlights: HighlightEntry[];
  onChange: (highlights: HighlightEntry[]) => void;
}

const MAX_HIGHLIGHTS = 6;
const MAX_TITLE_LENGTH = 40;
const MAX_DESCRIPTION_LENGTH = 60;

const iconOptions = [
  { value: 'none', label: 'No icon', icon: null },
  { value: 'trophy', label: 'Trophy', icon: Trophy },
  { value: 'target', label: 'Target', icon: Target },
  { value: 'globe', label: 'Globe', icon: Globe },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'trending', label: 'Trending', icon: TrendingUp },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'zap', label: 'Lightning', icon: Zap },
];

export function HighlightsEditSection({ highlights, onChange }: HighlightsEditSectionProps) {
  const [localHighlights, setLocalHighlights] = useState<HighlightEntry[]>(highlights || []);

  const updateAndSync = (updated: HighlightEntry[]) => {
    setLocalHighlights(updated);
    onChange(updated);
  };

  const addHighlight = () => {
    if (localHighlights.length >= MAX_HIGHLIGHTS) return;
    updateAndSync([
      ...localHighlights,
      { title: '', description: '', icon: 'none' },
    ]);
  };

  const updateHighlight = (index: number, field: keyof HighlightEntry, value: string) => {
    const updated = [...localHighlights];
    
    // Enforce character limits
    if (field === 'title' && value.length > MAX_TITLE_LENGTH) {
      value = value.slice(0, MAX_TITLE_LENGTH);
    }
    if (field === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      value = value.slice(0, MAX_DESCRIPTION_LENGTH);
    }
    
    updated[index] = { ...updated[index], [field]: value };
    updateAndSync(updated);
  };

  const removeHighlight = (index: number) => {
    const updated = localHighlights.filter((_, i) => i !== index);
    updateAndSync(updated);
  };

  const moveHighlight = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === localHighlights.length - 1)
    ) {
      return;
    }

    const updated = [...localHighlights];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    updateAndSync(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Featured Highlights</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add key achievements, metrics, or milestones ({localHighlights.length}/{MAX_HIGHLIGHTS})
          </p>
        </div>
        {localHighlights.length < MAX_HIGHLIGHTS && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addHighlight}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Highlight
          </Button>
        )}
      </div>

      {localHighlights.length === 0 ? (
        <Card className="border-2 border-dashed border-border/50 bg-muted/5">
          <CardContent className="py-8 text-center">
            <Trophy className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Showcase your impact with key metrics and achievements
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHighlight}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Highlight
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {localHighlights.map((highlight, index) => {
            const IconComponent = highlight.icon 
              ? iconOptions.find(o => o.value === highlight.icon)?.icon 
              : null;
              
            return (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Drag handle placeholder */}
                    <div className="flex-shrink-0 pt-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                        {/* Title input */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Title</Label>
                            <span className="text-xs text-muted-foreground">
                              {highlight.title?.length || 0}/{MAX_TITLE_LENGTH}
                            </span>
                          </div>
                          <Input
                            value={highlight.title || ''}
                            onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                            placeholder="e.g., $300B+ Alumni Valuation"
                            maxLength={MAX_TITLE_LENGTH}
                            className="text-sm"
                          />
                        </div>

                        {/* Icon selector */}
                        <div className="space-y-1.5">
                          <Label className="text-xs">Icon</Label>
                          <Select
                            value={highlight.icon || 'none'}
                            onValueChange={(value) => updateHighlight(index, 'icon', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select icon">
                                {IconComponent ? (
                                  <span className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    <span className="text-sm">
                                      {iconOptions.find(o => o.value === highlight.icon)?.label}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">No icon</span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <span className="flex items-center gap-2">
                                    {option.icon && <option.icon className="h-4 w-4" />}
                                    <span>{option.label}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Description input */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs">Description (optional)</Label>
                          <span className="text-xs text-muted-foreground">
                            {highlight.description?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                          </span>
                        </div>
                        <Input
                          value={highlight.description || ''}
                          onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                          placeholder="e.g., Across YC-backed companies"
                          maxLength={MAX_DESCRIPTION_LENGTH}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHighlight(index)}
                      className="flex-shrink-0 h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Example hints */}
      <div className="rounded-lg bg-muted/30 p-4 border border-border/30">
        <h4 className="text-xs font-medium text-foreground mb-2">Example highlights:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <strong>$300B+</strong> — Combined alumni valuation</li>
          <li>• <strong>4,000+ startups</strong> — Accelerated since 2005</li>
          <li>• <strong>Top Accelerator</strong> — Forbes ranking 2024</li>
          <li>• <strong>Programs in 30+ countries</strong> — Global reach</li>
        </ul>
      </div>
    </div>
  );
}
