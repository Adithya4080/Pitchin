// import { useCallback, useState } from 'react';
// import { useToast } from '@/hooks/use-toast';

// export function useProfileShare(userId?: string | number) {
//   const { toast } = useToast();
//   const [isLoading] = useState(false);
//   const [isRegenerating, setIsRegenerating] = useState(false);

//   const shareUrl = userId ? `${window.location.origin}/shared/${userId}` : '';
//   const hasShareLink = !!userId;

//   const copyToClipboard = useCallback(() => {
//     navigator.clipboard.writeText(shareUrl).then(() => {
//       toast({ title: 'Link copied!', description: 'Profile link copied to clipboard.' });
//     });
//   }, [shareUrl, toast]);

//   const regenerateToken = useCallback(() => {
//     // No backend yet — just copy the existing URL
//     setIsRegenerating(true);
//     setTimeout(() => {
//       copyToClipboard();
//       setIsRegenerating(false);
//     }, 500);
//   }, [copyToClipboard]);

//   return { copyToClipboard, regenerateToken, hasShareLink, isLoading, isRegenerating, shareUrl };
// }

import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useProfileShare(userId?: string | number) {
  const { toast } = useToast();
  const [isLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shareSettings] = useState(null);

  const shareUrl = userId ? `${window.location.origin}/shared/${userId}` : '';
  const hasShareLink = !!userId;

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
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
    setIsRegenerating(true);
    setTimeout(() => {
      copyToClipboard();
      setIsRegenerating(false);
    }, 500);
  }, [copyToClipboard]);

  const updateShareSettings = useCallback(({ isEnabled: enabled }: { isEnabled: boolean }) => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsEnabled(enabled);
      setIsUpdating(false);
      toast({ title: enabled ? 'Link enabled' : 'Link disabled' });
    }, 300);
  }, [toast]);

  const nativeShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ url: shareUrl, title: 'My Profile' });
    }
  }, [shareUrl]);

  return {
    shareSettings,
    isLoading,
    hasShareLink,
    isEnabled,
    isUpdating,
    isRegenerating,
    shareUrl,
    copyToClipboard,
    regenerateToken,
    updateShareSettings,
    nativeShare,
  };
}