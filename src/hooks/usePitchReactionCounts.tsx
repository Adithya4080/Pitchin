import { useQuery } from '@tanstack/react-query';

export function usePitchReactionCounts(pitchId: string | undefined) {
  return useQuery({
    queryKey: ['pitch-reaction-counts', pitchId],
    queryFn: async () => ({ fire: 0, bulb: 0, clap: 0 }),
    enabled: !!pitchId,
  });
}
