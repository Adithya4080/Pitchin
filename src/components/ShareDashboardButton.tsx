import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Share2, Copy, RefreshCw, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getDashboardShare,
  createDashboardShare,
  type DashboardShare,
} from "@/api/payment";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ShareDashboardButton() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: share } = useQuery<DashboardShare | null>({
    queryKey: ["dashboard-share", user?.id],
    queryFn: async () => {
      try {
        return await getDashboardShare();
      } catch {
        return null; // 404 → no share yet
      }
    },
    enabled: !!user,
  });

  const createShareMutation = useMutation({
    mutationFn: (regenerate: boolean) => createDashboardShare(regenerate),
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard-share", user?.id], data);
      toast.success("Share link generated!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create share link.");
    },
  });

  const isCreating = createShareMutation.isPending;

  const shareUrl = share?.share_id && share?.access_token
    ? `${window.location.origin}/shared/${share.share_id}?access=${share.access_token}`
    : null;

  const handleOpen = () => {
    setOpen(true);
    if (!share || !share.is_active) {
      createShareMutation.mutate(false);
    }
  };

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    });
  };

  const handleRegenerate = () => {
    if (window.confirm("This will invalidate your current share link. Anyone with the old link will no longer have access. Continue?")) {
      createShareMutation.mutate(true);
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleOpen()}
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl border cursor-pointer",
          "bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10",
          "px-4 py-4 sm:px-6 sm:py-6 transition-all duration-200",
          "hover:border-primary/40 hover:shadow-md hover:shadow-primary/10"
        )}
      >
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground leading-tight text-sm sm:text-base">
                Share your dashboard
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Let anyone view your full profile at the touch of a button
              </p>
            </div>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className={cn(
              "w-full sm:w-auto shrink-0 gap-2 rounded-full",
              "bg-gradient-to-r from-primary to-accent text-primary-foreground",
              "transition-transform duration-200 group-hover:scale-[1.03]"
            )}
          >
            <Share2 className="h-4 w-4" />
            Share Dashboard
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-md sm:max-w-lg p-0 gap-0 overflow-hidden">
          {/* Header with subtle gradient */}
          <div className="min-w-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
                  <Share2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </span>
                <div className="min-w-0">
                  <DialogTitle className="text-sm sm:text-base leading-tight">Share Your Dashboard</DialogTitle>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="min-w-0 space-y-4 px-4 pb-5 sm:px-6 sm:pb-6">
            {isCreating ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                <p className="text-sm text-muted-foreground">Generating your share link…</p>
              </div>
            ) : shareUrl ? (
              <>
                {/* Link preview */}
                <div className="flex w-full min-w-0 items-center gap-1.5 sm:gap-2 rounded-xl border bg-muted/40 p-2 pl-3 sm:pl-3.5">
                  <span className="block flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] sm:text-xs text-muted-foreground">
                    {shareUrl}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 hover:bg-background"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0 hover:bg-background"
                    onClick={() => window.open(shareUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={handleCopy} className="w-full gap-2 rounded-full">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>

                {/* Actions */}
                {/* <div className="flex pt-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isCreating}
                    className="gap-1.5 flex-1 text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Regenerate
                  </Button>
                </div> */}
              </>
            ) : (
              <Button
                onClick={() => createShareMutation.mutate(false)}
                disabled={isCreating}
                className="w-full rounded-full gap-2"
              >
                <Share2 className="h-4 w-4" />
                Generate Share Link
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}