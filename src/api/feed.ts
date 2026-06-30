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
  image_url?: string | null;       // optional field for compatibility with older code
  link: string;
  is_published: boolean;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
  user_has_liked: boolean;  // added for clarity, same as liked_by_me
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
  page?: number;        
  page_size?: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function unwrapPaginated<T>(response: T[] | PaginatedResponse<T>): T[] {
  return Array.isArray(response) ? response : (response.results ?? []);
}

export async function getFeed(filters?: FeedFilters): Promise<Post[]> {
  const params = new URLSearchParams();
  if (filters?.post_type) params.set('post_type', filters.post_type);
  if (filters?.author__role) params.set('author__role', filters.author__role);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.ordering) params.set('ordering', filters.ordering);
  if (filters?.page) params.set('page', String(filters.page));
  params.set('page_size', String(filters?.page_size ?? 10));
  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await apiFetch<Post[] | PaginatedResponse<Post>>(`/feed/${query}`);
  return unwrapPaginated(response);
}

export async function createPost(data: {
  title: string;
  content: string;
  post_type?: string;
  tags?: string;
  image?: File | null;
}): Promise<Post> {
  const form = new FormData();
  form.append('title', data.title);
  form.append('content', data.content);
  if (data.post_type) form.append('post_type', data.post_type);
  if (data.tags) form.append('tags', data.tags);
  if (data.image) form.append('image', data.image);
  form.append('is_published', 'true');

  return apiFetch<Post>('/feed/create/', {
    method: 'POST',
    body: form,
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
  const response = await apiFetch<Post[] | PaginatedResponse<Post>>('/feed/my/');
  return unwrapPaginated(response);
}
