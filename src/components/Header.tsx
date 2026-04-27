import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, HelpCircle, Home, Search, Users, Newspaper, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import pitchinLogo from '@/assets/pitchin-logo-new.png';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { NotificationList } from './NotificationList';
import { CreatePitchModal } from './CreatePitchModal';
import { OnboardingTutorial } from './OnboardingTutorial';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { useUserActivePitch } from '@/hooks/usePitches';


export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFeedPage = location.pathname === '/feed';
  const {
    user,
    signOut
  } = useAuth();
  const {
    data: unreadCount = 0
  } = useUnreadCount();
  const {
    data: activePitch
  } = useUserActivePitch();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Fetch profile from Django API
  const { data: profile } = useQuery({
    queryKey: ['header-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { getMyProfile } = await import('@/api/profiles');
      return getMyProfile();
    },
    enabled: !!user?.id,
    staleTime: 0,
  });

  const displayName = profile?.user_full_name || user?.full_name || user?.email || '?';
  const avatarUrl = profile?.avatar_url || user?.avatar_url;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const actions = (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowTutorial(true)}
        title="View Tutorial"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>

      {user ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            title="Messages"
            onClick={() => navigate('/messages')}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <NotificationList />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 ring-2 ring-border">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5 leading-none">
                  <p className="font-medium text-sm">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (user.email === 'pitchin.admn@gmail.com') {
                    navigate('/admin');
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                <User className="mr-2 h-4 w-4" />
                {user.email === 'pitchin.admn@gmail.com' ? 'Admin Panel' : 'My Pitches'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button onClick={() => navigate('/auth')} className="flash-gradient text-primary-foreground">
          Sign In
        </Button>
      )}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-card backdrop-blur supports-[backdrop-filter]:bg-card/95 hidden md:block">
        <div className="container h-16">
          <div className="flex h-full items-center gap-6">
            {/* Left column — mirrors FeedLeftSidebar (lg+) */}
            <div className="hidden lg:flex w-[22rem] shrink-0 items-center">
              <Link to="/" className="flex items-center gap-2 group">
                {isFeedPage ? (
                  <span className="font-display font-bold text-2xl tracking-tight text-sky-400">Pitchin</span>
                ) : (
                  <img src={pitchinLogo} alt="PitchIn" className="h-12" />
                )}
              </Link>
            </div>

            {/* Logo fallback below lg */}
            <Link to="/" className="lg:hidden flex items-center gap-2 group shrink-0">
              {isFeedPage ? (
                <span className="font-display font-bold text-2xl tracking-tight text-sky-400">Pitchin</span>
              ) : (
                <img src={pitchinLogo} alt="PitchIn" className="h-12" />
              )}
            </Link>

            {/* Center column — mirrors PitchFeed (flex-1) */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-9 h-10 rounded-full bg-muted border-none focus-visible:ring-1"
                />
              </div>
              <nav className="flex items-center gap-1 shrink-0">
                {[
                  { to: '/feed', label: 'Home', icon: Home, active: isFeedPage },
                  { to: '/network', label: 'Network', icon: Users, active: location.pathname === '/network' },
                  { to: '/news', label: 'News', icon: Newspaper, active: location.pathname === '/news' },
                ].map(({ to, label, icon: Icon, active }) => (
                  <Link
                    key={label}
                    to={to}
                    className={cn(
                      "flex items-center gap-1.5 px-3 h-10 rounded-full text-sm font-medium transition-colors",
                      active
                        ? "text-sky-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    aria-label={label}
                  >
                    <Icon className={cn("h-5 w-5", active && "fill-sky-400")} />
                    <span className="hidden xl:inline">{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right column — mirrors FeedRightSidebar (xl+) */}
            <div className="hidden xl:flex w-[22rem] shrink-0 items-center justify-end gap-2">
              {actions}
            </div>

            {/* Actions fallback below xl */}
            <div className="xl:hidden flex items-center gap-2 shrink-0">
              {actions}
            </div>
          </div>
        </div>
      </header>

      <CreatePitchModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      
      {/* Tutorial Overlay */}
      {showTutorial && (
        <OnboardingTutorial 
          onComplete={() => setShowTutorial(false)} 
          isOverlay 
        />
      )}
    </>
  );
}