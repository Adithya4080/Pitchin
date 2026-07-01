import { apiFetch } from './client';

export type ServiceSubCategory = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  order: number;
  provider_count: number;
};

export type ServiceCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  provider_count: number;
  sub_categories: ServiceSubCategory[];
};

export type ServiceProvider = {
  id: number;
  slug: string;
  category: number;
  category_name: string;
  category_slug: string;
  sub_categories: ServiceSubCategory[];
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
  is_top_rated: boolean;
  tags: string[];
  stage_focus: string;
  stage_focus_label: string;
  startups_served: number;
  created_at: string;
};

export type ProviderFilterParams = {
  category?: string;
  sub_category?: string;
  search?: string;
  stage?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'top_rated' | 'newest' | 'price_asc' | 'price_desc';
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const response = await apiFetch<PaginatedResponse<ServiceCategory>>(
    '/services/categories/'
  );

  return response.results;
}

export async function getServiceProviders(
  params?: ProviderFilterParams
): Promise<ServiceProvider[]> {
  const query = new URLSearchParams();

  if (params?.category) query.set('category', params.category);
  if (params?.sub_category) query.set('sub_category', params.sub_category);
  if (params?.search) query.set('search', params.search);
  if (params?.stage) query.set('stage', params.stage);
  if (params?.min_price) query.set('min_price', String(params.min_price));
  if (params?.max_price) query.set('max_price', String(params.max_price));
  if (params?.sort) query.set('sort', params.sort);

  const qs = query.toString();

  const response = await apiFetch<PaginatedResponse<ServiceProvider>>(
    `/services/providers/${qs ? `?${qs}` : ''}`
  );

  return response.results;
}

export async function getServiceProvider(slug: string): Promise<ServiceProvider> {
  return apiFetch(`/services/providers/${slug}/`);
}

export async function getServiceCategory(slug: string): Promise<ServiceCategory> {
  return apiFetch(`/services/categories/${slug}/`);
}

export async function sendServiceInquiry(providerId: number, message: string) {
  return apiFetch('/services/inquiries/', {
    method: 'POST',
    body: JSON.stringify({ provider: providerId, message }),
  });
}