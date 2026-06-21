import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Bell, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card backdrop-blur-lg border-t border-border safe-area-bottom w-full max-w-full">
      <div className="flex items-center justify-around h-16 px-1 w-full max-w-full">
        {/* First two nav items */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center flex-1 h-full min-w-[64px] touch-manipulation"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <item.icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </button>
          );
        })}

        {/* Center - Network Button (raised, matches reference design) */}
        {(() => {
          const item = navItems[2]; // Network
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center flex-1 h-full min-w-[64px] touch-manipulation"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center -mt-7"
              >
                <div
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-colors",
                    isActive ? "bg-primary" : "bg-primary/90"
                  )}
                >
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </button>
          );
        })()}

        {/* Alerts */}
        {navItems.slice(3).map((item) => {
          const isActive = location.pathname === item.path;
          const showBadge = item.path === '/notifications' && unreadCount > 0;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center flex-1 h-full min-w-[64px] touch-manipulation relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center relative"
              >
                <div className="relative">
                  <item.icon
                    className={cn(
                      "h-6 w-6 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
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
          className="flex flex-col items-center justify-center flex-1 h-full min-w-[64px] touch-manipulation"
        >
          <motion.div whileTap={{ scale: 0.9 }} className="flex flex-col items-center">
            <Avatar className="h-6 w-6 ring-2 ring-primary/20">
              <AvatarImage src={profile?.avatar ?? user?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] mt-1 font-medium text-muted-foreground">
              Profile
            </span>
          </motion.div>
        </button>
      </div>
    </nav>
  );
}