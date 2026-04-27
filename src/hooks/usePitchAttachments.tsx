// import { useQuery } from '@tanstack/react-query';

// export function usePitchAttachments(pitchId?: string) {
//   return useQuery({
//     queryKey: ['pitch-attachments', pitchId],
//     queryFn: async () => [],
//     enabled: !!pitchId,
//   });
// }


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface PitchAttachment {
  id: number;
  pitch: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: 'image' | 'pdf' | 'document';
  file_size: number;
  created_at: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function usePitchAttachments(pitchId?: string) {
  return useQuery({
    queryKey: ['pitch-attachments', pitchId],
    queryFn: async (): Promise<PitchAttachment[]> => [],
    enabled: !!pitchId,
  });
}

export function useUpdateAttachment() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, pitchId, title, description }: {
      id: number;
      pitchId: string;
      title: string;
      description: string;
    }) => {
      // TODO: connect to backend
      return { id, pitchId, title, description };
    },
    onSuccess: (_, { pitchId }) => {
      qc.invalidateQueries({ queryKey: ['pitch-attachments', pitchId] });
      toast({ title: 'Attachment updated' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}

export function useDeleteAttachment() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, pitchId, fileUrl }: {
      id: number;
      pitchId: string;
      fileUrl: string;
    }) => {
      // TODO: connect to backend
      return { id, pitchId };
    },
    onSuccess: (_, { pitchId }) => {
      qc.invalidateQueries({ queryKey: ['pitch-attachments', pitchId] });
      toast({ title: 'Attachment deleted' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}

export function validateFile(file: File): { valid: boolean; error?: string; fileType?: 'image' | 'pdf' } {
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const pdfTypes = ['application/pdf'];

  if (imageTypes.includes(file.type)) {
    if (file.size > 5 * 1024 * 1024) return { valid: false, error: 'Image must be under 5MB' };
    return { valid: true, fileType: 'image' };
  }

  if (pdfTypes.includes(file.type)) {
    if (file.size > 10 * 1024 * 1024) return { valid: false, error: 'PDF must be under 10MB' };
    return { valid: true, fileType: 'pdf' };
  }

  return { valid: false, error: 'Only JPG, PNG, WebP, or PDF files are allowed' };
}

export function useUploadAttachment() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ pitchId, file, title, description }: {
      pitchId: string;
      file: File;
      title: string;
      description?: string;
    }) => {
      // TODO: connect to backend storage
      return { pitchId, title };
    },
    onSuccess: (_, { pitchId }) => {
      qc.invalidateQueries({ queryKey: ['pitch-attachments', pitchId] });
      toast({ title: 'File uploaded successfully' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}