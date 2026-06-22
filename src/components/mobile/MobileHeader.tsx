import { Link, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { MobileSidebar } from '@/components/mobile/MobileSidebar';

interface MobileHeaderProps {
  title?: string;
  showNotifications?: boolean;
}

export function MobileHeader({ title, showNotifications = true }: MobileHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: unreadCount = 0 } = useUnreadCount();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await (await import('@/api/profiles')).getUserProfile(user.id);
    },
    enabled: !!user?.id,
  });

  const initials = (profile?.full_name || user?.email || '?')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/95 md:hidden">
      <div className="flex h-14 items-center justify-between px-4">

        {/* Left — Avatar opens Sidebar (or Sign In for logged-out) */}
        {user ? (
          <MobileSidebar
            trigger={
              <button className="touch-manipulation flex-shrink-0">
                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                  <AvatarImage src={profile?.avatar ?? user?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />
        ) : (
          <Button
            size="sm"
            onClick={() => navigate('/auth')}
            className="text-primary-foreground text-sm h-8 px-3"
          >
            Sign In
          </Button>
        )}

        {/* Center — Page title or Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          {title ? (
            <h1 className="font-display font-semibold text-base">{title}</h1>
          ) : (
            <Link to="/feed">
              <span className="font-display font-bold text-xl tracking-tight text-sky-400">Pitchin</span>
            </Link>
          )}
        </div>

        {/* Right — Bell with unread badge */}
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

        {/* Spacer so logo stays centered when logged out */}
        {!user && <div className="w-9" />}

      </div>
    </header>
  );
}