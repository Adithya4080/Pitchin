// import { useCallback, useState } from 'react';
// import { useToast } from '@/hooks/use-toast';

// export function useProfileShare(userId?: string | number) {
//   const { toast } = useToast();
//   const [isLoading] = useState(false);
//   const [isRegenerating, setIsRegenerating] = useState(false);
//   const [isEnabled, setIsEnabled] = useState(true);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [shareSettings] = useState(null);

//   const shareUrl = userId ? `${window.location.origin}/shared/${userId}` : '';
//   const hasShareLink = !!userId;

//   const copyToClipboard = useCallback(async (): Promise<boolean> => {
//     try {
//       await navigator.clipboard.writeText(shareUrl);
//       toast({ title: 'Link copied!', description: 'Profile link copied to clipboard.' });
//       return true;
//     } catch {
//       toast({ title: 'Failed to copy', variant: 'destructive' });
//       return false;
//     }
//   }, [shareUrl, toast]);

//   const regenerateToken = useCallback(() => {
//     setIsRegenerating(true);
//     setTimeout(() => {
//       copyToClipboard();
//       setIsRegenerating(false);
//     }, 500);
//   }, [copyToClipboard]);

//   const updateShareSettings = useCallback(({ isEnabled: enabled }: { isEnabled: boolean }) => {
//     setIsUpdating(true);
//     setTimeout(() => {
//       setIsEnabled(enabled);
//       setIsUpdating(false);
//       toast({ title: enabled ? 'Link enabled' : 'Link disabled' });
//     }, 300);
//   }, [toast]);

//   const nativeShare = useCallback(() => {
//     if (navigator.share) {
//       navigator.share({ url: shareUrl, title: 'My Profile' });
//     }
//   }, [shareUrl]);

//   return {
//     shareSettings,
//     isLoading,
//     hasShareLink,
//     isEnabled,
//     isUpdating,
//     isRegenerating,
//     shareUrl,
//     copyToClipboard,
//     regenerateToken,
//     updateShareSettings,
//     nativeShare,
//   };
// }

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  getDashboardShare,
  createDashboardShare,
  revokeDashboardShare,
} from '@/api/payment';

const SHARE_BASE_URL = 'https://www.pichin.in';

export function useProfileShare(userId?: string | number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing share link from backend
  const {
    data: shareData,
    isLoading,
    error: shareError,
  } = useQuery({
    queryKey: ['dashboard-share', userId],
    queryFn: getDashboardShare,
    enabled: !!userId,
    retry: false,
    // 404 means no share link yet — not an error we want to surface
  });

  const isNotFound = (shareError as any)?.status === 404 ||
    (shareError as Error)?.message?.includes('404') ||
    (shareError as Error)?.message?.includes('No share link');

  const hasShareLink = !!(shareData?.is_active && shareData?.share_id);

  // Share URL built from backend's share_id + access_token
  const shareUrl = hasShareLink
    ? `${SHARE_BASE_URL}/shared/${shareData!.share_id}?access=${shareData!.access_token}`
    : '';

  const isEnabled = shareData?.is_active ?? false;

  // Create or regenerate share link (requires Pro)
  const createMutation = useMutation({
    mutationFn: (regenerate: boolean) => createDashboardShare(regenerate),
    onSuccess: (data) => {
      queryClient.setQueryData(['dashboard-share', userId], data);
      const newUrl = `${SHARE_BASE_URL}/shared/${data.share_id}?access=${data.access_token}`;
      navigator.clipboard.writeText(newUrl).then(() => {
        toast({ title: 'Link copied!', description: 'Share link copied to clipboard.' });
      }).catch(() => {
        toast({ title: 'Link generated!', description: newUrl });
      });
    },
    onError: (err: any) => {
      const isPaywall =
        err?.status === 402 ||
        err?.message?.includes('402') ||
        err?.message?.includes('Pro subscription');
      toast({
        title: isPaywall ? 'Pro required' : 'Failed to generate link',
        description: isPaywall
          ? 'Upgrade to Pro to share your profile.'
          : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Revoke share link
  const revokeMutation = useMutation({
    mutationFn: revokeDashboardShare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-share', userId] });
      toast({ title: 'Link disabled', description: 'Your share link has been revoked.' });
    },
  });

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!shareUrl) return false;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Link copied!', description: 'Profile link copied to clipboard.' });
      return true;
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
      return false;
    }
  }, [shareUrl, toast]);

  const regenerateToken = useCallback(() => {
    createMutation.mutate(true);
  }, [createMutation]);

  // Called when no share link exists yet — creates one
  const generateLink = useCallback(() => {
    createMutation.mutate(false);
  }, [createMutation]);

  const updateShareSettings = useCallback(({ isEnabled: enabled }: { isEnabled: boolean }) => {
    if (!enabled) {
      revokeMutation.mutate();
    } else {
      createMutation.mutate(false);
    }
  }, [createMutation, revokeMutation]);

  const nativeShare = useCallback(() => {
    if (navigator.share && shareUrl) {
      navigator.share({ url: shareUrl, title: 'My Profile' });
    }
  }, [shareUrl]);

  return {
    shareSettings: shareData ?? null,
    isLoading: isLoading && !isNotFound,
    hasShareLink,
    isEnabled,
    isUpdating: revokeMutation.isPending,
    isRegenerating: createMutation.isPending,
    shareUrl,
    copyToClipboard,
    regenerateToken,
    generateLink,
    updateShareSettings,
    nativeShare,
  };
}