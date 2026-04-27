// import { useQuery } from '@tanstack/react-query';
// import { useAuth } from './useAuth';

// export function useContactRequests(pitchId?: string) {
//   const { user } = useAuth();
//   return useQuery({
//     queryKey: ['contact-requests', pitchId, user?.id],
//     queryFn: async () => [],
//     enabled: !!user,
//   });
// }

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ContactRequest {
  id: number;
  requester_id: number;
  receiver_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export function useContactRequests(pitchId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['contact-requests', pitchId, user?.id],
    queryFn: async (): Promise<ContactRequest[]> => [],
    enabled: !!user,
  });
}

export function useIncomingContactRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['incoming-contact-requests', user?.id],
    queryFn: async (): Promise<ContactRequest[]> => [],
    enabled: !!user,
  });
}

export function useRespondToContactRequest() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      requestId,
      approved,
    }: {
      requestId: number;
      approved: boolean;
      requesterId: number;
      
    }) => {
      // Replace with your actual API call
      return { requestId, approved };
    },
    onSuccess: (_, { approved, requesterId }) => {
      qc.invalidateQueries({ queryKey: ['incoming-contact-requests'] });
      qc.invalidateQueries({ queryKey: ['contact-requests'] });
      qc.invalidateQueries({ queryKey: ['notifications'] });
      toast({ title: approved ? 'Contact request accepted' : 'Contact request declined' });
    },
    onError: (e: Error) =>
      toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });
}