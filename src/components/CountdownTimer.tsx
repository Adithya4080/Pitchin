import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  expiresAt: string;
  className?: string;
}

export function CountdownTimer({ expiresAt, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        return null;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) {
    return (
      <span className={cn("text-destructive font-medium text-sm", className)}>
        Expired
      </span>
    );
  }

  const isUrgent = timeLeft.hours < 1;
  const isWarning = timeLeft.hours < 6 && !isUrgent;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium",
        isUrgent && "text-countdown-urgent animate-countdown",
        isWarning && "text-countdown-warning",
        !isUrgent && !isWarning && "text-muted-foreground",
        className
      )}
    >
      <Clock className="h-3.5 w-3.5" />
      <span>
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
}
