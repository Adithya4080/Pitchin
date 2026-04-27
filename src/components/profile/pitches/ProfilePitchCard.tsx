import { useNavigate } from 'react-router-dom';
import { FileText, Pencil, Trash2 } from 'lucide-react';
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

interface ProfilePitchCardProps {
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

export function ProfilePitchCard({
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
}: ProfilePitchCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Updated today';
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    return `Updated ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(viewUrl || `/pitch/${id}`);
  };

  return (
    <div className="flex items-center gap-4 py-5 border-t border-border/50 first:border-t-0">
      {/* Left: Square Image */}
      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/30">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Middle: Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground text-base line-clamp-1 mb-1">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
          {description}
        </p>
        
        {/* Status and date */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full border",
              status === 'published'
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(updatedAt)}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-4 text-sm font-medium"
          onClick={handleViewClick}
        >
          View Pitch
        </Button>
        
        {isOwner && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
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
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
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
        )}
      </div>
    </div>
  );
}
