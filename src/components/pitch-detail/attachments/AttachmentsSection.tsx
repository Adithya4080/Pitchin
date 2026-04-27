import { useState } from 'react';
import { Plus, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePitchAttachments } from '@/hooks/usePitchAttachments';
import { AttachmentCard } from './AttachmentCard';
import { AttachmentUploadForm } from './AttachmentUploadForm';
import { Skeleton } from '@/components/ui/skeleton';

interface AttachmentsSectionProps {
  pitchId: string;
  isOwner: boolean;
}

export function AttachmentsSection({ pitchId, isOwner }: AttachmentsSectionProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const { data: attachments, isLoading } = usePitchAttachments(pitchId);

  const hasAttachments = attachments && attachments.length > 0;

  // Don't show section for non-owners if there are no attachments
  if (!isOwner && !hasAttachments && !isLoading) {
    return null;
  }

  return (
    <Card className="border-border/50 rounded-none md:rounded-lg border-x-0 md:border-x">
      <CardContent className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            Attachments
          </h2>
          {isOwner && !showUploadForm && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setShowUploadForm(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add File
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mb-4">
            <AttachmentUploadForm
              pitchId={pitchId}
              onSuccess={() => setShowUploadForm(false)}
              onCancel={() => setShowUploadForm(false)}
            />
          </div>
        )}

        {/* Attachments List */}
        {!isLoading && hasAttachments && (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <AttachmentCard
                key={attachment.id}
                attachment={attachment}
                isOwner={isOwner}
                pitchId={pitchId}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasAttachments && !showUploadForm && isOwner && (
          <div className="text-center py-6 border border-dashed border-border rounded-lg">
            <Paperclip className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              Add supporting documents or images
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDFs, images to strengthen your pitch
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setShowUploadForm(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Upload File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
