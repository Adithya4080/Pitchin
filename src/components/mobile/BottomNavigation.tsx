import { useNavigate, useLocation } from 'react-router-dom';
// import { Home, Search, Bell, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Search, Bell, Users, type LucideIcon } from 'lucide-react';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/feed' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Users, label: 'Network', path: '/network' },
  { icon: Bell, label: 'Alerts', path: '/notifications', requiresAuth: true },
];

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  const handleAvatarClick = () => {
    navigate(user ? '/dashboard' : '/auth');
  };

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !user) {
      navigate('/auth');
      return;
    }
    navigate(item.path);
  };

  const allItems = [...navItems];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pointer-events-none">
      <div className="liquid-glass pointer-events-auto mx-auto flex max-w-md items-center justify-around rounded-full px-2 py-2">
        {allItems.map((item) => {
          const isActive = location.pathname === item.path;
          const showBadge = item.path === '/notifications' && unreadCount > 0;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              aria-label={item.label}
              className="relative flex h-12 min-w-[56px] flex-1 touch-manipulation items-center justify-center"
            >
              {isActive && (
                <motion.div
                  layoutId="liquid-nav-active"
                  className="liquid-glass-active absolute inset-0 rounded-full"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 480, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="relative flex flex-col items-center justify-center gap-0.5"
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      'h-[22px] w-[22px] transition-colors duration-200',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground ring-2 ring-background">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium leading-none transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </button>
          );
        })}

        {/* Profile avatar */}
        <button
          onClick={handleAvatarClick}
          aria-label="Profile"
          className="relative flex h-12 min-w-[56px] flex-1 touch-manipulation items-center justify-center"
        >
          <motion.div
            whileTap={{ scale: 0.88 }}
            className="flex flex-col items-center justify-center gap-0.5"
          >
            <Avatar className="h-[22px] w-[22px] ring-2 ring-primary/25">
              <AvatarImage src={profile?.avatar ?? user?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-[8px] font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-medium leading-none text-muted-foreground">
              Profile
            </span>
          </motion.div>
        </button>
      </div>
    </nav>
  );
}