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
  FileText,
  Target,
  BarChart3,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const generalNavItems: NavItem[] = [
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Network', icon: Users, path: '/network' },
];

const roleNavItems: Record<UserRole, NavItem[]> = {
  innovator: [
    { label: 'Pitches', icon: Lightbulb, path: '/pitches' },
    { label: 'Portfolio', icon: FolderOpen, path: '/portfolio' },
    { label: 'Updates', icon: Bell, path: '/updates' },
  ],
  startup: [
    { label: 'Pitches', icon: Lightbulb, path: '/pitches' },
    { label: 'Company Portfolio', icon: Building2, path: '/company-portfolio' },
    { label: 'Updates', icon: Bell, path: '/updates' },
  ],
  investor: [
    { label: 'Investments', icon: TrendingUp, path: '/investments' },
    { label: 'Preferences', icon: Target, path: '/preferences' },
    { label: 'Insights', icon: BarChart3, path: '/insights' },
  ],
  consultant: [
    { label: 'Services', icon: Briefcase, path: '/services' },
    { label: 'Appointments', icon: Calendar, path: '/appointments' },
    { label: 'Insights', icon: BarChart3, path: '/insights' },
  ],
  ecosystem_partner: [
    { label: 'Programs', icon: FolderOpen, path: '/programs' },
    { label: 'Startups', icon: Building2, path: '/startups' },
    { label: 'Insights', icon: BarChart3, path: '/insights' },
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
      const profile = await (await import('@/api/profiles')).getUserProfile(user.id);
      return profile;
    },
    enabled: !!user?.id
  });

  const { data: userStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // TODO: connect to backend API
      // const totalReactions = pitches?.reduce((sum, p) => sum + (p.reaction_count || 0), 0) || 0;
      // const totalSaves = pitches?.reduce((sum, p) => sum + (p.save_count || 0), 0) || 0;
      return {
        totalReactions : 0,
        totalSaves : 0,
        pitchCount:  0,
      };
    },
    enabled: !!user?.id
  });

  const handleProfileClick = () => {
    if (user?.email === 'pitchin.admn@gmail.com') {
      navigate('/admin');
    } else if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  const currentRole = userRoleData?.role || 'innovator';
  const roleSpecificItems = roleNavItems[currentRole] || roleNavItems.innovator;

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
    if (path === '/profile') {
      return location.pathname.startsWith('/profile');
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-[22rem] shrink-0 space-y-4 sticky top-20 h-fit">
      {/* Profile Section */}
      <div className="bg-card rounded-2xl overflow-hidden">
        {/* Banner */}
        <div 
          className="h-20 bg-gradient-to-r from-primary/20 to-primary/5 bg-cover bg-center"
          style={profile?.banner_url ? { backgroundImage: `url(${profile.banner_url})` } : undefined}
        />

        <div className="px-5 pb-5">
          {/* Avatar - left aligned, overlapping banner */}
          <div className="-mt-8 mb-3">
            <Avatar 
              className="h-16 w-16 border-4 border-card cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name + email - left aligned */}
          <div className="text-left">
            <h3 
              className="font-bold text-lg leading-tight cursor-pointer hover:text-primary transition-colors"
              onClick={handleProfileClick}
            >
              {profile?.full_name || 'Anonymous User'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {user?.email}
            </p>
          </div>

          {/* Stats - left aligned, inline */}
          <div className="mt-5 flex items-center gap-6">
            <div>
              <p className="font-bold text-base text-primary">{userStats?.pitchCount || 0}</p>
              <p className="text-[11px] text-muted-foreground">Pitches</p>
            </div>
            <div>
              <p className="font-bold text-base text-primary">{userStats?.totalReactions || 0}</p>
              <p className="text-[11px] text-muted-foreground">Reactions</p>
            </div>
            <div>
              <p className="font-bold text-base text-primary">{userStats?.totalSaves || 0}</p>
              <p className="text-[11px] text-muted-foreground">Saves</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Navigation Options - simple left-aligned list */}
          <nav className="space-y-0.5">
            {generalNavItems.map((item) => (
              <div
                key={item.label}
                className="w-full flex items-center gap-3 py-2 text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {item.label}
              </div>
            ))}

            {roleSpecificItems.map((item) => (
              <div
                key={item.label}
                className="w-full flex items-center gap-3 py-2 text-sm font-medium text-muted-foreground/60 cursor-not-allowed"
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {item.label}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <CreatePitchModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </aside>
  );
}