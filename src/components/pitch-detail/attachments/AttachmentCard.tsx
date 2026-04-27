import { useState } from 'react';
import { FileText, Image as ImageIcon, Pencil, Trash2, ExternalLink, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { type PitchAttachment, formatFileSize, useUpdateAttachment, useDeleteAttachment } from '@/hooks/usePitchAttachments';

interface AttachmentCardProps {
  attachment: PitchAttachment;
  isOwner: boolean;
  pitchId: string;
}

export function AttachmentCard({ attachment, isOwner, pitchId }: AttachmentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(attachment.title);
  const [editDescription, setEditDescription] = useState(attachment.description || '');
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  const updateMutation = useUpdateAttachment();
  const deleteMutation = useDeleteAttachment();

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    await updateMutation.mutateAsync({
      id: attachment.id,
      pitchId,
      title: editTitle,
      description: editDescription,
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(attachment.title);
    setEditDescription(attachment.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({
      id: attachment.id,
      pitchId,
      fileUrl: attachment.file_url,
    });
  };

  const handleViewFile = () => {
    if (attachment.file_type === 'image') {
      setImagePreviewOpen(true);
    } else {
      window.open(attachment.file_url, '_blank');
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-3">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Title"
          maxLength={100}
        />
        <Textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Description (optional)"
          className="min-h-[60px] resize-none"
          maxLength={200}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSaveEdit}
            disabled={!editTitle.trim() || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50",
          "hover:border-border hover:bg-card transition-colors"
        )}
      >
        {/* Thumbnail / Icon */}
        <div
          className={cn(
            "w-14 h-14 rounded-lg shrink-0 overflow-hidden bg-muted flex items-center justify-center",
            attachment.file_type === 'image' && "cursor-pointer"
          )}
          onClick={attachment.file_type === 'image' ? handleViewFile : undefined}
        >
          {attachment.file_type === 'image' ? (
            <img
              src={attachment.file_url}
              alt={attachment.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileText className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground line-clamp-1">
            {attachment.title}
          </h4>
          {attachment.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {attachment.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground capitalize">
              {attachment.file_type}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(attachment.file_size)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleViewFile}
            title={attachment.file_type === 'image' ? 'View image' : 'Open PDF'}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>

          {isOwner && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{attachment.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{attachment.title}</DialogTitle>
          <img
            src={attachment.file_url}
            alt={attachment.title}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
