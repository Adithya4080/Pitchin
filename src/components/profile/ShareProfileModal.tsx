import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Share2, RefreshCw, Link2, Check } from "lucide-react";
import { useProfileShare } from "@/hooks/useProfileShare";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShareProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function ShareProfileModal({ open, onOpenChange, userId }: ShareProfileModalProps) {
  const isMobile = useIsMobile();
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    shareSettings,
    isLoading,
    hasShareLink,
    isEnabled,
    updateShareSettings,
    regenerateToken,
    isRegenerating,
    isUpdating,
    copyToClipboard,
    nativeShare,
  } = useProfileShare(userId);

  const handleToggleVisibility = (checked: boolean) => {
    updateShareSettings({ isEnabled: checked });
  };

  const handleRegenerateClick = () => {
    if (hasShareLink) {
      setShowRegenerateConfirm(true);
    } else {
      regenerateToken();
    }
  };

  const handleConfirmRegenerate = () => {
    regenerateToken();
    setShowRegenerateConfirm(false);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (isMobile) {
      nativeShare();
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Profile Sharing
            </DialogTitle>
            <DialogDescription>
              Share your professional profile with others via a secure link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Link Visibility Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="link-visibility" className="text-sm font-medium">
                    Profile link visibility
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    When OFF, your profile will be inaccessible via share link
                  </p>
                </div>
                <Switch
                  id="link-visibility"
                  checked={isEnabled}
                  onCheckedChange={handleToggleVisibility}
                  disabled={isLoading || isUpdating || !hasShareLink}
                />
              </div>
            </div>

            <Separator />

            {/* Generate/Regenerate Link */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Share link</Label>
                <p className="text-xs text-muted-foreground">
                  {hasShareLink
                    ? "Regenerating will invalidate any previously shared links"
                    : "Generate a secure link to share your profile"}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleRegenerateClick}
                disabled={isRegenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
                {hasShareLink ? "Regenerate link" : "Generate share link"}
              </Button>
            </div>

            {/* Share Actions */}
            {hasShareLink && (
              <>
                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Share your profile</Label>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCopy}
                      disabled={!isEnabled}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? "Copied" : "Copy link"}
                    </Button>

                    {isMobile && navigator.share && (
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={handleShare}
                        disabled={!isEnabled}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    )}
                  </div>

                  {!isEnabled && (
                    <p className="text-xs text-muted-foreground text-center">
                      Enable link visibility to share your profile
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Regenerate Confirmation Dialog */}
      <AlertDialog open={showRegenerateConfirm} onOpenChange={setShowRegenerateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate share link?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a new share link and immediately invalidate your previous link. 
              Anyone with the old link will no longer be able to access your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRegenerate}>
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
