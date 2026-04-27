import { useState, useRef, useEffect } from 'react';
import { ImagePlus, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ProfilePitch, PitchStage } from '@/hooks/useProfilePitches';

export interface PitchFormData {
  title: string;
  description: string;
  short_summary: string;
  image_url: string | null;
  problem_statement: string;
  solution_overview: string;
  target_users: string;
  current_stage: PitchStage;
  open_considerations: string;
  looking_for: string[];
  status: 'draft' | 'published';
}

export interface RoleConfig {
  pitchType: string;
  editTitle: string;
  problemLabel: string;
  solutionLabel: string;
  targetLabel: string;
  stageLabel: string;
  lookingForLabel: string;
  considerationsLabel: string;
}

export interface EditPitchFormProps {
  pitch?: ProfilePitch;
  onSubmit: (data: PitchFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  roleConfig?: RoleConfig;
}

const stageOptions: { value: PitchStage; label: string }[] = [
  { value: 'idea', label: 'Idea' },
  { value: 'research', label: 'Research' },
  { value: 'mvp', label: 'MVP' },
  { value: 'early_validation', label: 'Early Validation' },
];

const defaultRoleConfig: RoleConfig = {
  pitchType: 'Idea Pitch',
  editTitle: 'Edit Pitch',
  problemLabel: 'Problem',
  solutionLabel: 'Proposed Solution',
  targetLabel: 'Who Is This For',
  stageLabel: 'Current Stage',
  lookingForLabel: "What I'm Looking For",
  considerationsLabel: 'Open Considerations',
};

export function EditPitchForm({ pitch, onSubmit, onCancel, isSubmitting, roleConfig = defaultRoleConfig }: EditPitchFormProps) {
  const [formData, setFormData] = useState<PitchFormData>({
    title: pitch?.title || '',
    description: pitch?.description || '',
    short_summary: pitch?.short_summary || '',
    image_url: pitch?.image_url || null,
    problem_statement: pitch?.problem_statement || '',
    solution_overview: pitch?.solution_overview || '',
    target_users: pitch?.target_users || '',
    current_stage: pitch?.current_stage || 'idea',
    open_considerations: pitch?.open_considerations || '',
    looking_for: pitch?.looking_for || [],
    status: pitch?.status || 'draft',
  });

  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof PitchFormData>(key: K, value: PitchFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('image_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateField('image_url', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.looking_for.includes(tag)) {
      updateField('looking_for', [...formData.looking_for, tag]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    updateField('looking_for', formData.looking_for.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  const isValid = formData.title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Core Fields */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Core Information
        </h3>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Give your pitch a clear, compelling title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Short Summary */}
        <div className="space-y-2">
          <Label htmlFor="short_summary">Short Summary</Label>
          <Textarea
            id="short_summary"
            placeholder="A brief 1-2 line summary of your idea..."
            value={formData.short_summary}
            onChange={(e) => updateField('short_summary', e.target.value)}
            className="min-h-[60px] resize-none"
            maxLength={200}
          />
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {formData.short_summary.length}/200
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
          {formData.image_url ? (
            <div className="relative aspect-[21/9] w-full max-w-md rounded-lg overflow-hidden border border-border">
              <img
                src={formData.image_url}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
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
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Pitch Details
        </h3>

        {/* Problem Statement */}
        <div className="space-y-2">
          <Label htmlFor="problem_statement">{roleConfig.problemLabel}</Label>
          <Textarea
            id="problem_statement"
            placeholder="What problem are you solving?"
            value={formData.problem_statement}
            onChange={(e) => updateField('problem_statement', e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Solution Overview */}
        <div className="space-y-2">
          <Label htmlFor="solution_overview">{roleConfig.solutionLabel}</Label>
          <Textarea
            id="solution_overview"
            placeholder="How do you plan to solve this problem?"
            value={formData.solution_overview}
            onChange={(e) => updateField('solution_overview', e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Target Users */}
        <div className="space-y-2">
          <Label htmlFor="target_users">{roleConfig.targetLabel}</Label>
          <Textarea
            id="target_users"
            placeholder="Describe your target users or audience..."
            value={formData.target_users}
            onChange={(e) => updateField('target_users', e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Current Stage */}
        <div className="space-y-2">
          <Label>{roleConfig.stageLabel}</Label>
          <Select
            value={formData.current_stage}
            onValueChange={(value) => updateField('current_stage', value as PitchStage)}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Open Considerations */}
        <div className="space-y-2">
          <Label htmlFor="open_considerations">{roleConfig.considerationsLabel}</Label>
          <Textarea
            id="open_considerations"
            placeholder="Any open questions, challenges, or areas you're still exploring..."
            value={formData.open_considerations}
            onChange={(e) => updateField('open_considerations', e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {/* Looking For */}
        <div className="space-y-2">
          <Label>{roleConfig.lookingForLabel}</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Feedback, Mentorship, Validation..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.looking_for.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.looking_for.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Toggle */}
      <div className="flex items-center justify-between py-4 border-t border-border">
        <div>
          <Label htmlFor="published" className="text-sm font-medium">
            Publish Pitch
          </Label>
          <p className="text-xs text-muted-foreground">
            {formData.status === 'published' ? 'Pitch is visible to others' : 'Saved as draft (only you can see)'}
          </p>
        </div>
        <Switch
          id="published"
          checked={formData.status === 'published'}
          onCheckedChange={(checked) => updateField('status', checked ? 'published' : 'draft')}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Saving...' : pitch ? 'Save Changes' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}
