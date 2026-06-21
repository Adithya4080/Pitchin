import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';

export function useComments(pitchId: string | number) {
  return useQuery({
    queryKey: ['comments', pitchId],
    queryFn: () => apiFetch<any[]>(`/feed/${pitchId}/comments/`),
    enabled: !!pitchId,
  });
}

export function useAddComment(pitchId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      apiFetch(`/feed/${pitchId}/comments/`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', pitchId] });
      qc.invalidateQueries({ queryKey: ['pitches'] }); // refresh comment_count
    },
  });
}