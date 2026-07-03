import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import {
  getServiceCategories,
  getServiceProviders,
  getServiceProvider,
  sendServiceInquiry,
} from '@/api/services';
import type { ProviderFilterParams } from '@/api/services';

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