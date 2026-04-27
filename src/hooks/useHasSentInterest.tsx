import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getInterestsSent } from '@/api/connections';

export function useHasSentInterest(receiverId: string | number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['interest-status', receiverId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const sent = await getInterestsSent();
      const match = sent.find((i) => i.receiver === Number(receiverId));
      return match ? { id: match.id, status: 'sent' } : null;
    },
    enabled: !!user && !!receiverId,
  });
}
