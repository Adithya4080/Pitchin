import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  getFeed,
  getFeedPage,
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
    // Map backend's liked_by_me / user_has_liked → user_reaction
    // Backend returns liked_by_me (old) or user_has_liked (new serializer)
    user_reaction: (raw.liked_by_me || raw.user_has_liked) ? 'fire' : null,
    // Use real like_count from backend
    like_count: raw.like_count ?? 0,
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
      const posts = await getFeed({ post_type: category, ordering, page: 1, page_size: 10 });
      return posts.map(adaptPost);
    },
    enabled: !!user,   // ← ADD THIS
  });
}

const FEED_PAGE_SIZE = 10;

// Infinite-scroll version of usePitches: fetches one page (10 posts) at a
// time via DRF's page-number pagination instead of loading everything
// up front. Call fetchNextPage() (e.g. from an IntersectionObserver
// sentinel) to pull in the next page; `hasNextPage` reflects the
// backend's `next` field so we stop once there's nothing left to load.
export function useInfinitePitches(
  sortBy: 'newest' | 'trending' = 'newest',
  category?: string,
) {
  const { user } = useAuth();
  const query = useInfiniteQuery({
    queryKey: ['pitches-infinite', sortBy, category, user?.id],
    queryFn: async ({ pageParam }) => {
      const ordering = sortBy === 'trending' ? '-like_count' : '-created_at';
      const page = await getFeedPage({
        post_type: category,
        ordering,
        page: pageParam,
        page_size: FEED_PAGE_SIZE,
      });
      return {
        ...page,
        results: page.results.map(adaptPost),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    enabled: !!user,
  });

  const pitches = query.data?.pages.flatMap((p) => p.results) ?? [];

  return { ...query, pitches };
}

export function useUserActivePitch() {
  const { user } = useAuth();
  return useQuery({
    // Shared cache key with useMyPostsStats() below — both derive from the
    // same underlying "my posts" list instead of each firing their own
    // GET /api/feed/my/ request.
    queryKey: ['my-posts', user?.id],
    queryFn: async (): Promise<Post[]> => {
      if (!user) return [];
      return getMyPosts();
    },
    enabled: !!user,
    select: (posts): PitchWithProfile | null =>
      posts.length ? adaptPost(posts[0]) : null,
  });
}

export function useMyPostsStats() {
  const { user } = useAuth();
  return useQuery({
    // Same queryKey/queryFn as useUserActivePitch() — React Query dedupes
    // these into a single network request and shares the cached result.
    queryKey: ['my-posts', user?.id],
    queryFn: async (): Promise<Post[]> => {
      if (!user) return [];
      return getMyPosts();
    },
    enabled: !!user,
    select: (posts) => ({
      totalReactions: posts.reduce((sum, p: any) => sum + (p.like_count || 0), 0),
      pitchCount: posts.length,
    }),
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
      qc.invalidateQueries({ queryKey: ['pitches-infinite'] });
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
      qc.invalidateQueries({ queryKey: ['pitches-infinite'] });
      qc.invalidateQueries({ queryKey: ['user-active-pitch'] });
      toast({ title: 'Post deleted' });
    },
  });
}

export function useReactToPitch() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ pitchId }: { pitchId: number | string; reactionType: string; currentReaction: string | null }) =>
      likePost(Number(pitchId)),
    // Optimistic update: flip the button and count immediately, in every
    // cached 'pitches' list this post appears in, instead of waiting for
    // the request to finish and then refetching the entire feed.
    onMutate: async ({ pitchId, currentReaction }) => {
      await qc.cancelQueries({ queryKey: ['pitches'] });
      await qc.cancelQueries({ queryKey: ['pitches-infinite'] });
      const previous = qc.getQueriesData<PitchWithProfile[]>({ queryKey: ['pitches'] });
      const previousInfinite = qc.getQueriesData({ queryKey: ['pitches-infinite'] });

      const nowLiked = currentReaction !== 'fire';
      const bump = (p: PitchWithProfile) =>
        String(p.id) === String(pitchId)
          ? {
              ...p,
              user_reaction: nowLiked ? 'fire' : null,
              like_count: Math.max(0, (p.like_count || 0) + (nowLiked ? 1 : -1)),
            }
          : p;

      qc.setQueriesData<PitchWithProfile[]>({ queryKey: ['pitches'] }, (old) =>
        old?.map(bump)
      );
      // Infinite-query cache shape is { pages: [{ results, ... }], pageParams }
      qc.setQueriesData<any>({ queryKey: ['pitches-infinite'] }, (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            results: page.results.map(bump),
          })),
        };
      });

      return { previous, previousInfinite };
    },
    onError: (e: Error, _vars, context) => {
      // Roll back every list we optimistically touched.
      context?.previous?.forEach(([key, data]) => qc.setQueryData(key, data));
      context?.previousInfinite?.forEach(([key, data]) => qc.setQueryData(key, data));
      toast({ title: 'Failed to react', description: e.message, variant: 'destructive' });
    },
    // No onSuccess refetch of the whole feed — the optimistic update already
    // reflects the real outcome, and the like endpoint is a simple toggle.
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