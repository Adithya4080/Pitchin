import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export function useUserReactionStats(userId ?: number | string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-reaction-stats', user?.id],
    queryFn: async () => ({ total_reactions: 0, fire: 0, bulb: 0, clap: 0 }),
    enabled: !!user,
  });
}
