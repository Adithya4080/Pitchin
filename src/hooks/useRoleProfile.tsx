import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getMyProfile, updateMyProfile, getUserProfile, AnyProfile } from '@/api/profiles';

export type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant' | 'ecosystem_partner';

export function useMyProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-profile', user?.id],
    queryFn: () => getMyProfile(),
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { refreshUser } = useAuth();
  return useMutation({
    mutationFn: (data: Partial<AnyProfile>) => updateMyProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-profile'] });
      refreshUser();
      toast.success('Profile updated!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useProfileByUserId(userId: number | string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });
}

export function useRoleProfile(userId: string | number | undefined) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['role-profile', userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });

  const role = (data as any)?.role ?? null;
  const roleProfile = data ?? null;

  const saveRoleProfile = useMutation({
    mutationFn: (profileData: Partial<AnyProfile>) =>
      updateMyProfile(profileData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['role-profile', userId] });
      qc.invalidateQueries({ queryKey: ['profile', userId] });
      toast.success('Profile saved!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { roleProfile, role, isLoading, saveRoleProfile };
}