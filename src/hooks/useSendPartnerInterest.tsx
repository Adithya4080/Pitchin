import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useSendInterest } from './useSendInterest';

export function useSendPartnerInterest() {
  const sendInterest = useSendInterest();
  return {
    ...sendInterest,
    mutateAsync: ({ partnerId }: { partnerId: string }) =>
      sendInterest.mutateAsync({
        receiverId: Number(partnerId),
        subject: 'Partnership Interest',
        message: 'I am interested in connecting with your organization.',
        tag: 'partner',
      }),
  };
}

export function useHasSentPartnerInterest(partnerId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['partner-interest-sent', partnerId, user?.id],
    queryFn: async (): Promise<boolean> => false, // TODO: connect to backend
    enabled: !!user && !!partnerId,
  });
}