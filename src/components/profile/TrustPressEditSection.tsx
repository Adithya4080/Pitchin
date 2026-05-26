import { useState } from 'react';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TrustPressData, TrustProofEntry } from './TrustPressSection';

const TYPE_OPTIONS: { value: TrustProofEntry['type']; label: string; placeholder: string }[] = [
  { value: 'press', label: 'Press Coverage', placeholder: 'e.g. Featured in TechCrunch' },
  { value: 'award', label: 'Award / Recognition', placeholder: 'e.g. Top 10 Startup — YC 2024' },
  { value: 'customer_logo', label: 'Customer / Partner', placeholder: 'e.g. Partnered with Reliance' },
  { value: 'certification', label: 'Certification', placeholder: 'e.g. ISO 27001 Certified' },
  { value: 'testimonial', label: 'Testimonial', placeholder: 'e.g. "Game-changer" — CEO, Acme' },
];

const emptyProof = (): TrustProofEntry => ({
  type: 'press',
  title: '',
  source: '',
  url: '',
  description: '',
  date: '',
});

interface TrustPressEditSectionProps {
  data: TrustPressData;
  onChange: (data: TrustPressData) => void;
  isMobile?: boolean;
}

export function TrustPressEditSection({ data, onChange, isMobile = false }: TrustPressEditSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const proofs: TrustProofEntry[] = data.proofs || [];

  const addProof = () => {
    const next = [...proofs, emptyProof()];
    onChange({ ...data, proofs: next });
    setExpanded(next.length - 1);
  };

  const removeProof = (idx: number) => {
    onChange({ ...data, proofs: proofs.filter((_, i) => i !== idx) });
    setExpanded(null);
  };

  const updateProof = (idx: number, patch: Partial<TrustProofEntry>) => {
    const next = proofs.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    onChange({ ...data, proofs: next });
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Trust Signals & Press
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={addProof}
          >
            <Plus className="h-3.5 w-3.5" />
            Add entry
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {proofs.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              Add press mentions, awards, customer logos, certifications or testimonials.
            </p>
          )}

          {proofs.map((proof, i) => {
            const isOpen = expanded === i;
            const typeInfo = TYPE_OPTIONS.find((t) => t.value === proof.type);
            return (
              <div key={i} className="border border-border/50 rounded-lg overflow-hidden">
                {/* Collapsed header */}
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {proof.title || <span className="text-muted-foreground italic">Untitled entry</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{typeInfo?.label}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeProof(i); }}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Expanded form */}
                {isOpen && (
                  <div className="border-t border-border/50 p-4 space-y-3 bg-muted/10">
                    {/* Type */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={proof.type}
                        onValueChange={(v) => updateProof(i, { type: v as TrustProofEntry['type'] })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TYPE_OPTIONS.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title / Headline *</Label>
                      <Input
                        placeholder={typeInfo?.placeholder || ''}
                        value={proof.title}
                        onChange={(e) => updateProof(i, { title: e.target.value })}
                        maxLength={120}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Source */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Source / Publication</Label>
                        <Input
                          placeholder="TechCrunch, Forbes…"
                          value={proof.source || ''}
                          onChange={(e) => updateProof(i, { source: e.target.value })}
                        />
                      </div>
                      {/* Date */}
                      <div className="space-y-1.5">
                        <Label className="text-xs">Date (optional)</Label>
                        <Input
                          placeholder="Jan 2025"
                          value={proof.date || ''}
                          onChange={(e) => updateProof(i, { date: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* URL */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Link (optional)</Label>
                      <Input
                        placeholder="https://…"
                        value={proof.url || ''}
                        onChange={(e) => updateProof(i, { url: e.target.value })}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Short description (optional)</Label>
                      <Textarea
                        placeholder="Brief context, quote, or note…"
                        value={proof.description || ''}
                        onChange={(e) => updateProof(i, { description: e.target.value })}
                        rows={2}
                        maxLength={300}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
