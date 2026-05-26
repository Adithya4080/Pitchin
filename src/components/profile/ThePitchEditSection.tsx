import { AlertCircle, Clock, Lightbulb, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { PitchNarrativeData } from './ThePitchSection';

interface ThePitchEditSectionProps {
  data: PitchNarrativeData;
  onChange: (data: PitchNarrativeData) => void;
  isMobile?: boolean;
}

const FIELDS = [
  {
    key: 'problem' as const,
    label: 'The Problem',
    sublabel: 'THE PROBLEM',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    placeholder: 'What specific problem are you solving? Be concrete — who suffers from it and how badly?',
    maxLength: 400,
    hint: 'Tip: Start with "Today, [persona] struggles with…"',
  },
  {
    key: 'solution' as const,
    label: 'Our Solution',
    sublabel: 'OUR SOLUTION',
    icon: Lightbulb,
    iconColor: 'text-yellow-500',
    placeholder: 'How do you solve it? Whats the core insight or mechanism?',
    maxLength: 400,
    hint: 'Tip: One crisp sentence, then one sentence on how it works.',
  },
  {
    key: 'why_now' as const,
    label: 'Why Now',
    sublabel: 'WHY NOW',
    icon: Clock,
    iconColor: 'text-blue-500',
    placeholder: 'What has changed — technically, behaviourally, or in the market — that makes this the right moment?',
    maxLength: 300,
    hint: 'Tip: Regulatory shift, new tech unlock, or behaviour change?',
  },
  {
    key: 'why_us' as const,
    label: 'Why Us',
    sublabel: 'WHY US',
    icon: Trophy,
    iconColor: 'text-emerald-500',
    placeholder: 'What is your unfair advantage? Domain expertise, proprietary data, network, team?',
    maxLength: 300,
    hint: 'Tip: Be specific — avoid "passionate team with deep expertise".',
  },
];

export function ThePitchEditSection({ data, onChange, isMobile = false }: ThePitchEditSectionProps) {
  const update = (key: keyof PitchNarrativeData, value: string) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-4">
      {/* Live preview strip */}
      {(data.problem || data.solution || data.why_now || data.why_us) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Preview</p>
            <div className="grid grid-cols-2 gap-2">
              {FIELDS.map(({ key, sublabel, icon: Icon, iconColor }) =>
                data[key] ? (
                  <div key={key} className="border border-border/50 rounded-lg p-3 bg-background">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                      <span className="text-[10px] font-bold tracking-wide uppercase text-foreground">
                        {sublabel}
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed line-clamp-3">{data[key]}</p>
                  </div>
                ) : null
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit fields */}
      {FIELDS.map(({ key, label, icon: Icon, iconColor, placeholder, maxLength, hint }) => (
        <Card key={key} className="border-border/50">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Icon className={`h-4 w-4 ${iconColor}`} />
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <Textarea
              placeholder={placeholder}
              value={data[key] || ''}
              onChange={(e) => update(key, e.target.value)}
              rows={3}
              maxLength={maxLength}
              className="resize-none text-sm"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{hint}</p>
              <p className="text-xs text-muted-foreground shrink-0 ml-2">
                {(data[key] || '').length}/{maxLength}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
