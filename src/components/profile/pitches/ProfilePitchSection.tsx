import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfilePitchCard } from './ProfilePitchCard';
import { CreateProfilePitchModal } from './CreateProfilePitchModal';

export interface ProfilePitch {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ProfilePitchSectionProps {
  pitches: ProfilePitch[];
  isOwner?: boolean;
  isMobile?: boolean;
  onCreatePitch?: (pitch: Omit<ProfilePitch, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  onEditPitch?: (id: string, pitch: Partial<ProfilePitch>) => void;
  onDeletePitch?: (id: string) => void;
  roleLabel?: string;
  pitchViewUrlBuilder?: (pitchId: string) => string;
}

export function ProfilePitchSection({
  pitches,
  isOwner = false,
  isMobile = false,
  onCreatePitch,
  onEditPitch,
  onDeletePitch,
  roleLabel = 'Pitches',
  pitchViewUrlBuilder,
}: ProfilePitchSectionProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPitch, setEditingPitch] = useState<ProfilePitch | null>(null);

  const handleCreate = (data: { title: string; description: string; imageUrl?: string; status: 'draft' | 'published' }) => {
    onCreatePitch?.({
      title: data.title,
      description: data.description,
      image_url: data.imageUrl,
      status: data.status,
    });
    setShowCreateModal(false);
  };

  const handleEdit = (data: { title: string; description: string; imageUrl?: string; status: 'draft' | 'published' }) => {
    if (editingPitch) {
      onEditPitch?.(editingPitch.id, {
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        status: data.status,
      });
      setEditingPitch(null);
    }
  };

  const handleDelete = (id: string) => {
    onDeletePitch?.(id);
  };

  const publishedPitches = pitches.filter(p => p.status === 'published');
  const visiblePitches = isOwner ? pitches : publishedPitches;

  // Non-owner with no published pitches: hide entirely
  if (!isOwner && visiblePitches.length === 0) {
    return null;
  }

  return (
    <>
      {visiblePitches.length > 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {roleLabel}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ideas and opportunities shared from this profile.
                </p>
              </div>
              {isOwner && (
                <Button
                  size="sm"
                  className="gap-1.5 bg-primary hover:bg-primary/90"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  New Pitch
                </Button>
              )}
            </div>
            <div className="mt-4">
              {visiblePitches.map((pitch) => (
                <ProfilePitchCard
                  key={pitch.id}
                  id={pitch.id}
                  title={pitch.title}
                  description={pitch.description}
                  imageUrl={pitch.image_url}
                  status={pitch.status}
                  updatedAt={pitch.updated_at}
                  isOwner={isOwner}
                  onEdit={() => setEditingPitch(pitch)}
                  onDelete={() => handleDelete(pitch.id)}
                  viewUrl={pitchViewUrlBuilder ? pitchViewUrlBuilder(pitch.id) : undefined}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Owner empty state - matches ProfileSectionWrapper dashed placeholder */
        <Card className="border-2 border-dashed border-border/50 bg-muted/5">
          <CardContent className="py-8 text-center">
            <h3 className="text-sm font-bold text-foreground mb-1.5">
              {roleLabel}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Create your first pitch to present an idea or opportunity.
            </p>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Pitch
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Modal */}
      <CreateProfilePitchModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleCreate}
      />

      {/* Edit Modal */}
      <CreateProfilePitchModal
        open={!!editingPitch}
        onOpenChange={(open) => !open && setEditingPitch(null)}
        onSubmit={handleEdit}
        initialData={editingPitch ? {
          title: editingPitch.title,
          description: editingPitch.description,
          imageUrl: editingPitch.image_url || undefined,
          status: editingPitch.status,
        } : undefined}
        isEditing
      />
    </>
  );
}
