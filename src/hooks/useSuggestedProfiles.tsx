import { useQuery } from '@tanstack/react-query';
import { getPublicProfiles } from '@/api/profiles';
import { useAuth } from './useAuth';

export type SuggestedProfile = {
  id: number;
  full_name: string | null;
  avatar_url: string | null;
  role?: string | null;
  bio: string | null;
};

export function useSuggestedProfiles() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['suggested-profiles', user?.id],
    queryFn: async () => {
      const profiles = await getPublicProfiles();
      // Exclude current user
      return profiles.filter((p) => p.user !== user?.id).slice(0, 10);
    },
    enabled: !!user,
  });
}
