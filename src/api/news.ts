import { apiFetch } from './client';

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url: string | null;
  source_url: string | null;
  author: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export async function getNews(): Promise<NewsArticle[]> {
  return apiFetch<NewsArticle[]>('/news/');
}

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  return apiFetch<NewsArticle[]>('/news/featured/');
}

export async function getNewsArticle(id: number): Promise<NewsArticle> {
  return apiFetch<NewsArticle>(`/news/${id}/`);
}
