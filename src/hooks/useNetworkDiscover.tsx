import { useQuery } from '@tanstack/react-query';
import { getNetworkDiscover, NetworkTab } from '@/api/profiles';

export function useNetworkDiscover(params: {
  tab?: NetworkTab;
  search?: string;
  stage?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ['network-discover', params],
    queryFn: () => getNetworkDiscover({ ...params, page_size: 8 }),
    staleTime: 1000 * 60 * 2,
  });
}