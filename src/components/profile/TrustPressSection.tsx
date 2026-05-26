import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Plus, Edit2, ExternalLink } from 'lucide-react';

export interface TrustProofEntry {
  type: 'press' | 'award' | 'customer_logo' | 'certification' | 'testimonial';
  title: string;
  source?: string;       // e.g., "TechCrunch", "Forbes"
  url?: string;
  description?: string;
  date?: string;
}

export interface TrustPressData {
  proofs?: TrustProofEntry[];
}

interface TrustPressSectionProps {
  trustPress?: TrustPressData | null;
  isOwner?: boolean;
  isMobile?: boolean;
}

const typeLabels: Record<TrustProofEntry['type'], string> = {
  press: 'Press',
  award: 'Award',
  customer_logo: 'Customer',
  certification: 'Certification',
  testimonial: 'Testimonial',
};

const typeBadgeClass: Record<TrustProofEntry['type'], string> = {
  press: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  award: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  customer_logo: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  certification: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  testimonial: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
};

export function TrustPressSection({ trustPress, isOwner = false, isMobile = false }: TrustPressSectionProps) {
  const navigate = useNavigate();
  const isEmpty = !trustPress || !trustPress.proofs || trustPress.proofs.length === 0;

  if (isEmpty && !isOwner) return null;

  if (isEmpty && isOwner) {
    return (
      <Card className="border-2 border-dashed border-border/50 bg-muted/5">
        <CardContent className="py-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Trust & Press</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Customers, partners, and coverage. A single logo used is the biggest credibility multiplier on a profile.
          </p>
          <Button
            size="sm"
            onClick={() => navigate('/edit-section?section=trust')}
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add proof
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3 flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Trust & Press
        </CardTitle>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/edit-section?section=trust')}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {trustPress?.proofs?.map((proof, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className={`text-xs ${typeBadgeClass[proof.type]}`}>
                  {typeLabels[proof.type]}
                </Badge>
                {proof.source && (
                  <span className="text-xs text-muted-foreground">{proof.source}</span>
                )}
                {proof.date && (
                  <span className="text-xs text-muted-foreground">{proof.date}</span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground">{proof.title}</p>
              {proof.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{proof.description}</p>
              )}
            </div>
            {proof.url && (
              <a
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
