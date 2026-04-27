import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { getFeed, getMyPosts, createPost, deletePost, getPost, updatePost, Post } from '@/api/feed';

export type PitchStage = 'idea' | 'research' | 'mvp' | 'early_validation';

export interface ProfilePitch {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  short_summary: string | null;
  problem_statement: string | null;
  solution_overview: string | null;
  target_users: string | null;
  current_stage: PitchStage | null;
  supporting_materials: { url: string; type: 'image' | 'file'; name: string }[] | null;
  open_considerations: string | null;
  looking_for: string[] | null;
}

function postToProfilePitch(p: Post): ProfilePitch {
  return {
    id: String(p.id),
    user_id: String(p.author),
    title: p.title,
    description: p.content,
    image_url: p.image_url,
    status: p.is_published ? 'published' : 'draft',
    created_at: p.created_at,
    updated_at: p.updated_at,
    short_summary: null,
    problem_statement: null,
    solution_overview: null,
    target_users: null,
    current_stage: null,
    supporting_materials: null,
    open_considerations: null,
    looking_for: null,
  };
}

export function useProfilePitches(userId?: string | number) {
  const { user } = useAuth();
  const isOwner = user && userId && String(user.id) === String(userId);

  return useQuery({
    queryKey: ['profile-pitches', userId],
    queryFn: async (): Promise<ProfilePitch[]> => {
      if (!userId) return [];
      if (isOwner) {
        const posts = await getMyPosts();
        return posts.map(postToProfilePitch);
      }
      const posts = await getFeed({ author__role: undefined });
      return posts.filter((p) => String(p.author) === String(userId)).map(postToProfilePitch);
    },
    enabled: !!userId,
  });
}

export function useProfilePitch(pitchId?: string | number) {
  return useQuery({
    queryKey: ['profile-pitch', pitchId],
    queryFn: async (): Promise<ProfilePitch | null> => {
      if (!pitchId) return null;
      const post = await getPost(Number(pitchId));
      return postToProfilePitch(post);
    },
    enabled: !!pitchId,
  });
}

export function useCreateProfilePitch() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: Partial<ProfilePitch>) =>
      createPost({ title: data.title || '', content: data.description || '', post_type: 'pitch' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-pitches'] });
      toast({ title: 'Pitch created!' });
    },
  });
}

export function useUpdateProfilePitch() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<ProfilePitch> & { id: string }) =>
      updatePost(Number(id), { title: data.title, content: data.description }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-pitches'] });
      toast({ title: 'Pitch updated!' });
    },
  });
}

export function useDeleteProfilePitch() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => deletePost(Number(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile-pitches'] });
      toast({ title: 'Pitch deleted' });
    },
  });
}
