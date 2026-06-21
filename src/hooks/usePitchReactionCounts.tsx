import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';

interface ReactionCounts {
  fire: number;
  bulb?: number;
  clap?: number;
}

export function usePitchReactionCounts(pitchId: string | undefined) {
  return useQuery({
    queryKey: ['pitch-reaction-counts', pitchId],
    queryFn: async (): Promise<ReactionCounts> => {
      if (!pitchId) return { fire: 0 };
      // Backend returns { liked: bool, like_count: number } from /feed/:id/
      // We fetch the post to get the current like_count
      const post = await apiFetch<{ like_count: number; liked_by_me?: boolean; user_has_liked?: boolean }>(
        `/feed/${pitchId}/`
      );
      return { fire: post.like_count ?? 0 };
    },
    enabled: !!pitchId,
    // Don't refetch too aggressively — the pitches query already keeps this fresh
    staleTime: 30_000,
  });
}