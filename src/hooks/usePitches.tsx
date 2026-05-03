import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  getFeed,
  createPost,
  deletePost,
  likePost,
  getMyPosts,
  Post,
} from '@/api/feed';

export type PitchWithProfile = Post & {
  profiles: { full_name: string | null; avatar_url: string | null } | null;
  user_has_saved?: boolean;
  user_reaction?: string | null;
  pitch_statement?: string; 
  supporting_line?: string;
  id?: number;
  save_count?: number;
  user_id?: number | string;
};

function adaptPost(p: Post): PitchWithProfile {
  const raw = p as any;
  return {
    ...p,
    pitch_statement: p.content,
    post_title: raw.title ?? null,
    user_id: String(raw.author_id),
    author_avatar: raw.author_avatar ?? null,
    profiles: {
      full_name: p.author_name ?? null,
      avatar_url: raw.author_avatar ?? null,
    },
    user_has_saved: false,
    user_reaction: null,
  } as any;
}

export function usePitches(
  sortBy: 'newest' | 'trending' = 'newest',
  category?: string,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['pitches', sortBy, category, user?.id],
    queryFn: async (): Promise<PitchWithProfile[]> => {
      const ordering = sortBy === 'trending' ? '-like_count' : '-created_at';
      const posts = await getFeed({
        post_type: category,
        ordering,
      });
      return posts.map(adaptPost);
    },
  });
}

export function useUserActivePitch() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-active-pitch', user?.id],
    queryFn: async (): Promise<PitchWithProfile | null> => {
      if (!user) return null;
      const posts = await getMyPosts();
      return posts.length ? adaptPost(posts[0]) : null;
    },
    enabled: !!user,
  });
}

export function useUserPitches() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-pitches', user?.id],
    queryFn: async () => {
      if (!user) return [];
      return getMyPosts();
    },
    enabled: !!user,
  });
}

export function useCreatePitch() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: {
      pitch_statement: string;   // maps to → content (description textarea)
      post_title?: string;       // maps to → title (title input)
      supporting_line?: string;
      category?: string;
      description?: string;
      image?: File | null;
    }) =>
      createPost({
        title: data.post_title || '',
        content: data.pitch_statement,
        post_type: data.category || 'other',
        image: data.image,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pitches'] });
      qc.invalidateQueries({ queryKey: ['user-active-pitch'] });
      toast({ title: 'Post is live!', description: 'Your post has been published.' });
    },
    onError: (e: Error) =>
      toast({ title: 'Failed to create post', description: e.message, variant: 'destructive' }),
  });
}

export function useDeletePitch() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number | string) => deletePost(Number(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pitches'] });
      qc.invalidateQueries({ queryKey: ['user-active-pitch'] });
      toast({ title: 'Post deleted' });
    },
  });
}

export function useReactToPitch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pitchId, reactionType }: { pitchId: number | string; reactionType: string; currentReaction: string | null   }) => likePost(Number(pitchId)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pitches'] }),
  });
}

// Kept for API compat — save feature requires backend support
export function useSavePitch() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      toast({ title: 'Save feature coming soon!' });
    },
  });
}

export function useRequestContact() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      toast({ title: 'Use the interest message feature to connect!' });
    },
  });
}
