import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getServiceCategories,
  getServiceProviders,
  getServiceProvider,
  sendServiceInquiry,
  getMyProvider,
  createMyProvider,
  updateMyProvider,
  getMyProviderMedia,
  addMyProviderMedia,
  updateMyProviderMedia,
  deleteMyProviderMedia,
  getMyProviderFAQs,
  addMyProviderFAQ,
  updateMyProviderFAQ,
  deleteMyProviderFAQ,
  getMyProviderCollaborators,
  addMyProviderCollaborator,
  deleteMyProviderCollaborator,
  createServiceCategory,
  createServiceSubCategory,
} from '@/api/services';
import type { ProviderFilterParams, MyProviderInput } from '@/api/services';

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: getServiceCategories,
    staleTime: 5 * 60 * 1000, // categories rarely change; avoid refetching on every visit
  });
}

export function useServiceProviders(params?: ProviderFilterParams) {
  return useQuery({
    queryKey: ['service-providers', params],
    queryFn: () => getServiceProviders(params),
    // Keep showing the previous result set while the new filter/search
    // request is in flight, instead of dropping to a full skeleton.
    // This is what makes filtering/searching feel instant.
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useServiceProvider(slug: string | undefined) {
  return useQuery({
    queryKey: ['service-provider', slug],
    queryFn: () => getServiceProvider(slug as string),
    enabled: !!slug,
  });
}

export function useSendServiceInquiry() {
  return useMutation({
    mutationFn: ({ providerId, message }: { providerId: number; message: string }) =>
      sendServiceInquiry(providerId, message),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Self-serve provider dashboard
// ─────────────────────────────────────────────────────────────────────────────

export function useMyProvider() {
  return useQuery({
    queryKey: ['my-provider'],
    queryFn: getMyProvider,
    retry: false,
  });
}

export function useCreateMyProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MyProviderInput) => createMyProvider(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider'] });
      qc.invalidateQueries({ queryKey: ['service-providers'] });
    },
  });
}

export function useUpdateMyProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MyProviderInput) => updateMyProvider(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider'] });
      qc.invalidateQueries({ queryKey: ['service-providers'] });
    },
  });
}

export function useMyProviderMedia() {
  return useQuery({
    queryKey: ['my-provider-media'],
    queryFn: getMyProviderMedia,
  });
}

export function useAddMyProviderMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ image, title, description, link }: { image: File; title?: string; description?: string; link?: string }) =>
      addMyProviderMedia(image, title, description, link),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-media'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useUpdateMyProviderMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: number; title?: string; description?: string; link?: string; image?: File }) =>
      updateMyProviderMedia(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-media'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useDeleteMyProviderMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMyProviderMedia(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-media'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useMyProviderCollaborators() {
  return useQuery({
    queryKey: ['my-provider-collaborators'],
    queryFn: getMyProviderCollaborators,
  });
}

export function useAddMyProviderCollaborator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, logo, website }: { name: string; logo?: File; website?: string }) =>
      addMyProviderCollaborator(name, logo, website),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-collaborators'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useDeleteMyProviderCollaborator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMyProviderCollaborator(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-collaborators'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useMyProviderFAQs() {
  return useQuery({
    queryKey: ['my-provider-faqs'],
    queryFn: getMyProviderFAQs,
  });
}

export function useAddMyProviderFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ question, answer }: { question: string; answer: string }) =>
      addMyProviderFAQ(question, answer),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-faqs'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useUpdateMyProviderFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, question, answer }: { id: number; question?: string; answer?: string }) =>
      updateMyProviderFAQ(id, { question, answer }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-faqs'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useDeleteMyProviderFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMyProviderFAQ(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-provider-faqs'] });
      qc.invalidateQueries({ queryKey: ['my-provider'] });
    },
  });
}

export function useCreateServiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createServiceCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['service-categories'] });
    },
  });
}

export function useCreateServiceSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createServiceSubCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['service-categories'] });
    },
  });
}