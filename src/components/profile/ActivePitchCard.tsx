import { Zap, Clock, Flame, Save, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/CountdownTimer';

interface ActivePitchCardProps {
  pitch: {
    id: string;
    pitch_statement: string;
    supporting_line?: string | null;
    image_url?: string | null;
    category?: string | null;
    expires_at: string;
    reaction_count: number;
    save_count: number;
  };
  isEditable?: boolean;
  isDeleting?: boolean;
  onDelete?: () => void;
}

export function ActivePitchCard({ pitch, isEditable = false, isDeleting = false, onDelete }: ActivePitchCardProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {isEditable ? 'Your Active Pitch' : 'Active Pitch'}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5">
              <Clock className="h-4 w-4" />
              <CountdownTimer expiresAt={pitch.expires_at} />
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-sm py-1 px-3">
            {pitch.category || 'other'}
          </Badge>
        </div>

        <p className="font-medium text-lg text-foreground mb-3">{pitch.pitch_statement}</p>
        {pitch.supporting_line && (
          <p className="text-base text-muted-foreground mb-4">{pitch.supporting_line}</p>
        )}
        {pitch.image_url && (
          <img 
            src={pitch.image_url} 
            alt="Pitch image" 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-5 text-base text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Flame className="h-5 w-5" />
              {pitch.reaction_count}
            </span>
            <span className="flex items-center gap-1.5">
              <Save className="h-5 w-5" />
              {pitch.save_count}
            </span>
          </div>
          {isEditable && onDelete && (
            <Button
              variant="ghost"
              size="default"
              onClick={onDelete}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isDeleting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-1.5" />
                  Remove
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
