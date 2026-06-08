import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import type { FundingData } from './FundingSection';

const STAGE_OPTIONS = [
  'Bootstrapped', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Grant', 'Revenue-funded',
];

interface FundingEditSectionProps {
  data: FundingData;
  onChange: (data: FundingData) => void;
  isMobile?: boolean;
}

export function FundingEditSection({ data, onChange, isMobile = false }: FundingEditSectionProps) {
  const [newInvestor, setNewInvestor] = useState('');

  const update = (patch: Partial<FundingData>) => onChange({ ...data, ...patch });

  const addInvestor = () => {
    const trimmed = newInvestor.trim();
    if (!trimmed) return;
    update({ investors: [...(data.investors || []), trimmed] });
    setNewInvestor('');
  };

  const removeInvestor = (idx: number) => {
    const next = (data.investors || []).filter((_, i) => i !== idx);
    update({ investors: next });
  };

  return (
    <div className="space-y-5">
      {/* Stage */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Funding Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {STAGE_OPTIONS.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => update({ stage: data.stage === stage ? undefined : stage })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  data.stage === stage
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/40 text-foreground border-border hover:border-primary/50'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currently Raising toggle */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Currently raising?</p>
            <p className="text-xs text-muted-foreground mt-0.5">Show investors you're actively raising</p>
          </div>
          <Switch
            checked={!!data.is_raising}
            onCheckedChange={(checked) => update({ is_raising: checked })}
          />
        </CardContent>
      </Card>

      {/* Amounts */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Capital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount_raised" className="text-xs">Total raised to date</Label>
            <Input
              id="amount_raised"
              placeholder="e.g. $500K, ₹50L"
              value={data.amount_raised || ''}
              onChange={(e) => update({ amount_raised: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="target_raise" className="text-xs">Current round target</Label>
            <Input
              id="target_raise"
              placeholder="e.g. $2M"
              value={data.target_raise || ''}
              onChange={(e) => update({ target_raise: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Investors */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Investors / Backers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.investors || []).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {(data.investors || []).map((inv, i) => (
                <Badge key={i} variant="secondary" className="gap-1.5 pr-1">
                  {inv}
                  <button
                    type="button"
                    onClick={() => removeInvestor(i)}
                    className="hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Investor or backer name"
              value={newInvestor}
              onChange={(e) => setNewInvestor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInvestor())}
            />
            <Button type="button" variant="outline" size="sm" onClick={addInvestor}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Use of funds */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Use of Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="How will you use the capital? e.g. 40% product, 40% sales, 20% ops"
            value={data.use_of_funds || ''}
            onChange={(e) => update({ use_of_funds: e.target.value })}
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(data.use_of_funds || '').length}/500
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
