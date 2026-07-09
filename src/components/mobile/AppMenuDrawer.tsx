import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard, Building2, MessageSquare, Bookmark,
  Activity, Briefcase, Users, Target, CalendarDays,
  ArrowRight, Sparkles, X, LogOut, Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Switch } from '@/components/ui/switch';

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
          />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13px] font-semibold truncate">{label}</span>
        {sub && <span className="block text-[11px] text-gray-400 truncate">{sub}</span>}
      </span>
      {!!badge && (
        <span className="h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}

interface AppMenuDrawerProps {
  trigger: React.ReactNode;
}

/**
 * Shared slide-in menu drawer — same panel/backdrop animation and Discover
 * / My Space nav content that used to live only in the Network page's own
 * hamburger, now available everywhere via the header hamburger. Also keeps
 * the Logout + Dark Mode footer that used to live in MobileSidebar.
 */
export function AppMenuDrawer({ trigger }: AppMenuDrawerProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: unreadCount = 0 } = useUnreadCount();

  const isActive = (path: string) => {
    if (path === '/network/services') return location.pathname.startsWith('/network/services');
    if (path === '/network') return location.pathname === '/network';
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path;
  };

  const close = () => setOpen(false);

  const handleSignOut = async () => {
    close();
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={close}
            className={cn(
              'fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300',
              open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
          />
          {/* Panel */}
          <div className={cn(
            'fixed top-0 left-0 bottom-0 z-[101] w-[285px] h-[100dvh] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
            open ? 'translate-x-0' : '-translate-x-full'
          )}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <p className="text-[15px] font-bold text-gray-900 leading-none">PitchIn</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Growth Network</p>
              </div>
              <button onClick={close}
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
                    path={item.path} active={isActive(item.path)} onClick={close} />
                ))}
              </div>

              <div className="bg-gray-50/80 rounded-2xl p-2">
                <SectionLabel label="My Space" />
                {MY_SPACE_NAV.map(item => (
                  <NavItem key={item.label} icon={item.icon} label={item.label} sub={item.sub}
                    path={item.path} active={isActive(item.path)}
                    badge={item.badgeKey === 'messages' ? unreadCount : undefined}
                    onClick={close} />
                ))}
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 border border-amber-300/60 p-4 text-amber-900">
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-300/20 pointer-events-none" />
                <Sparkles className="h-5 w-5 text-amber-500 mb-2 relative" strokeWidth={1.75} />
                <p className="text-[13px] font-bold relative">Upgrade to Premium</p>
                <p className="text-[11px] text-amber-700 mt-1 leading-snug relative">
                  Boost visibility and grow faster.
                </p>
                <button
                  onClick={() => { close(); navigate('/coming-soon'); }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[12px] font-bold py-2 rounded-xl hover:from-amber-500 hover:to-yellow-600 transition-colors relative shadow-sm"
                >
                  Upgrade Now <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Footer: Logout + Dark Mode (kept from the old header sidebar) */}
            <div className="p-3 space-y-1 border-t border-gray-100 shrink-0">
              {user && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 h-11 px-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors touch-manipulation"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span>Logout</span>
                </button>
              )}

              <div className="w-full flex items-center gap-3 h-11 px-3">
                <Moon className="h-5 w-5 shrink-0 text-gray-400" />
                <span className="flex-1 text-left text-sm font-medium text-gray-900">
                  Dark Mode
                </span>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}