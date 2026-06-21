import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getServiceCategories,
  getServiceProviders,
  getServiceProvider,
  sendServiceInquiry,
} from '@/api/services';

export function useServiceCategories() {
  return useQuery({
    queryKey: ['service-categories'],
    queryFn: getServiceCategories,
  });
}

export function useServiceProviders(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['service-providers', params],
    queryFn: () => getServiceProviders(params),
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