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
  return useQuery<SuggestedProfile[]>({
    queryKey: ['suggested-profiles', user?.id],
    queryFn: async () => {
      const profiles = await getPublicProfiles();
      return profiles
        .filter((p) => p.id !== user?.id) // exclude current user by profile id
        .slice(0, 10)
        .map((p) => ({
          id: p.id,
          full_name: p.full_name ?? p.user_name ?? null,
          avatar_url: p.avatar_url ?? p.avatar ?? null,
          role: p.role ?? null,
          bio: p.bio ?? null,
        }));
    },
    enabled: !!user,
  });
}