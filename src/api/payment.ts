import { apiFetch, API_BASE } from "./client";

export interface Subscription {
  tier: "free" | "pro" | "enterprise";
  status: "active" | "cancelled" | "expired" | "pending";
  current_period_start: string | null;
  current_period_end: string | null;
  is_active_pro: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardShare {
  share_id: string;
  access_token: string;
  is_active: boolean;
  expires_at: string | null;
  view_count: number;
  share_url: string;
  is_valid: boolean;
  created_at: string;
  updated_at: string;
}

export interface RazorpayOrder {
  order_id: string;
  amount: number;       // paise
  currency: string;
  key: string;          // Razorpay publishable key
}

export interface PublicSharedDashboard {
  share_id: string;
  view_count: number;
  role?: string; 
  profile: Record<string, unknown>;   // AnyProfile shape
}

// ── Payment ───────────────────────────────────────────────────────────────────

/** Create a Razorpay order. Returns the data needed to open the Razorpay checkout. */
export async function createRazorpayOrder(plan: "pro" = "pro"): Promise<RazorpayOrder> {
  return apiFetch<RazorpayOrder>("/payment/create-order/", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

/** Verify payment after Razorpay checkout completes. */
export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ detail: string }> {
  return apiFetch<{ detail: string }>("/payment/verify/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Fetch current user's subscription status. */
export async function getSubscription(): Promise<Subscription> {
  return apiFetch<Subscription>("/payment/subscription/");
}

// ── Dashboard share ───────────────────────────────────────────────────────────

/** Get the current user's share link (404 if none exists). */
export async function getDashboardShare(): Promise<DashboardShare> {
  return apiFetch<DashboardShare>("/payment/share/");
}

/** Create or re-activate a share link (requires pro). Pass regenerate=true to rotate URLs. */
export async function createDashboardShare(regenerate = false): Promise<DashboardShare> {
  return apiFetch<DashboardShare>("/payment/share/", {
    method: "POST",
    body: JSON.stringify({ regenerate }),
  });
}

/** Revoke the share link (anyone with the old URL will see a 410 Gone). */
export async function revokeDashboardShare(): Promise<void> {
  return apiFetch<void>("/payment/share/", { method: "DELETE" });
}

/**
 * Public – no auth required.
 * Fetches the shared dashboard data for rendering the SharedProfile page.
 *
 * @param shareId  UUID in the URL path
 * @param accessToken  UUID from the ?access= query param
 */
export async function getPublicSharedDashboard(
  shareId: string,
  accessToken: string
): Promise<PublicSharedDashboard> {
  // This endpoint is public — use raw fetch (no auth header needed).
  const res = await fetch(
    `${API_BASE}/payment/shared/${shareId}/?access=${accessToken}`
  );

  if (res.status === 403) throw new Error("invalid_access_token");
  if (res.status === 404) throw new Error("share_not_found");
  if (res.status === 410) throw new Error("share_revoked");

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.detail || `Request failed (${res.status})`);
  }

  return res.json();
}