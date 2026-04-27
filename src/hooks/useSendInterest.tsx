import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { sendInterest } from '@/api/connections';

export function useSendInterest() {
  const { toast } = useToast();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { receiverId: number; subject: string; message: string; tag?: string }) =>
      sendInterest({ receiver: params.receiverId, subject: params.subject, message: params.message, tag: params.tag }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['interests-sent'] });
      toast({ title: 'Interest sent!', description: 'The user will receive your request.' });
    },
    onError: (e: Error) =>
      toast({ title: 'Failed to send interest', description: e.message, variant: 'destructive' }),
  });
}
