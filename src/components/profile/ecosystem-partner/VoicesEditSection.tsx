import { useState, useRef } from 'react';
import { Plus, Trash2, X, Upload, Linkedin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from 'sonner';
import type { VoiceEntry } from './types';

const MAX_VOICES = 6;

interface VoicesEditSectionProps {
  voices: VoiceEntry[];
  onChange: (voices: VoiceEntry[]) => void;
  userId?: string;
  isMobile?: boolean;
}

export function VoicesEditSection({ voices, onChange, userId, isMobile = false }: VoicesEditSectionProps) {
  const [localVoices, setLocalVoices] = useState<VoiceEntry[]>(voices || []);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateAndSync = (updated: VoiceEntry[]) => {
    setLocalVoices(updated);
    onChange(updated);
  };

  const addVoice = () => {
    if (localVoices.length >= MAX_VOICES) {
      toast.error(`Maximum ${MAX_VOICES} voices allowed`);
      return;
    }
    updateAndSync([
      ...localVoices,
      { 
        name: '', 
        role: '', 
        credibility_description: '',
        portrait_url: '',
        quote: '',
        linkedin_url: '',
        website_url: ''
      },
    ]);
  };

  const removeVoice = (index: number) => {
    updateAndSync(localVoices.filter((_, i) => i !== index));
  };

  const updateVoice = (index: number, field: keyof VoiceEntry, value: string) => {
    const updated = [...localVoices];
    updated[index] = { ...updated[index], [field]: value };
    updateAndSync(updated);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setIsUploading(index);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/voices/${Date.now()}-${index}.${fileExt}`;

      // File upload: store as base64 until backend storage is configured
      const publicUrl = URL.createObjectURL(file)

      updateVoice(index, 'portrait_url', publicUrl);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(null);
    }
  };

  const removeImage = (index: number) => {
    updateVoice(index, 'portrait_url', '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Voices</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Showcase leadership and key partner perspectives ({localVoices.length}/{MAX_VOICES})
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addVoice}
          disabled={localVoices.length >= MAX_VOICES}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Voice
        </Button>
      </div>

      {localVoices.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-8 text-center text-muted-foreground">
            <p className="text-sm">No voices added yet.</p>
            <p className="text-xs mt-1">Add leadership or partner perspectives to build credibility.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {localVoices.map((voice, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Voice {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVoice(index)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-[140px_1fr] gap-4'}`}>
                  {/* Portrait Upload */}
                  <div className="space-y-2">
                    <Label className="text-xs">Portrait (4:5)</Label>
                    <div className="relative">
                      <AspectRatio ratio={4/5} className="bg-muted rounded-lg overflow-hidden border border-border/50">
                        {voice.portrait_url ? (
                          <div className="relative w-full h-full group">
                            <img
                              src={voice.portrait_url}
                              alt={voice.name || 'Portrait'}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                            onClick={() => fileInputRefs.current[index]?.click()}
                          >
                            {isUploading === index ? (
                              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">Upload</span>
                              </>
                            )}
                          </div>
                        )}
                      </AspectRatio>
                      <input
                        ref={(el) => { fileInputRefs.current[index] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(index, file);
                        }}
                      />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name *</Label>
                        <Input
                          value={voice.name || ''}
                          onChange={(e) => updateVoice(index, 'name', e.target.value)}
                          placeholder="Full name"
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Role / Title *</Label>
                        <Input
                          value={voice.role || ''}
                          onChange={(e) => updateVoice(index, 'role', e.target.value)}
                          placeholder="e.g. Managing Partner"
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Credibility Description * (max 2 lines)</Label>
                      <Textarea
                        value={voice.credibility_description || ''}
                        onChange={(e) => {
                          if (e.target.value.length <= 120) {
                            updateVoice(index, 'credibility_description', e.target.value);
                          }
                        }}
                        placeholder="Brief background or achievement..."
                        className="min-h-[60px] resize-none"
                        maxLength={120}
                      />
                      <span className="text-xs text-muted-foreground">
                        {(voice.credibility_description?.length || 0)}/120
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Quote (optional, 1-2 lines)</Label>
                      <Textarea
                        value={voice.quote || ''}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) {
                            updateVoice(index, 'quote', e.target.value);
                          }
                        }}
                        placeholder="A short perspective or quote..."
                        className="min-h-[50px] resize-none"
                        maxLength={100}
                      />
                      <span className="text-xs text-muted-foreground">
                        {(voice.quote?.length || 0)}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1">
                          <Linkedin className="h-3 w-3" /> LinkedIn (optional)
                        </Label>
                        <Input
                          value={voice.linkedin_url || ''}
                          onChange={(e) => updateVoice(index, 'linkedin_url', e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Website (optional)
                        </Label>
                        <Input
                          value={voice.website_url || ''}
                          onChange={(e) => updateVoice(index, 'website_url', e.target.value)}
                          placeholder="https://..."
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
