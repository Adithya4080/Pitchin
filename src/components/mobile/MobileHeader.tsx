import { Link, useNavigate } from 'react-router-dom';
import { Bell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';

interface MobileHeaderProps {
  title?: string;
  showNotifications?: boolean;
}

export function MobileHeader({ title, showNotifications = true }: MobileHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/95 md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <span className="font-display font-bold text-xl tracking-tight text-sky-400">Pitchin</span>
        </Link>

        {/* Title (optional) */}
        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 font-display font-semibold text-base">
            {title}
          </h1>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user && showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          )}
          {!user && (
            <Button
              size="sm"
              onClick={() => navigate('/auth')}
              className="flash-gradient text-primary-foreground text-sm h-8 px-3"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
