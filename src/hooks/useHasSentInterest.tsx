import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getInterestsSent, InterestMessage } from '@/api/connections';

// Backend returns receiver as a nested object { id, full_name, ... }
// so we need to extract the id safely from either shape
function getReceiverId(interest: InterestMessage): number {
  const r = interest.receiver;
  if (typeof r === 'object' && r !== null) return r.id;
  return Number(r);
}

export function useHasSentInterest(receiverId: string | number) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['interest-status', receiverId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const sent = await getInterestsSent();
      const match = sent.find((i) => getReceiverId(i) === Number(receiverId));
      return match ? { id: match.id, status: 'pending' } : null;
    },
    enabled: !!user && !!receiverId,
  });
}