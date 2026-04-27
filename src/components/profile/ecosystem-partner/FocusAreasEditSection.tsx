import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FocusAreasEditSectionProps {
  focusIndustries: string[];
  supportedStages: string[];
  geographicFocus: string[];
  onChange: (data: {
    focus_industries: string[];
    supported_stages: string[];
    geographic_focus: string[];
  }) => void;
}

const stageOptions = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'mvp', label: 'MVP' },
  { value: 'growth', label: 'Growth' },
  { value: 'scale', label: 'Scale' },
  { value: 'pre-seed', label: 'Pre-Seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B+' },
];

export function FocusAreasEditSection({
  focusIndustries,
  supportedStages,
  geographicFocus,
  onChange,
}: FocusAreasEditSectionProps) {
  const [industryInput, setIndustryInput] = useState('');
  const [geoInput, setGeoInput] = useState('');

  const addIndustry = () => {
    const val = industryInput.trim();
    if (val && !focusIndustries.includes(val)) {
      onChange({
        focus_industries: [...focusIndustries, val],
        supported_stages: supportedStages,
        geographic_focus: geographicFocus,
      });
      setIndustryInput('');
    }
  };

  const removeIndustry = (index: number) => {
    onChange({
      focus_industries: focusIndustries.filter((_, i) => i !== index),
      supported_stages: supportedStages,
      geographic_focus: geographicFocus,
    });
  };

  const toggleStage = (stage: string) => {
    const updated = supportedStages.includes(stage)
      ? supportedStages.filter((s) => s !== stage)
      : [...supportedStages, stage];
    onChange({
      focus_industries: focusIndustries,
      supported_stages: updated,
      geographic_focus: geographicFocus,
    });
  };

  const addGeo = () => {
    const val = geoInput.trim();
    if (val && !geographicFocus.includes(val)) {
      onChange({
        focus_industries: focusIndustries,
        supported_stages: supportedStages,
        geographic_focus: [...geographicFocus, val],
      });
      setGeoInput('');
    }
  };

  const removeGeo = (index: number) => {
    onChange({
      focus_industries: focusIndustries,
      supported_stages: supportedStages,
      geographic_focus: geographicFocus.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Focus Industries */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Focus Industries</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. FinTech, HealthTech, AI..."
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="icon" onClick={addIndustry}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {focusIndustries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {focusIndustries.map((industry, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 gap-1 pr-1"
              >
                {industry}
                <button
                  type="button"
                  onClick={() => removeIndustry(index)}
                  className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Supported Stages */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Supported Stages</Label>
        <p className="text-xs text-muted-foreground">Select all stages you support.</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {stageOptions.map((stage) => {
            const isSelected = supportedStages.includes(stage.value);
            return (
              <Badge
                key={stage.value}
                variant={isSelected ? 'default' : 'outline'}
                className={`cursor-pointer transition-colors ${
                  isSelected ? '' : 'hover:bg-accent'
                }`}
                onClick={() => toggleStage(stage.value)}
              >
                {stage.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Geographic Focus */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Geographic Focus</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. MENA, Southeast Asia, Global..."
            value={geoInput}
            onChange={(e) => setGeoInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGeo())}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="icon" onClick={addGeo}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {geographicFocus.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {geographicFocus.map((geo, index) => (
              <Badge
                key={index}
                variant="outline"
                className="gap-1 pr-1"
              >
                {geo}
                <button
                  type="button"
                  onClick={() => removeGeo(index)}
                  className="ml-0.5 rounded-full hover:bg-accent p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
