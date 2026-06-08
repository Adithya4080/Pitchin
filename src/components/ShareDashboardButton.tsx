import { useState } from "react";
import { Share2, Copy, RefreshCw, Link2Off, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useIsPro, useDashboardShare, useRazorpayCheckout } from "@/hooks/useSubscription";
import { toast } from "sonner";

export function ShareDashboardButton() {
  const isPro = useIsPro();
  const { share, createShare, isCreating, revokeShare, isRevoking } = useDashboardShare();
  const { openCheckout, isPending: isCheckoutPending } = useRazorpayCheckout();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = () => {
    if (!isPro) {
      openCheckout();
      return;
    }
    setOpen(true);
    // Auto-create a link if none exists yet
    if (!share || !share.is_active) {
      createShare(false);
    }
  };

  const handleCopy = () => {
    if (!share?.share_url) return;
    navigator.clipboard.writeText(share.share_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    });
  };

  const handleRegenerate = () => {
    if (window.confirm("This will invalidate your current share link. Anyone with the old link will no longer have access. Continue?")) {
      createShare(true);
    }
  };

  const handleRevoke = () => {
    if (window.confirm("Revoking this link will make your dashboard private again. Continue?")) {
      revokeShare();
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        disabled={isCheckoutPending}
        className="gap-1.5"
      >
        <Share2 className="h-4 w-4" />
        Share Dashboard
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Share Your Dashboard
            </DialogTitle>
            <DialogDescription>
              Anyone with this link can view your full profile — no login required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {isCreating ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Generating your share link…
              </p>
            ) : share?.share_url ? (
              <>
                {/* Link preview */}
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={share.share_url}
                    className="text-xs font-mono"
                  />
                  <Button size="icon" variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => window.open(share.share_url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stats */}
                <p className="text-xs text-muted-foreground">
                  👁 {share.view_count} view{share.view_count !== 1 ? "s" : ""}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isCreating}
                    className="gap-1.5 flex-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRevoke}
                    disabled={isRevoking}
                    className="gap-1.5 flex-1 text-destructive hover:text-destructive"
                  >
                    <Link2Off className="h-3.5 w-3.5" />
                    Revoke Access
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Regenerate to rotate the link. Revoke to make it private again.
                </p>
              </>
            ) : (
              <Button
                onClick={() => createShare(false)}
                disabled={isCreating}
                className="w-full"
              >
                Generate Share Link
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
