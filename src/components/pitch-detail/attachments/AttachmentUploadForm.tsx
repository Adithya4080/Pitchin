import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useUploadAttachment, validateFile } from '@/hooks/usePitchAttachments';
import { cn } from '@/lib/utils';

interface AttachmentUploadFormProps {
  pitchId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AttachmentUploadForm({ pitchId, onSuccess, onCancel }: AttachmentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadAttachment();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setFileType(validation.fileType!);

    // Set default title from filename (without extension)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    setTitle(nameWithoutExt);

    // Create preview for images
    if (validation.fileType === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setTitle('');
    setDescription('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return;

    await uploadMutation.mutateAsync({
      pitchId,
      file: selectedFile,
      title: title.trim(),
      description: description.trim() || undefined,
    });

    handleClearFile();
    onSuccess?.();
  };

  const isValid = selectedFile && title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer",
            "hover:border-primary/50 hover:bg-muted/50 transition-colors"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">Click to upload a file</p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WebP (max 5MB) or PDF (max 10MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Preview */}
          <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
            {fileType === 'image' && filePreview ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg shrink-0 bg-muted flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {fileType === 'image' ? 'Image' : 'PDF'} • {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              onClick={handleClearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="attachment-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="attachment-title"
              placeholder="Give this file a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="attachment-description">Description (optional)</Label>
            <Textarea
              id="attachment-description"
              placeholder="Brief description of what this file contains..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px] resize-none"
              maxLength={200}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!isValid || uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
      </div>
    </form>
  );
}
