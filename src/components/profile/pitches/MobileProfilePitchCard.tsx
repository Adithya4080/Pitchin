import { useNavigate } from 'react-router-dom';
import { FileText, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface MobileProfilePitchCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  status: 'draft' | 'published';
  updatedAt: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  viewUrl?: string;
}

export function MobileProfilePitchCard({
  id,
  title,
  description,
  imageUrl,
  status,
  updatedAt,
  isOwner = false,
  onEdit,
  onDelete,
  viewUrl,
}: MobileProfilePitchCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCardClick = () => {
    navigate(viewUrl || `/pitch/${id}`);
  };

  return (
    <div 
      className="flex items-center gap-3 py-3 border-t border-border/30 first:border-t-0 active:bg-muted/50 transition-colors"
      onClick={handleCardClick}
    >
      {/* Left: Square Image */}
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <FileText className="h-6 w-6 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-sm line-clamp-1 mb-0.5">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
          {description}
        </p>
        
        {/* Status and date */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full",
              status === 'published'
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatDate(updatedAt)}
          </span>
        </div>
      </div>

      {/* Right: Actions or Arrow */}
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
        {isOwner ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this post? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
        )}
      </div>
    </div>
  );
}
