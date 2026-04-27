import { useState } from 'react';
import { Loader2, Check, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSendPartnerInterest, useHasSentPartnerInterest } from '@/hooks/useSendPartnerInterest';

interface EngagementCTASectionProps {
  partnerId: string;
  engagementDescription?: string | null;
  isMobile?: boolean;
  isOwnProfile?: boolean;
}

export function EngagementCTASection( { 
  partnerId, 
  engagementDescription, 
  isMobile = false,
  isOwnProfile = false,
}: EngagementCTASectionProps) {
  const sendInterest = useSendPartnerInterest();
  const { data: hasSentInterest, isLoading: checkingInterest } = useHasSentPartnerInterest(partnerId);
  const [hasSent, setHasSent] = useState(false);

  const handleSendInterest = async () => {
    await sendInterest.mutateAsync({ partnerId });
    setHasSent(true);
  };

  const isInterestSent = hasSent || hasSentInterest;

  const ctaButton = !isOwnProfile ? (
    <Button 
      className="gap-2"
      onClick={handleSendInterest}
      disabled={sendInterest.isPending || checkingInterest || isInterestSent}
    >
      {sendInterest.isPending ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
      ) : isInterestSent ? (
        <><Check className="h-4 w-4" /> Interest Sent</>
      ) : (
        <><Send className="h-4 w-4" /> Send Interest</>
      )}
    </Button>
  ) : null;

  if (isMobile) {
    return (
      <div className="w-full bg-card border-t border-border/30">
        <div className="px-4 py-4">
          <h3 className="text-sm font-bold text-foreground mb-2">Connect With Us</h3>
          {engagementDescription && (
            <p className="text-sm text-muted-foreground mb-4">{engagementDescription}</p>
          )}
          {ctaButton && <div className="w-full [&>button]:w-full">{ctaButton}</div>}
          <p className="text-[10px] text-muted-foreground text-center mt-4">
            This Ecosystem Partner profile is hosted and curated on Pitchin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-5">
        <h3 className="text-sm font-bold text-foreground mb-2">Connect With Us</h3>
        {engagementDescription && (
          <p className="text-sm text-muted-foreground mb-4">{engagementDescription}</p>
        )}
        {ctaButton}
        <p className="text-xs text-muted-foreground mt-4">
          This Ecosystem Partner profile is hosted and curated on Pitchin.
        </p>
      </CardContent>
    </Card>
  );
}