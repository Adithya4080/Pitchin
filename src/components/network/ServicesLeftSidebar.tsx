  import { Link, useLocation, useNavigate } from 'react-router-dom';
  import { useUnreadCount } from '@/hooks/useNotifications';
  import { cn } from '@/lib/utils';
  import {
    LayoutDashboard, Building2, MessageSquare, Bookmark,
    Activity, Briefcase, Users, Target, CalendarDays,
    ArrowRight, Sparkles, ChevronRight,
  } from 'lucide-react';

  const DISCOVER_NAV = [
    { label: 'Services',      icon: Briefcase,    path: '/network/services', sub: 'Find the right services' },
    { label: 'Networking',    icon: Users,         path: '/network',          sub: 'Connect & grow' },
    { label: 'Opportunities', icon: Target,        path: '/coming-soon',      sub: 'Grants, programs & more' },
    { label: 'Events',        icon: CalendarDays,  path: '/coming-soon',      sub: 'Workshops, webinars' },
    { label: 'Investment',     icon: Sparkles,      path: '/coming-soon',     sub: 'Angels & vc\'s' },
  ];

  const MY_SPACE_NAV = [
    { label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard',   sub: null,                  badgeKey: null },
    // { label: 'My Startup',  icon: Building2,        path: '/dashboard',   sub: 'Manage your profile', badgeKey: null },
    { label: 'Messages',    icon: MessageSquare,    path: '/messages',    sub: null,                  badgeKey: 'messages' },
    { label: 'Saved',       icon: Bookmark,         path: '/coming-soon', sub: 'Services & contacts', badgeKey: null },
    { label: 'My Activity', icon: Activity,         path: '/coming-soon', sub: 'Requests, meetings',  badgeKey: null },
  ];

  const ALL_NAV = [...DISCOVER_NAV, ...MY_SPACE_NAV];

  // ─── Shared helpers ───────────────────────────────────────────────────────────
  function SectionLabel({ label }: { label: string }) {
    return (
      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.12em] px-3 mb-1.5 mt-1">
        {label}
      </p>
    );
  }

  function NavItem({ icon: Icon, label, sub, path, active, badge, onClick }: {
    icon: React.ElementType; label: string; sub?: string | null;
    path: string; active: boolean; badge?: number; onClick?: () => void;
  }) {
    return (
      <Link to={path} onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group',
          active
            ? 'bg-white/90 backdrop-blur-sm text-primary shadow-sm border border-primary/15 ring-1 ring-primary/10'
            : 'text-black-600 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <span className={cn(
          'relative shrink-0 flex items-center justify-center',
          active && 'after:absolute after:inset-[-3px] after:rounded-full after:bg-gradient-to-tr after:from-primary/40 after:via-violet-400/30 after:to-primary/10 after:animate-spin after:[animation-duration:3s]'
          )}>
            <Icon
              className={cn(
                'h-4 w-4 relative z-10 transition-all duration-300',
                active
                  ? 'text-primary drop-shadow-[0_0_4px_rgba(99,102,241,0.6)]'
                  : 'text-gray-400 group-hover:text-gray-600'
              )}
              strokeWidth={1.75}
            />
        </span>
        <div className="flex-1 min-w-0">
          <p className={cn('text-[12.5px] font-semibold leading-none', active ? 'text-primary' : '')}>{label}</p>
          {sub && <p className={cn('text-[11px] mt-0.5 leading-none', active ? 'text-primary/60' : 'text-gray-400')}>{sub}</p>}
        </div>
        {badge != null && badge > 0 && (
          <span className="h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </Link>
    );
  }

  function RailItem({ icon: Icon, label, path, active, badge }: {
    icon: React.ElementType; label: string; path: string; active: boolean; badge?: number;
  }) {
    return (
      <Link to={path} title={label}
        className={cn(
          'relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 group',
          active
            ? 'bg-white/90 backdrop-blur-sm shadow-sm border border-primary/15 ring-1 ring-primary/10'
            : 'hover:bg-gray-100'
        )}
      >
        <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-700')} strokeWidth={1.75} />
        <span className={cn('text-[9px] font-bold leading-none text-center', active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600')}>
          {label.split(' ')[0]}
        </span>
        {badge != null && badge > 0 && (
          <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </Link>
    );
  }

  // ─── Hook: shared active + unread state ───────────────────────────────────────
  function useSidebarState() {
    const location = useLocation();
    const navigate = useNavigate();
    const { data: unreadCount = 0 } = useUnreadCount();

    const isActive = (path: string) => {
      if (path === '/network/services') return location.pathname.startsWith('/network/services');
      if (path === '/network') return location.pathname === '/network';
      if (path === '/dashboard') return location.pathname === '/dashboard';
      return location.pathname === path;
    };

    const activeLabel = ALL_NAV.find(n => isActive(n.path))?.label ?? 'Services';

    return { isActive, activeLabel, unreadCount, navigate };
  }

  // ─── Export 1: Mobile top bar (rendered ABOVE the flex row) ──────────────────
  export function ServicesTopBar() {
    const { isActive, activeLabel } = useSidebarState();

    return (
      <div className="lg:hidden sticky top-14 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[13px] min-w-0 flex-1">
          <span className="text-gray-400 font-medium shrink-0">Network</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
          <span className="font-bold text-gray-900 truncate">{activeLabel}</span>
        </div>
        {/* Quick nav pills on sm+ */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {DISCOVER_NAV.map(item => (
            <Link key={item.label} to={item.path}
              className={cn(
                'text-[11px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap transition-all',
                isActive(item.path)
                  ? 'bg-gray-950 text-white border-gray-950'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ─── Export 2: Sidebar column (inside flex row) ───────────────────────────────
  export function ServicesLeftSidebar() {
    const { isActive, unreadCount, navigate } = useSidebarState();

    return (
      <>
        {/* Tablet icon rail (md only) */}
        <aside className="hidden md:flex lg:hidden w-[58px] shrink-0 flex-col gap-1 sticky top-[112px] self-start max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm flex flex-col gap-0.5">
            {DISCOVER_NAV.map(item => (
              <RailItem key={item.label} icon={item.icon} label={item.label}
                path={item.path} active={isActive(item.path)} />
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm flex flex-col gap-0.5">
            {MY_SPACE_NAV.map(item => (
              <RailItem key={item.label} icon={item.icon} label={item.label}
                path={item.path} active={isActive(item.path)}
                badge={item.badgeKey === 'messages' ? unreadCount : undefined} />
            ))}
          </div>
          <button
            title="Upgrade to Premium"
            onClick={() => navigate('/coming-soon')}
            className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-gradient-to-b from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 transition-all"
          >
            <Sparkles className="h-5 w-5 text-white" strokeWidth={1.75} />
            <span className="text-[9px] font-bold text-white">Pro</span>
          </button>
        </aside>

        {/* Desktop full sidebar (lg+) */}
{/* Desktop full sidebar (lg+) */}
<aside className="w-[205px] shrink-0 hidden lg:flex flex-col gap-2 sticky top-20 self-start max-h-[calc(100vh-88px)] overflow-y-auto">
  <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.04)]">
    <SectionLabel label="Discover" />
    {DISCOVER_NAV.map(item => (
      <NavItem key={item.label} icon={item.icon} label={item.label}
        sub={item.sub} path={item.path} active={isActive(item.path)} />
    ))}

    <SectionLabel label="My Space" />
    {MY_SPACE_NAV.map(item => (
      <NavItem key={item.label} icon={item.icon} label={item.label}
        sub={item.sub} path={item.path} active={isActive(item.path)}
        badge={item.badgeKey === 'messages' ? unreadCount : undefined} />
    ))}
  </div>

  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 border border-amber-300/60 p-4 text-amber-900 shadow-sm">
    <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-300/20 pointer-events-none" />
    <p className="text-[13px] font-bold leading-snug relative">Upgrade to Premium</p>
    <p className="text-[11px] text-amber-700 mt-1 leading-snug relative">
      Boost visibility, unlock priority features and grow faster.
    </p>
    <button
      onClick={() => navigate('/coming-soon')}
      className="mt-3 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-200 to-yellow-300 text-white text-[12px] font-bold py-2 rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-colors relative shadow-sm"
    >
      Upgrade Now <ArrowRight className="h-3.5 w-3.5" />
    </button>
  </div>
</aside>
      </>
    );
  }