// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';
// import { useUnreadCount } from '@/hooks/useNotifications';
// import { useQuery } from '@tanstack/react-query';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { cn } from '@/lib/utils';
// import {
//   LayoutDashboard,
//   Building2,
//   MessageSquare,
//   Bookmark,
//   Activity,
//   Briefcase,
//   Users,
//   Target,
//   CalendarDays,
//   Crown,
//   ArrowRight,
// } from 'lucide-react';

// // ─── Nav structure matching the screenshot exactly ────────────────────────────
// const MAIN_NAV = [
//   {
//     label: 'Dashboard',
//     icon: LayoutDashboard,
//     path: '/dashboard',
//   },
//   {
//     label: 'My Startup',
//     icon: Building2,
//     path: '/dashboard',
//     sub: 'Manage your profile',
//   },
// ];

// const DISCOVER_NAV = [
//   {
//     label: 'Services',
//     icon: Briefcase,
//     path: '/network/services',
//     sub: 'Find the right services',
//   },
//   {
//     label: 'Networking',
//     icon: Users,
//     path: '/network',
//     sub: 'Connect & grow',
//   },
//   {
//     label: 'Opportunities',
//     icon: Target,
//     path: '/coming-soon',
//     sub: 'Grants, programs & more',
//   },
//   {
//     label: 'Events',
//     icon: CalendarDays,
//     path: '/coming-soon',
//     sub: 'Workshops, webinars',
//   },
// ];

// const MY_SPACE_NAV = [
//   {
//     label: 'My Startup',
//     icon: Building2,
//     path: '/dashboard',
//     sub: 'Manage your profile',
//     badgeKey: null,
//   },
//   {
//     label: 'Messages',
//     icon: MessageSquare,
//     path: '/messages',
//     sub: null,
//     badgeKey: 'messages',
//   },
//   {
//     label: 'Saved',
//     icon: Bookmark,
//     path: '/coming-soon',
//     sub: 'Saved services & contacts',
//     badgeKey: null,
//   },
//   {
//     label: 'My Activity',
//     icon: Activity,
//     path: '/coming-soon',
//     sub: 'Requests, meetings, proposals',
//     badgeKey: null,
//   },
// ];

// // ─── Nav item ─────────────────────────────────────────────────────────────────
// function NavItem({
//   icon: Icon,
//   label,
//   sub,
//   path,
//   active,
//   badge,
// }: {
//   icon: React.ElementType;
//   label: string;
//   sub?: string | null;
//   path: string;
//   active: boolean;
//   badge?: number;
// }) {
//   return (
//     <Link
//       to={path}
//       className={cn(
//         'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group',
//         active
//           ? 'bg-blue-50 text-blue-600'
//           : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//       )}
//     >
//       <Icon
//         className={cn(
//           'h-[18px] w-[18px] shrink-0',
//           active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
//         )}
//         strokeWidth={1.75}
//       />
//       <div className="flex-1 min-w-0">
//         <p className={cn('text-[13px] font-medium leading-none', active ? 'text-blue-600' : '')}>
//           {label}
//         </p>
//         {sub && (
//           <p className="text-[11px] text-gray-400 mt-0.5 leading-none">{sub}</p>
//         )}
//       </div>
//       {badge != null && badge > 0 && (
//         <span className="h-5 min-w-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
//           {badge > 9 ? '9+' : badge}
//         </span>
//       )}
//     </Link>
//   );
// }

// // ─── Section label ────────────────────────────────────────────────────────────
// function SectionLabel({ label }: { label: string }) {
//   return (
//     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1 mt-1">
//       {label}
//     </p>
//   );
// }

// // ─── Main sidebar ─────────────────────────────────────────────────────────────
// export function ServicesLeftSidebar() {
//   const { user, signOut } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { data: unreadCount = 0 } = useUnreadCount();

//   const { data: profile } = useQuery({
//     queryKey: ['profile', user?.id],
//     queryFn: async () => {
//       if (!user?.id) return null;
//       return (await import('@/api/profiles')).getUserProfile(user.id);
//     },
//     enabled: !!user?.id,
//   });

//   const isActive = (path: string) => {
//     if (path === '/network/services') return location.pathname.startsWith('/network/services');
//     if (path === '/network') return location.pathname === '/network';
//     if (path === '/dashboard') return location.pathname === '/dashboard';
//     return location.pathname === path;
//   };

//   const initials = (profile?.user_name || profile?.full_name || user?.full_name || user?.email || '?')
//     .split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

//   return (
//     <aside className="w-[210px] shrink-0 hidden lg:flex flex-col gap-0 sticky top-20 self-start max-h-[calc(100vh-88px)] overflow-y-auto">

//       {/* ── MAIN section ── */}
//       <div className="bg-white border border-gray-200 rounded-xl p-2 mb-3">
//         <SectionLabel label="Main" />
//         {MAIN_NAV.map(item => (
//           <NavItem
//             key={item.label}
//             icon={item.icon}
//             label={item.label}
//             path={item.path}
//             active={isActive(item.path)}
//           />
//         ))}
//       </div>

//       {/* ── DISCOVER section ── */}
//       <div className="bg-white border border-gray-200 rounded-xl p-2 mb-3">
//         <SectionLabel label="Discover" />
//         {DISCOVER_NAV.map(item => (
//           <NavItem
//             key={item.label}
//             icon={item.icon}
//             label={item.label}
//             sub={item.sub}
//             path={item.path}
//             active={isActive(item.path)}
//           />
//         ))}
//       </div>

//       {/* ── MY SPACE section ── */}
//       <div className="bg-white border border-gray-200 rounded-xl p-2 mb-3">
//         <SectionLabel label="My Space" />
//         {MY_SPACE_NAV.map(item => (
//           <NavItem
//             key={item.label}
//             icon={item.icon}
//             label={item.label}
//             sub={item.sub}
//             path={item.path}
//             active={isActive(item.path)}
//             badge={item.badgeKey === 'messages' ? unreadCount : undefined}
//           />
//         ))}
//       </div>

//       {/* ── Upgrade to Premium card ── */}
//       <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
//         <Crown className="h-6 w-6 text-yellow-300 mb-2" strokeWidth={1.5} />
//         <p className="text-[13px] font-bold leading-snug">Upgrade to Premium</p>
//         <p className="text-[11px] text-blue-100 mt-1 leading-snug">
//           Unlock exclusive features, boost visibility and grow faster.
//         </p>
//         <button
//           onClick={() => navigate('/coming-soon')}
//           className="mt-3 w-full flex items-center justify-center gap-1.5 bg-white text-blue-600 text-[12px] font-semibold py-2 rounded-xl hover:bg-blue-50 transition-colors"
//         >
//           Upgrade Now <ArrowRight className="h-3.5 w-3.5" />
//         </button>
//       </div>
//     </aside>
//   );
// }

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUnreadCount } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Building2, MessageSquare, Bookmark,
  Activity, Briefcase, Users, Target, CalendarDays,
  ArrowRight, Sparkles, X, Menu, ChevronRight,
} from 'lucide-react';

const DISCOVER_NAV = [
  { label: 'Services',      icon: Briefcase,    path: '/network/services', sub: 'Find the right services' },
  { label: 'Networking',    icon: Users,         path: '/network',          sub: 'Connect & grow' },
  { label: 'Opportunities', icon: Target,        path: '/coming-soon',      sub: 'Grants, programs & more' },
  { label: 'Events',        icon: CalendarDays,  path: '/coming-soon',      sub: 'Workshops, webinars' },
];

const MY_SPACE_NAV = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard',   sub: null,                  badgeKey: null },
  { label: 'My Startup',  icon: Building2,        path: '/dashboard',   sub: 'Manage your profile', badgeKey: null },
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
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600')} strokeWidth={1.75} />
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

// ─── Slide-in Drawer (mobile) ─────────────────────────────────────────────────
function Drawer({ open, onClose, isActive, unreadCount, navigate }: {
  open: boolean; onClose: () => void;
  isActive: (p: string) => boolean; unreadCount: number;
  navigate: (p: string) => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />
      {/* Panel */}
      <div className={cn(
        'fixed top-0 left-0 bottom-0 z-50 w-[285px] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[15px] font-bold text-gray-900 leading-none">PitchIn</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Growth Network</p>
          </div>
          <button onClick={onClose}
            className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="bg-gray-50/80 rounded-2xl p-2">
            <SectionLabel label="Discover" />
            {DISCOVER_NAV.map(item => (
              <NavItem key={item.label} icon={item.icon} label={item.label} sub={item.sub}
                path={item.path} active={isActive(item.path)} onClick={onClose} />
            ))}
          </div>

          <div className="bg-gray-50/80 rounded-2xl p-2">
            <SectionLabel label="My Space" />
            {MY_SPACE_NAV.map(item => (
              <NavItem key={item.label} icon={item.icon} label={item.label} sub={item.sub}
                path={item.path} active={isActive(item.path)}
                badge={item.badgeKey === 'messages' ? unreadCount : undefined}
                onClick={onClose} />
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 pointer-events-none" />
            <Sparkles className="h-5 w-5 text-yellow-300 mb-2 relative" strokeWidth={1.75} />
            <p className="text-[13px] font-bold relative">Upgrade to Premium</p>
            <p className="text-[11px] text-indigo-200 mt-1 leading-snug relative">
              Boost visibility and grow faster.
            </p>
            <button
              onClick={() => { onClose(); navigate('/coming-soon'); }}
              className="mt-3 w-full flex items-center justify-center gap-1.5 bg-white text-indigo-700 text-[12px] font-bold py-2 rounded-xl hover:bg-indigo-50 transition-colors relative"
            >
              Upgrade Now <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Hook: shared active + unread state ───────────────────────────────────────
function useSidebarState() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadCount();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/network/services') return location.pathname.startsWith('/network/services');
    if (path === '/network') return location.pathname === '/network';
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path;
  };

  const activeLabel = ALL_NAV.find(n => isActive(n.path))?.label ?? 'Services';

  return { isActive, activeLabel, unreadCount, navigate, drawerOpen, setDrawerOpen };
}

// ─── Export 1: Mobile top bar (rendered ABOVE the flex row) ──────────────────
export function ServicesTopBar() {
  const { isActive, activeLabel, unreadCount, navigate, drawerOpen, setDrawerOpen } = useSidebarState();

  return (
    <>
      {/* Sticky mobile bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2.5 flex items-center gap-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="h-8 w-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>
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

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isActive={isActive}
        unreadCount={unreadCount}
        navigate={navigate}
      />
    </>
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
          className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-gradient-to-b from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 transition-all"
        >
          <Sparkles className="h-5 w-5 text-yellow-300" strokeWidth={1.75} />
          <span className="text-[9px] font-bold text-white">Pro</span>
        </button>
      </aside>

      {/* Desktop full sidebar (lg+) */}
      <aside className="w-[205px] shrink-0 hidden lg:flex flex-col gap-2 sticky top-20 self-start max-h-[calc(100vh-88px)] overflow-y-auto">
        <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
          <SectionLabel label="Discover" />
          {DISCOVER_NAV.map(item => (
            <NavItem key={item.label} icon={item.icon} label={item.label}
              sub={item.sub} path={item.path} active={isActive(item.path)} />
          ))}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-2 shadow-sm">
          <SectionLabel label="My Space" />
          {MY_SPACE_NAV.map(item => (
            <NavItem key={item.label} icon={item.icon} label={item.label}
              sub={item.sub} path={item.path} active={isActive(item.path)}
              badge={item.badgeKey === 'messages' ? unreadCount : undefined} />
          ))}
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white shadow-sm">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 pointer-events-none" />
          <Sparkles className="h-5 w-5 text-yellow-300 mb-2 relative" strokeWidth={1.75} />
          <p className="text-[13px] font-bold leading-snug relative">Upgrade to Premium</p>
          <p className="text-[11px] text-indigo-200 mt-1 leading-snug relative">
            Boost visibility, unlock priority features and grow faster.
          </p>
          <button
            onClick={() => navigate('/coming-soon')}
            className="mt-3 w-full flex items-center justify-center gap-1.5 bg-white text-indigo-700 text-[12px] font-bold py-2 rounded-xl hover:bg-indigo-50 transition-colors relative"
          >
            Upgrade Now <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
}