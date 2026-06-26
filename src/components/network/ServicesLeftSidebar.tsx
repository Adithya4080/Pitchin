import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Bookmark,
  Activity,
  Briefcase,
  Users,
  Target,
  CalendarDays,
  Crown,
  ArrowRight,
} from 'lucide-react';

// ─── Nav structure matching the screenshot exactly ────────────────────────────
const MAIN_NAV = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    label: 'My Startup',
    icon: Building2,
    path: '/dashboard',
    sub: 'Manage your profile',
  },
];

const DISCOVER_NAV = [
  {
    label: 'Services',
    icon: Briefcase,
    path: '/network/services',
    sub: 'Find the right services',
  },
  {
    label: 'Networking',
    icon: Users,
    path: '/network',
    sub: 'Connect & grow',
  },
  {
    label: 'Opportunities',
    icon: Target,
    path: '/coming-soon',
    sub: 'Grants, programs & more',
  },
  {
    label: 'Events',
    icon: CalendarDays,
    path: '/coming-soon',
    sub: 'Workshops, webinars',
  },
];

const MY_SPACE_NAV = [
  {
    label: 'My Startup',
    icon: Building2,
    path: '/dashboard',
    sub: 'Manage your profile',
    badgeKey: null,
  },
  {
    label: 'Messages',
    icon: MessageSquare,
    path: '/messages',
    sub: null,
    badgeKey: 'messages',
  },
  {
    label: 'Saved',
    icon: Bookmark,
    path: '/coming-soon',
    sub: 'Saved services & contacts',
    badgeKey: null,
  },
  {
    label: 'My Activity',
    icon: Activity,
    path: '/coming-soon',
    sub: 'Requests, meetings, proposals',
    badgeKey: null,
  },
];

// ─── Nav item ─────────────────────────────────────────────────────────────────
function NavItem({
  icon: Icon,
  label,
  sub,
  path,
  active,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  sub?: string | null;
  path: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      to={path}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group',
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0',
          active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
        )}
        strokeWidth={1.75}
      />
      <div className="flex-1 min-w-0">
        <p className={cn('text-[13px] font-medium leading-none', active ? 'text-blue-600' : '')}>
          {label}
        </p>
        {sub && (
          <p className="text-[11px] text-gray-400 mt-0.5 leading-none">{sub}</p>
        )}
      </div>
      {badge != null && badge > 0 && (
        <span className="h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1 mt-1">
      {label}
    </p>
  );
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────
export function ServicesLeftSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadCount();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return (await import('@/api/profiles')).getUserProfile(user.id);
    },
    enabled: !!user?.id,
  });

  const isActive = (path: string) => {
    if (path === '/network/services') return location.pathname.startsWith('/network/services');
    if (path === '/network') return location.pathname === '/network';
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path;
  };

  const initials = (profile?.user_name || profile?.full_name || user?.full_name || user?.email || '?')
    .split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

  return (
    <aside className="w-[210px] shrink-0 hidden lg:flex flex-col gap-0 sticky top-20 self-start max-h-[calc(100vh-88px)] overflow-y-auto">

      {/* ── MAIN section ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-2 mb-3">
        <SectionLabel label="Main" />
        {MAIN_NAV.map(item => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={isActive(item.path)}
          />
        ))}
      </div>

      {/* ── DISCOVER section ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-2 mb-3">
        <SectionLabel label="Discover" />
        {DISCOVER_NAV.map(item => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            sub={item.sub}
            path={item.path}
            active={isActive(item.path)}
          />
        ))}
      </div>

      {/* ── MY SPACE section ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-2 mb-3">
        <SectionLabel label="My Space" />
        {MY_SPACE_NAV.map(item => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            sub={item.sub}
            path={item.path}
            active={isActive(item.path)}
            badge={item.badgeKey === 'messages' ? unreadCount : undefined}
          />
        ))}
      </div>

      {/* ── Upgrade to Premium card ── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
        <Crown className="h-6 w-6 text-yellow-300 mb-2" strokeWidth={1.5} />
        <p className="text-[13px] font-bold leading-snug">Upgrade to Premium</p>
        <p className="text-[11px] text-blue-100 mt-1 leading-snug">
          Unlock exclusive features, boost visibility and grow faster.
        </p>
        <button
          onClick={() => navigate('/coming-soon')}
          className="mt-3 w-full flex items-center justify-center gap-1.5 bg-white text-blue-600 text-[12px] font-semibold py-2 rounded-xl hover:bg-blue-50 transition-colors"
        >
          Upgrade Now <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}