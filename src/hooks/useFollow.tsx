import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  sendFollowRequest,
  respondToFollowRequest,
  unfollow as apiUnfollow,
  getFollowRequests,
  getFollowers,
  getFollowing,
  FollowRequest,
} from '@/api/connections';

export type FollowStatus = 'none' | 'pending' | 'accepted' | 'rejected';

interface FollowWithProfile extends FollowRequest {
  profile: { id: number; full_name: string | null; avatar_url: string | null } | null;
}

function toFollowWithProfile(fr: FollowRequest, side: 'sender' | 'receiver'): FollowWithProfile {
  const isReceiver = side === 'receiver';
  return {
    ...fr,
    profile: {
      id: isReceiver ? fr.receiver : fr.sender,
      full_name: isReceiver ? fr.receiver_name : fr.sender_name,
      avatar_url: isReceiver ? fr.receiver_avatar : fr.sender_avatar,
    },
  };
}

export function useFollowRequest() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ followingId }: { followingId: number }) => sendFollowRequest(followingId),
    onSuccess: (_, { followingId }) => {
      qc.invalidateQueries({ queryKey: ['follow-status', followingId] });
      qc.invalidateQueries({ queryKey: ['following'] });
      toast({ title: 'Follow request sent', description: 'Your request is pending approval.' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}

export function useRespondToFollowRequest() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ followId, approved }: { followId: number; approved: boolean; followerId: number }) =>
      respondToFollowRequest(followId, approved ? 'accept' : 'reject'),
    onSuccess: (_, { approved, followerId }) => {
      qc.invalidateQueries({ queryKey: ['incoming-follow-requests'] });
      qc.invalidateQueries({ queryKey: ['followers'] });
      qc.invalidateQueries({ queryKey: ['follow-status', followerId] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast({ title: approved ? 'Follow approved' : 'Request declined' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}

export function useUnfollow() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (followingId: number) => apiUnfollow(followingId),
    onSuccess: (_, followingId) => {
      qc.invalidateQueries({ queryKey: ['follow-status', followingId] });
      qc.invalidateQueries({ queryKey: ['following'] });
      qc.invalidateQueries({ queryKey: ['followers'] });
      toast({ title: 'Unfollowed' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}

export function useFollowStatus(userId: number | string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['follow-status', userId],
    queryFn: async (): Promise<FollowStatus> => {
      if (!user || !userId) return 'none';
      const following = await getFollowing();
      const match = following.find((f) => f.receiver === Number(userId));
      return (match?.status as FollowStatus) ?? 'none';
    },
    enabled: !!user && !!userId,
  });
}

export function useIncomingFollowRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['incoming-follow-requests', user?.id],
    queryFn: async (): Promise<FollowWithProfile[]> => {
      if (!user) return [];
      const reqs = await getFollowRequests();
      return reqs.map((r) => toFollowWithProfile(r, 'sender'));
    },
    enabled: !!user,
  });
}

export function useFollowers(userId: number | string | undefined) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: async (): Promise<FollowWithProfile[]> => {
      if (!userId) return [];
      const list = await getFollowers();
      return list.map((r) => toFollowWithProfile(r, 'sender'));
    },
    enabled: !!userId,
  });
}

export function useFollowing(userId: number | string | undefined) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: async (): Promise<FollowWithProfile[]> => {
      if (!userId) return [];
      const list = await getFollowing();
      return list.map((r) => toFollowWithProfile(r, 'receiver'));
    },
    enabled: !!userId,
  });
}

export function useHasFollowAccess(userId: number | string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['has-follow-access', user?.id, userId],
    queryFn: async () => {
      if (!user || !userId) return false;
      const following = await getFollowing();
      return following.some((f) => f.receiver === Number(userId) && f.status === 'accepted');
    },
    enabled: !!user && !!userId,
  });
}

// Kept for compat — without full social graph API this checks both directions using local data
export function useMutualFollowAccess(userId: number | string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['mutual-follow-access', user?.id, userId],
    queryFn: async () => {
      if (!user || !userId) return false;
      const [following, followers] = await Promise.all([getFollowing(), getFollowers()]);
      const iFollow = following.some((f) => f.receiver === Number(userId) && f.status === 'accepted');
      const theyFollow = followers.some((f) => f.sender === Number(userId) && f.status === 'accepted');
      return iFollow && theyFollow;
    },
    enabled: !!user && !!userId,
  });
}

export function useReverseFollowStatus(userId: number | string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['reverse-follow-status', userId],
    queryFn: async (): Promise<FollowStatus> => {
      if (!user || !userId) return 'none';
      const followers = await getFollowers();
      const match = followers.find((f) => f.sender === Number(userId));
      return (match?.status as FollowStatus) ?? 'none';
    },
    enabled: !!user && !!userId,
  });
}