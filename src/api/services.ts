import { apiFetch } from './client';

export type ServiceCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  provider_count: number;
};

export type ServiceProvider = {
  id: number;
  slug: string;
  category: number;
  category_name: string;
  category_slug: string;
  name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  website: string;
  location: string;
  pricing_type: 'hourly' | 'fixed' | 'retainer' | 'custom';
  starting_price: string | null;
  rating: string;
  review_count: number;
  is_verified: boolean;
  created_at: string;
};

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return apiFetch('/services/categories/');
}

export async function getServiceProviders(params?: {
  category?: string;
  search?: string;
}): Promise<ServiceProvider[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return apiFetch(`/services/providers/${qs ? `?${qs}` : ''}`);
}

export async function getServiceProvider(slug: string): Promise<ServiceProvider> {
  return apiFetch(`/services/providers/${slug}/`);
}

export async function sendServiceInquiry(providerId: number, message: string) {
  return apiFetch('/services/inquiries/', {
    method: 'POST',
    body: JSON.stringify({ provider: providerId, message }),
  });
}