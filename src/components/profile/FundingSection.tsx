import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Edit2 } from 'lucide-react';

export interface FundingData {
  stage?: string;           // Pre-seed, Seed, Series A, etc.
  amount_raised?: string;   // e.g., "$500K"
  investors?: string[];     // investor names
  target_raise?: string;    // current round target
  use_of_funds?: string;    // description
  is_raising?: boolean;     // currently raising?
}

interface FundingSectionProps {
  funding?: FundingData | null;
  isOwner?: boolean;
  isMobile?: boolean;
}

export function FundingSection({ funding, isOwner = false, isMobile = false }: FundingSectionProps) {
  const navigate = useNavigate();
  const isEmpty = !funding || (!funding.stage && !funding.amount_raised && !funding.is_raising);

  if (isEmpty && !isOwner) return null;

  if (isEmpty && isOwner) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Funding</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Capital raised & investors. Trust investors, add credibility, and show your progress.
          </p>
          <Button
            size="sm"
            onClick={() => navigate('/edit-section?section=funding')}
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add funding
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Funding
          {funding?.is_raising && (
            <Badge variant="secondary" className="text-xs ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Raising
            </Badge>
          )}
        </CardTitle>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/edit-section?section=funding')}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {funding?.stage && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-28">Stage</span>
            <Badge variant="outline" className="text-xs">{funding.stage}</Badge>
          </div>
        )}
        {funding?.amount_raised && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-28">Raised</span>
            <span className="text-sm font-semibold text-foreground">{funding.amount_raised}</span>
          </div>
        )}
        {funding?.target_raise && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-28">Target raise</span>
            <span className="text-sm font-semibold text-foreground">{funding.target_raise}</span>
          </div>
        )}
        {funding?.investors && funding.investors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {funding.investors.map((inv, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{inv}</Badge>
            ))}
          </div>
        )}
        {funding?.use_of_funds && (
          <p className="text-xs text-muted-foreground leading-relaxed">{funding.use_of_funds}</p>
        )}
      </CardContent>
    </Card>
  );
}
