import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileProfilePitchCard } from './MobileProfilePitchCard';
import { CreateProfilePitchModal } from './CreateProfilePitchModal';
import { UserRole } from '@/hooks/useUserRole';

interface ProfilePitch {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  status: string;
  updated_at: string;
}

interface MobileProfilePitchSectionProps {
  pitches: ProfilePitch[];
  isEditable?: boolean;
  role?: UserRole | null;
  onCreatePitch?: (data: { title: string; description: string; imageUrl?: string; status: 'draft' | 'published' }) => void;
  onUpdatePitch?: (id: string, data: { title: string; description: string; imageUrl?: string; status: 'draft' | 'published' }) => void;
  onDeletePitch?: (id: string) => void;
  isCreating?: boolean;
  isUpdating?: boolean;
  pitchViewUrlBuilder?: (pitchId: string) => string;
}

export function MobileProfilePitchSection({
  pitches,
  isEditable = false,
  role,
  onCreatePitch,
  onUpdatePitch,
  onDeletePitch,
  isCreating,
  isUpdating,
  pitchViewUrlBuilder,
}: MobileProfilePitchSectionProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPitch, setEditingPitch] = useState<ProfilePitch | null>(null);

  const sectionTitle = role === 'startup' ? 'Product' : 'Pitches';

  // Filter pitches based on owner view
  const visiblePitches = isEditable
    ? pitches
    : pitches.filter((p) => p.status === 'published');

  const handleCreateSubmit = (data: { title: string; description: string; imageUrl?: string; status: 'draft' | 'published' }) => {
    onCreatePitch?.(data);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (data: { title: string; description: string; imageUrl?: string; status: 'draft' | 'published' }) => {
    if (editingPitch) {
      onUpdatePitch?.(editingPitch.id, data);
      setEditingPitch(null);
    }
  };

  // Non-owner with no published pitches: hide entirely
  if (!isEditable && visiblePitches.length === 0) {
    return null;
  }

  return (
    <div>
      {visiblePitches.length > 0 ? (
        <>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-foreground">
              {sectionTitle}
            </h3>
            {isEditable && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-primary hover:text-primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            )}
          </div>
          <div>
            {visiblePitches.map((pitch) => (
              <MobileProfilePitchCard
                key={pitch.id}
                id={pitch.id}
                title={pitch.title}
                description={pitch.description}
                imageUrl={pitch.image_url}
                status={pitch.status as 'draft' | 'published'}
                updatedAt={pitch.updated_at}
                isOwner={isEditable}
                onEdit={() => setEditingPitch(pitch)}
                onDelete={() => onDeletePitch?.(pitch.id)}
                viewUrl={pitchViewUrlBuilder ? pitchViewUrlBuilder(pitch.id) : undefined}
              />
            ))}
          </div>
        </>
      ) : (
        /* Owner empty state - matches ProfileSectionWrapper dashed placeholder */
        <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
          <h3 className="text-sm font-bold text-foreground mb-1.5">
            {sectionTitle}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Create your first pitch to present an idea or opportunity.
          </p>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Create First {role === 'startup' ? 'Product' : 'Pitch'}
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <CreateProfilePitchModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Modal */}
      <CreateProfilePitchModal
        open={!!editingPitch}
        onOpenChange={(open) => !open && setEditingPitch(null)}
        onSubmit={handleEditSubmit}
        initialData={editingPitch ? {
          title: editingPitch.title,
          description: editingPitch.description,
          imageUrl: editingPitch.image_url || undefined,
          status: editingPitch.status as 'draft' | 'published',
        } : undefined}
        isEditing={!!editingPitch}
      />
    </div>
  );
}
