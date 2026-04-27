import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PitchDetailSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export function PitchDetailSection({ title, icon: Icon, children }: PitchDetailSectionProps) {
  return (
    <Card className="border-border/50 rounded-none md:rounded-lg border-x-0 md:border-x">
      <CardContent className="p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {title}
        </h2>
        <div className="text-foreground/80 leading-relaxed text-sm">{children}</div>
      </CardContent>
    </Card>
  );
}
