import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { CreatePitchModal } from './CreatePitchModal';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import {
  User,
  Users,
  Lightbulb,
  Briefcase,
  Bell,
  Building2,
  TrendingUp,
  Settings,
  Calendar,
  BarChart3,
  FolderOpen,
  Target,
  Newspaper,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

// Routes that actually exist in App.tsx
const generalNavItems: NavItem[] = [
  { label: 'Profile',       icon: User,      path: '/profile'       },
  { label: 'Network',       icon: Users,     path: '/messages'      }, // closest real route
  { label: 'Notifications', icon: Bell,      path: '/notifications' },
  { label: 'News',          icon: Newspaper, path: '/news'          },
  { label: 'Settings',      icon: Settings,  path: '/settings'      },
];

// Role-specific items — those without a real route go to /coming-soon
const roleNavItems: Record<UserRole, NavItem[]> = {
  innovator: [
    { label: 'Pitches',   icon: Lightbulb,  path: '/coming-soon' },
    { label: 'Portfolio', icon: FolderOpen, path: '/coming-soon' },
  ],
  startup: [
    { label: 'Pitches',           icon: Lightbulb,  path: '/coming-soon' },
    { label: 'Company Portfolio', icon: Building2,  path: '/coming-soon' },
  ],
  investor: [
    { label: 'Investments',  icon: TrendingUp, path: '/coming-soon' },
    { label: 'Preferences',  icon: Target,     path: '/coming-soon' },
    { label: 'Insights',     icon: BarChart3,  path: '/coming-soon' },
  ],
  consultant: [
    { label: 'Services',      icon: Briefcase, path: '/coming-soon' },
    { label: 'Appointments',  icon: Calendar,  path: '/coming-soon' },
    { label: 'Insights',      icon: BarChart3, path: '/coming-soon' },
  ],
  ecosystem_partner: [
    { label: 'Programs',  icon: FolderOpen, path: '/coming-soon' },
    { label: 'Startups',  icon: Building2,  path: '/coming-soon' },
    { label: 'Insights',  icon: BarChart3,  path: '/coming-soon' },
  ],
};

export function FeedLeftSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: userRoleData } = useUserRole(user?.id);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return (await import('@/api/profiles')).getUserProfile(user.id);
    },
    enabled: !!user?.id,
  });

  const { data: userStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { getMyPosts } = await import('@/api/feed');
      const posts = await getMyPosts();
      return {
        totalReactions: posts.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0),
        pitchCount: posts.length,
      };
    },
    enabled: !!user?.id,
  });

  const handleNavClick = (path: string) => {
    if (path === '/profile') {
      if (user?.email === 'pitchin.admn@gmail.com') {
        navigate('/admin');
      } else if (user?.id) {
        navigate(`/profile/${user.id}`);
      }
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (path === '/profile') return location.pathname.startsWith('/profile');
    return location.pathname === path;
  };

  const currentRole = (userRoleData?.role as UserRole) || 'innovator';
  const roleSpecificItems = roleNavItems[currentRole] || roleNavItems.innovator;

  return (
    <aside className="w-[20rem] shrink-0 space-y-4 sticky top-[88px] self-start max-h-[calc(100vh-88px)] overflow-y-auto">
      {/* Profile card */}
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/40">
        {/* Banner */}
        <div
          className="h-20 bg-gradient-to-r from-primary/20 to-primary/5 bg-cover bg-center"
          style={profile?.banner ? { backgroundImage: `url(${getMediaUrl(profile.banner)})` } : undefined}
        />

        <div className="px-4 pb-4">
          {/* Avatar */}
          <div className="-mt-8 mb-3">
            <Avatar
              className="h-16 w-16 border-4 border-card cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleNavClick('/profile')}
            >
              <AvatarImage src={getMediaUrl(profile?.avatar) || user?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {profile?.user_name?.charAt(0) || user?.email?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name + email */}
          <div
            className="cursor-pointer group"
            onClick={() => handleNavClick('/profile')}
          >
            <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
              {profile?.user_name || user?.full_name || 'Anonymous User'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{user?.email}</p>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-5">
            <div>
              <p className="font-bold text-sm text-primary">{userStats?.pitchCount ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">Pitches</p>
            </div>
            <div>
              <p className="font-bold text-sm text-primary">{userStats?.totalReactions ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">Reactions</p>
            </div>
          </div>

          <Separator className="my-3" />

          {/* General nav */}
          <nav className="space-y-0.5">
            {generalNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Role-specific nav */}
          {roleSpecificItems.length > 0 && (
            <>
              <Separator className="my-3" />
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 capitalize">
                {currentRole.replace('_', ' ')}
              </p>
              <nav className="space-y-0.5">
                {roleSpecificItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
      </div>

      <CreatePitchModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </aside>
  );
}