import { useState, useRef, useEffect } from 'react';
import { ImagePlus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CreateProfilePitchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    imageUrl?: string;
    status: 'draft' | 'published';
  }) => void;
  initialData?: {
    title: string;
    description: string;
    imageUrl?: string;
    status: 'draft' | 'published';
  };
  isEditing?: boolean;
}

function PitchForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing,
}: {
  onSubmit: CreateProfilePitchModalProps['onSubmit'];
  onCancel: () => void;
  initialData?: CreateProfilePitchModalProps['initialData'];
  isEditing?: boolean;
}) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [isPublished, setIsPublished] = useState(initialData?.status === 'published');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setImagePreview(initialData.imageUrl || null);
      setIsPublished(initialData.status === 'published');
    }
  }, [initialData]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      imageUrl: imagePreview || undefined,
      status: isPublished ? 'published' : 'draft',
    });
  };

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Pitch Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Give your pitch a clear title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Short Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your idea in 1-2 lines..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] resize-none"
          maxLength={200}
        />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">
            {description.length}/200
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label>Cover Image (optional)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        {imagePreview ? (
          <div className="relative aspect-square w-32 rounded-lg overflow-hidden border border-border">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            Add Cover Image
          </Button>
        )}
      </div>

      {/* Status Toggle */}
      <div className="flex items-center justify-between py-2 border-t border-border">
        <div>
          <Label htmlFor="published" className="text-sm font-medium">
            Publish Immediately
          </Label>
          <p className="text-xs text-muted-foreground">
            {isPublished ? 'Pitch will be visible to others' : 'Save as draft'}
          </p>
        </div>
        <Switch
          id="published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          {isEditing ? 'Save Changes' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}

export function CreateProfilePitchModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: CreateProfilePitchModalProps) {
  const isMobile = useIsMobile();

  const handleSubmit = (data: Parameters<CreateProfilePitchModalProps['onSubmit']>[0]) => {
    onSubmit(data);
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{isEditing ? 'Edit Post' : 'Create Post'}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <PitchForm
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              initialData={initialData}
              isEditing={isEditing}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Post' : 'Create Post'}</DialogTitle>
        </DialogHeader>
        <PitchForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          initialData={initialData}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
}
