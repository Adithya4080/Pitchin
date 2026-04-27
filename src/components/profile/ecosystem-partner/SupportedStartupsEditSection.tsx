import { useState } from 'react';
import { Plus, Trash2, Building2, GripVertical, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import type { SupportedStartupEntry } from './types';

interface SupportedStartupsEditSectionProps {
  startups: SupportedStartupEntry[];
  onChange: (startups: SupportedStartupEntry[]) => void;
  userId?: string;
  isMobile?: boolean;
}

const STAGE_OPTIONS = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Growth',
  'Public',
  'Acquired',
];

export function SupportedStartupsEditSection({
  startups,
  onChange,
  userId,
  isMobile = false,
}: SupportedStartupsEditSectionProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleAddStartup = () => {
    const newStartup: SupportedStartupEntry = {
      name: '',
      logo_url: '',
      stage: '',
      description: '',
      linkedin_url: '',
      website_url: '',
    };
    onChange([...startups, newStartup]);
  };

  const handleRemoveStartup = (index: number) => {
    const updated = startups.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateStartup = (index: number, field: keyof SupportedStartupEntry, value: string) => {
    const updated = startups.map((startup, i) => {
      if (i === index) {
        return { ...startup, [field]: value };
      }
      return startup;
    });
    onChange(updated);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!userId) {
      toast.error('You must be logged in to upload images');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploadingIndex(index);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/supported-startups/${Date.now()}-${index}.${fileExt}`;

      // File upload: store as base64 until backend storage is configured
      const publicUrl = URL.createObjectURL(file)

      handleUpdateStartup(index, 'logo_url', publicUrl);
      toast.success('Logo uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveLogo = (index: number) => {
    handleUpdateStartup(index, 'logo_url', '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Backed / Supported Startups</h3>
          <p className="text-sm text-muted-foreground">
            Showcase startups and companies you've supported or invested in.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddStartup}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Startup
        </Button>
      </div>

      {startups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Building2 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No startups added yet. Click "Add Startup" to showcase companies you've supported.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {startups.map((startup, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="pt-2 cursor-grab text-muted-foreground/50">
                    <GripVertical className="h-4 w-4" />
                  </div>

                  {/* Logo Upload */}
                  <div className="shrink-0">
                    <div className="relative">
                      <Avatar className="h-14 w-14 rounded-lg border border-border/50">
                        {startup.logo_url ? (
                          <AvatarImage src={startup.logo_url} className="object-cover" />
                        ) : (
                          <AvatarFallback className="rounded-lg bg-muted">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      
                      {startup.logo_url ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveLogo(index)}
                          className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-sm"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      ) : (
                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
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
                          <Upload className="h-4 w-4 text-white" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Row 1: Name & Stage */}
                    <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      <div>
                        <Label className="text-xs text-muted-foreground">Company Name *</Label>
                        <Input
                          value={startup.name}
                          onChange={(e) => handleUpdateStartup(index, 'name', e.target.value)}
                          placeholder="e.g., Stripe"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Stage</Label>
                        <select
                          value={startup.stage || ''}
                          onChange={(e) => handleUpdateStartup(index, 'stage', e.target.value)}
                          className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select stage...</option>
                          {STAGE_OPTIONS.map((stage) => (
                            <option key={stage} value={stage}>{stage}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Description */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Short Description</Label>
                      <Textarea
                        value={startup.description || ''}
                        onChange={(e) => handleUpdateStartup(index, 'description', e.target.value)}
                        placeholder="Brief description of what the startup does..."
                        className="mt-1 resize-none"
                        rows={2}
                        maxLength={150}
                      />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {(startup.description || '').length}/150
                      </p>
                    </div>

                    {/* Row 3: Links */}
                    <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      <div>
                        <Label className="text-xs text-muted-foreground">LinkedIn URL</Label>
                        <Input
                          value={startup.linkedin_url || ''}
                          onChange={(e) => handleUpdateStartup(index, 'linkedin_url', e.target.value)}
                          placeholder="https://linkedin.com/company/..."
                          className="mt-1"
                          type="url"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Website URL</Label>
                        <Input
                          value={startup.website_url || ''}
                          onChange={(e) => handleUpdateStartup(index, 'website_url', e.target.value)}
                          placeholder="https://example.com"
                          className="mt-1"
                          type="url"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStartup(index)}
                    className="shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
