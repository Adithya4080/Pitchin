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

export type ProviderMediaItem = {
  id: number;
  image_url: string;
  title: string;
  description: string;
  link: string | null;
  order: number;
  created_at: string;
};

export type ProviderFAQItem = {
  id: number;
  question: string;
  answer: string;
  order: number;
  created_at: string;
};

export type ProviderCollaboratorItem = {
  id: number;
  name: string;
  logo_url: string | null;
  website: string;
  order: number;
  created_at: string;
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
  banner_url: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  youtube_url?: string | null;
  website: string;
  location: string;
  contact_email?: string;
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
  media?: ProviderMediaItem[];
  faqs?: ProviderFAQItem[];
  collaborators?: ProviderCollaboratorItem[];
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

// ─────────────────────────────────────────────────────────────────────────────
// Self-serve provider dashboard (consultant-role accounts)
// Network partners — agencies, legal/finance/design firms, etc. — log in with
// credentials shared by an admin and manage their own ServiceProvider bio here.
// Same API, same database as the public marketplace above.
// ─────────────────────────────────────────────────────────────────────────────

export type MyServiceProvider = ServiceProvider & {
  exists: true;
  sub_categories: number[];
  sub_categories_detail: ServiceSubCategory[];
  media: ProviderMediaItem[];
  faqs: ProviderFAQItem[];
  collaborators: ProviderCollaboratorItem[];
  is_active: boolean;
  updated_at: string;
};

export type MyServiceProviderResult = { exists: false } | MyServiceProvider;

export type MyProviderInput = Partial<{
  category: number;
  name: string;
  tagline: string;
  description: string;
  website: string;
  location: string;
  contact_email: string;
  pricing_type: 'hourly' | 'fixed' | 'retainer' | 'custom';
  starting_price: number | string;
  tags: string[];
  sub_categories: number[];
  stage_focus: string;
  logo: File;
  banner: File;
  instagram_url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  youtube_url?: string;
}>;

function buildProviderFormData(input: MyProviderInput): FormData {
  const fd = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (key === 'logo' || key === 'banner') {
      fd.append(key, value as File);
    } else if (key === 'tags' || key === 'sub_categories') {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
}

export async function getMyProvider(): Promise<MyServiceProviderResult> {
  return apiFetch('/services/my-provider/');
}

export async function createMyProvider(input: MyProviderInput): Promise<MyServiceProvider> {
  return apiFetch('/services/my-provider/', {
    method: 'POST',
    body: buildProviderFormData(input),
  });
}

export async function updateMyProvider(input: MyProviderInput): Promise<MyServiceProvider> {
  return apiFetch('/services/my-provider/', {
    method: 'PATCH',
    body: buildProviderFormData(input),
  });
}

export async function getMyProviderMedia(): Promise<ProviderMediaItem[]> {
  return apiFetch('/services/my-provider/media/');
}

export async function addMyProviderMedia(
  image: File,
  title?: string,
  description?: string,
  link?: string
): Promise<ProviderMediaItem> {
  const fd = new FormData();
  fd.append('image', image);
  if (title) fd.append('title', title);
  if (description) fd.append('description', description);
  if (link) fd.append('link', link);
  return apiFetch('/services/my-provider/media/', { method: 'POST', body: fd });
}

export async function updateMyProviderMedia(
  id: number,
  input: { title?: string; description?: string; link?: string; image?: File }
): Promise<ProviderMediaItem> {
  const fd = new FormData();
  if (input.title !== undefined) fd.append('title', input.title);
  if (input.description !== undefined) fd.append('description', input.description);
  if (input.link !== undefined) fd.append('link', input.link);
  if (input.image) fd.append('image', input.image);
  return apiFetch(`/services/my-provider/media/${id}/`, { method: 'PATCH', body: fd });
}

export async function deleteMyProviderMedia(id: number): Promise<void> {
  await apiFetch(`/services/my-provider/media/${id}/`, { method: 'DELETE' });
}

export async function getMyProviderFAQs(): Promise<ProviderFAQItem[]> {
  return apiFetch('/services/my-provider/faqs/');
}

export async function addMyProviderFAQ(question: string, answer: string): Promise<ProviderFAQItem> {
  return apiFetch('/services/my-provider/faqs/', {
    method: 'POST',
    body: JSON.stringify({ question, answer }),
  });
}

export async function updateMyProviderFAQ(id: number, input: { question?: string; answer?: string }): Promise<ProviderFAQItem> {
  return apiFetch(`/services/my-provider/faqs/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteMyProviderFAQ(id: number): Promise<void> {
  await apiFetch(`/services/my-provider/faqs/${id}/`, { method: 'DELETE' });
}

export async function getMyProviderCollaborators(): Promise<ProviderCollaboratorItem[]> {
  return apiFetch('/services/my-provider/collaborators/');
}

export async function addMyProviderCollaborator(
  name: string,
  logo?: File,
  website?: string
): Promise<ProviderCollaboratorItem> {
  const fd = new FormData();
  fd.append('name', name);
  if (logo) fd.append('logo', logo);
  if (website) fd.append('website', website);
  return apiFetch('/services/my-provider/collaborators/', { method: 'POST', body: fd });
}

export async function deleteMyProviderCollaborator(id: number): Promise<void> {
  await apiFetch(`/services/my-provider/collaborators/${id}/`, { method: 'DELETE' });
}

export async function createServiceCategory(input: {
  name: string;
  description?: string;
  icon?: string;
}): Promise<ServiceCategory> {
  return apiFetch('/services/categories/create/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function createServiceSubCategory(input: {
  category: number;
  name: string;
  icon?: string;
}): Promise<ServiceSubCategory> {
  return apiFetch('/services/subcategories/create/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
// import { apiFetch } from './client';

// export type ServiceSubCategory = {
//   id: number;
//   name: string;
//   slug: string;
//   icon: string;
//   order: number;
//   provider_count: number;
// };

// export type ServiceCategory = {
//   id: number;
//   name: string;
//   slug: string;
//   description: string;
//   icon: string;
//   color: string;
//   order: number;
//   provider_count: number;
//   sub_categories: ServiceSubCategory[];
// };

// export type ProviderMediaItem = {
//   id: number;
//   image_url: string;
//   title: string;
//   description: string;
//   link: string | null;
//   order: number;
//   created_at: string;
// };

// export type ProviderFAQItem = {
//   id: number;
//   question: string;
//   answer: string;
//   order: number;
//   created_at: string;
// };

// export type ProviderCollaboratorItem = {
//   id: number;
//   name: string;
//   logo_url: string | null;
//   website: string;
//   order: number;
//   created_at: string;
// };

// export type ServiceProvider = {
//   id: number;
//   slug: string;
//   category: number;
//   category_name: string;
//   category_slug: string;
//   sub_categories: ServiceSubCategory[];
//   name: string;
//   tagline: string;
//   description: string;
//   logo_url: string | null;
//   banner_url: string | null;
//   website: string;
//   location: string;
//   pricing_type: 'hourly' | 'fixed' | 'retainer' | 'custom';
//   starting_price: string | null;
//   rating: string;
//   review_count: number;
//   is_verified: boolean;
//   is_top_rated: boolean;
//   tags: string[];
//   stage_focus: string;
//   stage_focus_label: string;
//   startups_served: number;
//   media?: ProviderMediaItem[];
//   faqs?: ProviderFAQItem[];
//   collaborators?: ProviderCollaboratorItem[];
//   created_at: string;
// };

// export type ProviderFilterParams = {
//   category?: string;
//   sub_category?: string;
//   search?: string;
//   stage?: string;
//   min_price?: number;
//   max_price?: number;
//   sort?: 'top_rated' | 'newest' | 'price_asc' | 'price_desc';
// };

// type PaginatedResponse<T> = {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: T[];
// };

// export async function getServiceCategories(): Promise<ServiceCategory[]> {
//   const response = await apiFetch<PaginatedResponse<ServiceCategory>>(
//     '/services/categories/'
//   );

//   return response.results;
// }

// export async function getServiceProviders(
//   params?: ProviderFilterParams
// ): Promise<ServiceProvider[]> {
//   const query = new URLSearchParams();

//   if (params?.category) query.set('category', params.category);
//   if (params?.sub_category) query.set('sub_category', params.sub_category);
//   if (params?.search) query.set('search', params.search);
//   if (params?.stage) query.set('stage', params.stage);
//   if (params?.min_price) query.set('min_price', String(params.min_price));
//   if (params?.max_price) query.set('max_price', String(params.max_price));
//   if (params?.sort) query.set('sort', params.sort);

//   const qs = query.toString();

//   const response = await apiFetch<PaginatedResponse<ServiceProvider>>(
//     `/services/providers/${qs ? `?${qs}` : ''}`
//   );

//   return response.results;
// }

// export async function getServiceProvider(slug: string): Promise<ServiceProvider> {
//   return apiFetch(`/services/providers/${slug}/`);
// }

// export async function getServiceCategory(slug: string): Promise<ServiceCategory> {
//   return apiFetch(`/services/categories/${slug}/`);
// }

// export async function sendServiceInquiry(providerId: number, message: string) {
//   return apiFetch('/services/inquiries/', {
//     method: 'POST',
//     body: JSON.stringify({ provider: providerId, message }),
//   });
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Self-serve provider dashboard (consultant-role accounts)
// // Network partners — agencies, legal/finance/design firms, etc. — log in with
// // credentials shared by an admin and manage their own ServiceProvider bio here.
// // Same API, same database as the public marketplace above.
// // ─────────────────────────────────────────────────────────────────────────────

// export type MyServiceProvider = ServiceProvider & {
//   exists: true;
//   sub_categories: number[];
//   sub_categories_detail: ServiceSubCategory[];
//   media: ProviderMediaItem[];
//   faqs: ProviderFAQItem[];
//   collaborators: ProviderCollaboratorItem[];
//   is_active: boolean;
//   updated_at: string;
// };

// export type MyServiceProviderResult = { exists: false } | MyServiceProvider;

// export type MyProviderInput = Partial<{
//   category: number;
//   name: string;
//   tagline: string;
//   description: string;
//   website: string;
//   location: string;
//   pricing_type: 'hourly' | 'fixed' | 'retainer' | 'custom';
//   starting_price: number | string;
//   tags: string[];
//   sub_categories: number[];
//   stage_focus: string;
//   logo: File;
//   banner: File;
// }>;

// function buildProviderFormData(input: MyProviderInput): FormData {
//   const fd = new FormData();
//   Object.entries(input).forEach(([key, value]) => {
//     if (value === undefined || value === null) return;
//     if (key === 'logo' || key === 'banner') {
//       fd.append(key, value as File);
//     } else if (key === 'tags' || key === 'sub_categories') {
//       fd.append(key, JSON.stringify(value));
//     } else {
//       fd.append(key, String(value));
//     }
//   });
//   return fd;
// }

// export async function getMyProvider(): Promise<MyServiceProviderResult> {
//   return apiFetch('/services/my-provider/');
// }

// export async function createMyProvider(input: MyProviderInput): Promise<MyServiceProvider> {
//   return apiFetch('/services/my-provider/', {
//     method: 'POST',
//     body: buildProviderFormData(input),
//   });
// }

// export async function updateMyProvider(input: MyProviderInput): Promise<MyServiceProvider> {
//   return apiFetch('/services/my-provider/', {
//     method: 'PATCH',
//     body: buildProviderFormData(input),
//   });
// }

// export async function getMyProviderMedia(): Promise<ProviderMediaItem[]> {
//   return apiFetch('/services/my-provider/media/');
// }

// export async function addMyProviderMedia(
//   image: File,
//   title?: string,
//   description?: string,
//   link?: string
// ): Promise<ProviderMediaItem> {
//   const fd = new FormData();
//   fd.append('image', image);
//   if (title) fd.append('title', title);
//   if (description) fd.append('description', description);
//   if (link) fd.append('link', link);
//   return apiFetch('/services/my-provider/media/', { method: 'POST', body: fd });
// }

// export async function updateMyProviderMedia(
//   id: number,
//   input: { title?: string; description?: string; link?: string; image?: File }
// ): Promise<ProviderMediaItem> {
//   const fd = new FormData();
//   if (input.title !== undefined) fd.append('title', input.title);
//   if (input.description !== undefined) fd.append('description', input.description);
//   if (input.link !== undefined) fd.append('link', input.link);
//   if (input.image) fd.append('image', input.image);
//   return apiFetch(`/services/my-provider/media/${id}/`, { method: 'PATCH', body: fd });
// }

// export async function deleteMyProviderMedia(id: number): Promise<void> {
//   await apiFetch(`/services/my-provider/media/${id}/`, { method: 'DELETE' });
// }

// export async function getMyProviderFAQs(): Promise<ProviderFAQItem[]> {
//   return apiFetch('/services/my-provider/faqs/');
// }

// export async function addMyProviderFAQ(question: string, answer: string): Promise<ProviderFAQItem> {
//   return apiFetch('/services/my-provider/faqs/', {
//     method: 'POST',
//     body: JSON.stringify({ question, answer }),
//   });
// }

// export async function updateMyProviderFAQ(id: number, input: { question?: string; answer?: string }): Promise<ProviderFAQItem> {
//   return apiFetch(`/services/my-provider/faqs/${id}/`, {
//     method: 'PATCH',
//     body: JSON.stringify(input),
//   });
// }

// export async function deleteMyProviderFAQ(id: number): Promise<void> {
//   await apiFetch(`/services/my-provider/faqs/${id}/`, { method: 'DELETE' });
// }

// export async function getMyProviderCollaborators(): Promise<ProviderCollaboratorItem[]> {
//   return apiFetch('/services/my-provider/collaborators/');
// }

// export async function addMyProviderCollaborator(
//   name: string,
//   logo?: File,
//   website?: string
// ): Promise<ProviderCollaboratorItem> {
//   const fd = new FormData();
//   fd.append('name', name);
//   if (logo) fd.append('logo', logo);
//   if (website) fd.append('website', website);
//   return apiFetch('/services/my-provider/collaborators/', { method: 'POST', body: fd });
// }

// export async function deleteMyProviderCollaborator(id: number): Promise<void> {
//   await apiFetch(`/services/my-provider/collaborators/${id}/`, { method: 'DELETE' });
// }

// export async function createServiceCategory(input: {
//   name: string;
//   description?: string;
//   icon?: string;
// }): Promise<ServiceCategory> {
//   return apiFetch('/services/categories/create/', {
//     method: 'POST',
//     body: JSON.stringify(input),
//   });
// }

// export async function createServiceSubCategory(input: {
//   category: number;
//   name: string;
//   icon?: string;
// }): Promise<ServiceSubCategory> {
//   return apiFetch('/services/subcategories/create/', {
//     method: 'POST',
//     body: JSON.stringify(input),
//   });
// }