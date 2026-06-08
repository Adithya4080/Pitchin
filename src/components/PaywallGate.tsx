import { Lock, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription, useRazorpayCheckout } from "@/hooks/useSubscription";

interface PaywallGateProps {
  children: React.ReactNode;
}

const PRO_FEATURES = [
  "Full profile dashboard with all sections",
  "Funding, Traction & Trust/Press data",
  "Team & Portfolio sections",
  "Public shareable dashboard link",
  "Priority placement in the feed",
  "Analytics & profile views",
];

export function PaywallGate({ children }: PaywallGateProps) {
  const { data: subscription, isLoading } = useSubscription();
  const { openCheckout, isPending } = useRazorpayCheckout();

  // While loading, show nothing (parent already handles skeleton)
  if (isLoading) return null;

  // User has pro – show full dashboard
  if (subscription?.is_active_pro) {
    return <>{children}</>;
  }

  // Free user – show paywall
  return (
    <div className="relative">
      {/* Blurred preview of the dashboard underneath */}
      <div className="pointer-events-none select-none filter blur-sm opacity-40 overflow-hidden max-h-96">
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="absolute inset-0 flex items-start justify-center pt-8 z-10">
        <Card className="w-full max-w-md shadow-2xl border-primary/30 bg-background">
          <CardContent className="p-8 text-center space-y-6">
            {/* Lock icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <Badge className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                Pro Feature
              </Badge>
              <h2 className="text-xl font-bold text-foreground">
                Unlock Your Full Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro to access your complete profile dashboard, share
                it publicly, and stand out to investors and partners.
              </p>
            </div>

            {/* Feature list */}
            <ul className="text-left space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-1">
              <p className="text-2xl font-bold text-foreground">
                ₹499
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Cancel anytime · Secure payment via Razorpay
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={openCheckout}
              disabled={isPending}
              className="w-full flash-gradient text-primary-foreground font-semibold"
              size="lg"
            >
              {isPending ? "Processing…" : "Upgrade to Pro – ₹499/mo"}
            </Button>

            <p className="text-xs text-muted-foreground">
              Powered by Razorpay · SSL encrypted
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
