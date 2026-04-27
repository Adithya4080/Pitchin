import { useState } from 'react';
import { Plus, Trash2, GripVertical, Image, ExternalLink, Tag, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { ProgramEntry } from './types';

interface ProgramsEditSectionProps {
  programs: ProgramEntry[];
  onChange: (programs: ProgramEntry[]) => void;
  userId?: string;
  isMobile?: boolean;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

const defaultProgram: ProgramEntry = {
  title: '',
  description: '',
  image_url: '',
  status: 'active',
  external_link: '',
  tags: [],
};

export function ProgramsEditSection({
  programs,
  onChange,
  userId,
  isMobile = false,
}: ProgramsEditSectionProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [newTag, setNewTag] = useState<{ [key: number]: string }>({});

  const handleAddProgram = () => {
    onChange([...programs, { ...defaultProgram }]);
  };

  const handleRemoveProgram = (index: number) => {
    const updated = programs.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateProgram = (index: number, field: keyof ProgramEntry, value: any) => {
    const updated = programs.map((program, i) =>
      i === index ? { ...program, [field]: value } : program
    );
    onChange(updated);
  };

  const handleAddTag = (index: number) => {
    const tag = newTag[index]?.trim();
    if (!tag) return;
    
    const currentTags = programs[index].tags || [];
    if (currentTags.includes(tag)) {
      toast.error('Tag already exists');
      return;
    }
    
    handleUpdateProgram(index, 'tags', [...currentTags, tag]);
    setNewTag({ ...newTag, [index]: '' });
  };

  const handleRemoveTag = (programIndex: number, tagIndex: number) => {
    const currentTags = programs[programIndex].tags || [];
    const updated = currentTags.filter((_, i) => i !== tagIndex);
    handleUpdateProgram(programIndex, 'tags', updated);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingIndex(index);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/programs/${Date.now()}-${index}.${fileExt}`;

      // File upload: store as base64 until backend storage is configured
      const publicUrl = URL.createObjectURL(file)
        // .from('profile-banners')
        // .getPublicUrl(filePath);

      handleUpdateProgram(index, 'image_url', publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Programs & Initiatives</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add accelerators, bootcamps, fellowships, or events you run.
          </p>
        </div>
        <Button onClick={handleAddProgram} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Program
        </Button>
      </div>

      {/* Programs List */}
      {programs.length === 0 ? (
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No programs added yet</p>
            <Button onClick={handleAddProgram} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Your First Program
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {programs.map((program, index) => (
            <Card key={index} className="border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start gap-3 p-4 bg-muted/30 border-b border-border/30">
                  <div className="flex items-center text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">
                      Program {index + 1}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProgram(index)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Image className="h-3.5 w-3.5" />
                      Program Image
                    </Label>
                    <div className="flex items-start gap-4">
                      {program.image_url ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-border/50">
                          <img
                            src={program.image_url}
                            alt={program.title || 'Program'}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleUpdateProgram(index, 'image_url', '')}
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-32 h-20 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                            disabled={uploadingIndex === index}
                          />
                          {uploadingIndex === index ? (
                            <div className="animate-pulse text-xs text-muted-foreground">
                              Uploading...
                            </div>
                          ) : (
                            <>
                              <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                              <span className="text-xs text-muted-foreground">Upload</span>
                            </>
                          )}
                        </label>
                      )}
                      <p className="text-xs text-muted-foreground flex-1">
                        Recommended: 16:9 aspect ratio (1920x1080). Max 5MB.
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`}>Program Name *</Label>
                    <Input
                      id={`title-${index}`}
                      value={program.title}
                      onChange={(e) => handleUpdateProgram(index, 'title', e.target.value)}
                      placeholder="e.g., Startup Accelerator Batch 2024"
                      maxLength={100}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor={`desc-${index}`}>Description *</Label>
                    <Textarea
                      id={`desc-${index}`}
                      value={program.description}
                      onChange={(e) => handleUpdateProgram(index, 'description', e.target.value)}
                      placeholder="Brief description of the program..."
                      rows={3}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {program.description.length}/500
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={program.status}
                      onValueChange={(value) => handleUpdateProgram(index, 'status', value)}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* External Link */}
                  <div className="space-y-2">
                    <Label htmlFor={`link-${index}`} className="flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      External Link
                    </Label>
                    <Input
                      id={`link-${index}`}
                      type="url"
                      value={program.external_link || ''}
                      onChange={(e) => handleUpdateProgram(index, 'external_link', e.target.value)}
                      placeholder="https://example.com/program"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5" />
                      Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(program.tags || []).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index, tagIndex)}
                            className="ml-1.5 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag[index] || ''}
                        onChange={(e) => setNewTag({ ...newTag, [index]: e.target.value })}
                        placeholder="Add tag (e.g., Accelerator)"
                        className="flex-1"
                        maxLength={30}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(index);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTag(index)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {programs.length > 0 && (
        <Button
          onClick={handleAddProgram}
          variant="outline"
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Another Program
        </Button>
      )}
    </div>
  );
}
