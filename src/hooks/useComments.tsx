import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function unwrapPaginated<T>(response: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(response) ? response : (response?.results ?? []);
}

export function useComments(pitchId: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['comments', pitchId],
    queryFn: async () => {
      const response = await apiFetch<any[] | PaginatedResponse<any>>(`/feed/${pitchId}/comments/`);
      return unwrapPaginated(response);
    },
    enabled: !!pitchId && enabled,
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