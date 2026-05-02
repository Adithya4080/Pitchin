import { apiFetch } from './client';

export interface Post {
  id: number;
  author_id: number;
  author_name: string;
  author_avatar?: string | null;  // not always returned by backend
  author_role: string;
  title: string;                  // backend field (mapped to post_title in adaptPost)
  content: string;                // backend field (mapped to pitch_statement in adaptPost)
  post_type: string;
  tags: string[] | string;
  image: string | null;           // backend uses "image", not "image_url"
  link: string;
  is_published: boolean;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostComment {
  id: number;
  post: number;
  author: number;
  author_name: string;
  author_avatar: string | null;
  content: string;
  parent: number | null;
  replies?: PostComment[];
  created_at: string;
}

export interface FeedFilters {
  post_type?: string;
  author__role?: string;
  search?: string;
  ordering?: string;
}

export async function getFeed(filters?: FeedFilters): Promise<Post[]> {
  const params = new URLSearchParams();
  if (filters?.post_type) params.set('post_type', filters.post_type);
  if (filters?.author__role) params.set('author__role', filters.author__role);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.ordering) params.set('ordering', filters.ordering);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch<Post[]>(`/feed/${query}`);
}

export async function createPost(data: {
  title: string;
  content: string;
  post_type?: string;
  tags?: string;
  image_url?: string;
}): Promise<Post> {
  return apiFetch<Post>('/feed/create/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPost(postId: number): Promise<Post> {
  return apiFetch<Post>(`/feed/${postId}/`);
}

export async function updatePost(postId: number, data: Partial<Post>): Promise<Post> {
  return apiFetch<Post>(`/feed/${postId}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deletePost(postId: number): Promise<void> {
  return apiFetch(`/feed/${postId}/`, { method: 'DELETE' });
}

export async function likePost(postId: number): Promise<{ liked: boolean; like_count: number }> {
  return apiFetch(`/feed/${postId}/like/`, { method: 'POST' });
}

export async function getPostComments(postId: number): Promise<PostComment[]> {
  return apiFetch<PostComment[]>(`/feed/${postId}/comments/`);
}

export async function createComment(postId: number, content: string, parent?: number): Promise<PostComment> {
  return apiFetch<PostComment>(`/feed/${postId}/comments/`, {
    method: 'POST',
    body: JSON.stringify({ content, parent }),
  });
}

export async function getMyPosts(): Promise<Post[]> {
  return apiFetch<Post[]>('/feed/my/');
}
