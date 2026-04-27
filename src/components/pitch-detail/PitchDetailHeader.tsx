import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PitchDetailHeaderProps {
  title: string;
  shortSummary?: string | null;
  coverImage?: string | null;
  status: 'draft' | 'published';
  updatedAt: string;
  isOwner: boolean;
  onEdit?: () => void;
  pitchType?: string;
}

export function PitchDetailHeader({
  title,
  shortSummary,
  coverImage,
  status,
  updatedAt,
  isOwner,
  onEdit,
  pitchType = 'Idea Pitch',
}: PitchDetailHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden border-border/50 rounded-none md:rounded-lg border-x-0 md:border-x">
      {/* Cover Image - LinkedIn style banner */}
      {coverImage && (
        <div className="h-36 sm:h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* If no cover image, show a gradient banner like profile */}
      {!coverImage && (
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/10" />
      )}

      <CardContent className="pt-0 pb-6 px-6">
        {/* Meta line with edit button */}
        <div className="flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{pitchType}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Updated {formatDate(updatedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                status === 'published'
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {status === 'published' ? 'Published' : 'Draft'}
            </Badge>

            {isOwner && onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit} 
                className="shrink-0 gap-1.5 bg-card text-foreground border-foreground/20 hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-4">
          {title}
        </h1>

        {/* Short Summary */}
        {shortSummary && (
          <p className="text-base text-muted-foreground leading-relaxed mt-3">
            {shortSummary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
