import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscription,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createDashboardShare,
  getDashboardShare,
  revokeDashboardShare,
  type Subscription,
  type DashboardShare,
} from "@/api/payment";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// ── Subscription ──────────────────────────────────────────────────────────────

export function useSubscription() {
  const { user } = useAuth();

  return useQuery<Subscription>({
    queryKey: ["subscription", user?.id],
    queryFn: getSubscription,
    enabled: !!user,
    staleTime: 60_000, // 1 minute
  });
}

/** True when the user has an active Pro or Enterprise subscription. */
export function useIsPro(): boolean {
  const { data } = useSubscription();
  return data?.is_active_pro ?? false;
}

// ── Razorpay checkout ────────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens the Razorpay payment modal and handles the full verify flow.
 * Usage:
 *   const { openCheckout, isPending } = useRazorpayCheckout();
 *   <Button onClick={() => openCheckout()}>Upgrade to Pro</Button>
 */
export function useRazorpayCheckout() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay script.");

      // 1. Create server-side order
      const order = await createRazorpayOrder("pro");

      // 2. Open Razorpay checkout modal (promise-wrapped)
      return new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          order_id: order.order_id,
          name: "PitchIn",
          description: "Pro Plan – 30 days",
          // Pre-fill user details
          prefill: {
            name: user?.full_name ?? "",
            email: user?.email ?? "",
          },
          theme: { color: "#6366f1" },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              await verifyRazorpayPayment(response);
              queryClient.invalidateQueries({ queryKey: ["subscription"] });
              toast.success("🎉 Pro plan activated! Your dashboard is now unlocked.");
              resolve();
            } catch (err: any) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("checkout_dismissed")),
          },
        });
        rzp.open();
      });
    },
    onError: (err: Error) => {
      if (err.message !== "checkout_dismissed") {
        toast.error(err.message || "Payment failed. Please try again.");
      }
    },
  });

  return {
    openCheckout: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}

// ── Dashboard share ───────────────────────────────────────────────────────────

export function useDashboardShare() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<DashboardShare | null>({
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

  const createShare = useMutation({
    mutationFn: (regenerate: boolean = false) => createDashboardShare(regenerate),
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard-share", user?.id], data);
      toast.success("Share link generated!");
    },
    onError: (err: any) => {
      if (err.message?.includes("402") || err.message?.includes("Pro subscription")) {
        toast.error("Pro plan required to share your dashboard.");
      } else {
        toast.error(err.message || "Failed to create share link.");
      }
    },
  });

  const revokeShare = useMutation({
    mutationFn: revokeDashboardShare,
    onSuccess: () => {
      queryClient.setQueryData(["dashboard-share", user?.id], null);
      toast.success("Share link revoked.");
    },
    onError: () => toast.error("Failed to revoke share link."),
  });

  return {
    share: query.data ?? null,
    isLoading: query.isLoading,
    createShare: createShare.mutate,
    isCreating: createShare.isPending,
    revokeShare: revokeShare.mutate,
    isRevoking: revokeShare.isPending,
  };
}
