import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant' | 'ecosystem_partner';

export function useCurrentUserRole() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['current-user-role', user?.id],
    queryFn: () => ({ role: user?.role as UserRole | undefined }),
    enabled: !!user,
  });
}

export function useUserRole(userId: number | string | undefined) {
  const { user } = useAuth();
  // If asking about own role, use auth context
  if (userId && user && String(userId) === String(user.id)) {
    return useQuery({
      queryKey: ['user-role', userId],
      queryFn: () => ({ role: user.role as UserRole }),
      enabled: !!user,
    });
  }
  return useQuery({
    queryKey: ['user-role', userId],
    queryFn: async () => {
      // For other users, role is embedded in their profile data
      // Components relying on this should use useProfileByUserId instead
      return { role: undefined as UserRole | undefined };
    },
    enabled: !!userId,
  });
}
