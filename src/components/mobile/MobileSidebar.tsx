// import { useNavigate, useLocation } from 'react-router-dom';
// import { useTheme } from 'next-themes';
// import {
//   Home,
//   Users,
//   Newspaper,
//   Search,
//   MessageCircle,
//   Bell,
//   User,
//   Settings as SettingsIcon,
//   LogOut,
//   Moon,
// } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { cn } from '@/lib/utils';
// import { useAuth } from '@/hooks/useAuth';
// import { useUnreadCount } from '@/hooks/useNotifications';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import { Switch } from '@/components/ui/switch';
// import { RoleBadge, type BadgeRole } from '@/components/RoleBadge';
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';

// interface SidebarNavItem {
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   path: string;
//   requiresAuth?: boolean;
// }

// const sidebarNavItems: SidebarNavItem[] = [
//   { icon: Home, label: 'Home', path: '/feed' },
//   { icon: Users, label: 'Network', path: '/network' },
//   { icon: Newspaper, label: 'News', path: '/news' },
//   { icon: Search, label: 'Search', path: '/search' },
//   { icon: MessageCircle, label: 'Messages', path: '/messages' },
//   { icon: Bell, label: 'Notifications', path: '/notifications', requiresAuth: true },
//   { icon: User, label: 'My Profile', path: '/dashboard', requiresAuth: true },
//   { icon: SettingsIcon, label: 'Settings', path: '/settings', requiresAuth: true },
// ];

// interface MobileSidebarProps {
//   trigger: React.ReactNode;
// }

// export function MobileSidebar({ trigger }: MobileSidebarProps) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, signOut } = useAuth();
//   const { theme, setTheme } = useTheme();
//   const { data: unreadCount = 0 } = useUnreadCount();

//   const { data: profile } = useQuery({
//     queryKey: ['profile', user?.id],
//     queryFn: async () => {
//       if (!user?.id) return null;
//       return await (await import('@/api/profiles')).getUserProfile(user.id);
//     },
//     enabled: !!user?.id,
//   });

//   const initials = (profile?.full_name || user?.full_name || user?.email || '?')
//     .split(' ')
//     .map((n: string) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   const handleNavClick = (item: SidebarNavItem) => {
//     if (item.requiresAuth && !user) {
//       navigate('/auth');
//       return;
//     }
//     navigate(item.path);
//   };

//   const handleSignOut = async () => {
//     await signOut();
//     navigate('/');
//   };

//   return (
//     <Sheet>
//       <SheetTrigger asChild>{trigger}</SheetTrigger>
//         <SheetContent
//             side="left"
//             className="
//                 p-0
//                 w-[88%]
//                 max-w-[320px]
//                 flex
//                 flex-col
//                 gap-0
//                 safe-area-top
//             "
//         >
//         <SheetHeader className="p-4 pb-0">
//           <SheetTitle className="sr-only">Menu</SheetTitle>
//           <span className="font-display font-bold text-xl tracking-tight text-sky-400">
//             Pitchin
//           </span>
//         </SheetHeader>

//         {/* Profile block */}
//         <div className="p-4">
//           {user ? (
//             <div className="flex items-center gap-3">
//               <Avatar className="h-14 w-14 ring-2 ring-border">
//                 <AvatarImage src={profile?.avatar ?? user?.avatar_url} />
//                 <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="min-w-0">
//                 <p className="font-semibold truncate">
//                   {profile?.full_name || user.full_name}
//                 </p>
//                 {user.role && (
//                   <RoleBadge role={user.role as BadgeRole} size="sm" className="mt-1" />
//                 )}
//               </div>
//             </div>
//           ) : (
//             <SheetClose asChild>
//               <Button className="w-full" onClick={() => navigate('/auth')}>
//                 Sign In
//               </Button>
//             </SheetClose>
//           )}
//         </div>

//         <Separator />

//         {/* Nav list */}
//         <nav className="flex-1 overflow-y-auto p-3 space-y-1">
//           {sidebarNavItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             const showBadge = item.path === '/notifications' && unreadCount > 0;

//             return (
//               <SheetClose asChild key={item.path}>
//                 <button
//                   onClick={() => handleNavClick(item)}
//                   className={cn(
//                     'relative w-full flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium transition-colors touch-manipulation',
//                     isActive
//                       ? 'bg-primary/10 text-primary'
//                       : 'text-foreground hover:bg-muted'
//                   )}
//                 >
//                   <item.icon className="h-5 w-5 shrink-0" />
//                   <span className="flex-1 text-left truncate">{item.label}</span>
//                   {showBadge && (
//                     <span className="h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
//                       {unreadCount > 9 ? '9+' : unreadCount}
//                     </span>
//                   )}
//                   {isActive && (
//                     <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-full bg-primary" />
//                   )}
//                 </button>
//               </SheetClose>
//             );
//           })}
//         </nav>

//         <Separator />

//         {/* Footer: Logout + Dark Mode */}
//         <div className="p-3 space-y-1 safe-area-bottom">
//           {user && (
//             <SheetClose asChild>
//               <button
//                 onClick={handleSignOut}
//                 className="w-full flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors touch-manipulation"
//               >
//                 <LogOut className="h-5 w-5 shrink-0" />
//                 <span>Logout</span>
//               </button>
//             </SheetClose>
//           )}

//           <div className="w-full flex items-center gap-3 h-12 px-3">
//             <Moon className="h-5 w-5 shrink-0 text-muted-foreground" />
//             <span className="flex-1 text-left text-sm font-medium text-foreground">
//               Dark Mode
//             </span>
//             <Switch
//               checked={theme === 'dark'}
//               onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
//             />
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  Home,
  Users,
  Newspaper,
  Search,
  MessageCircle,
  Bell,
  User,
  Settings as SettingsIcon,
  LogOut,
  Moon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadCount } from '@/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { RoleBadge, type BadgeRole } from '@/components/RoleBadge';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SignOutDialog } from '@/components/SignOutDialog';

interface SidebarNavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

const sidebarNavItems: SidebarNavItem[] = [
  { icon: Home, label: 'Home', path: '/feed' },
  { icon: Users, label: 'Network', path: '/network' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: Bell, label: 'Notifications', path: '/notifications', requiresAuth: true },
  { icon: User, label: 'My Profile', path: '/dashboard', requiresAuth: true },
  { icon: SettingsIcon, label: 'Settings', path: '/settings', requiresAuth: true },
];

interface MobileSidebarProps {
  trigger: React.ReactNode;
}

export function MobileSidebar({ trigger }: MobileSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: unreadCount = 0 } = useUnreadCount();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await (await import('@/api/profiles')).getUserProfile(user.id);
    },
    enabled: !!user?.id,
  });

  const initials = (profile?.full_name || user?.full_name || user?.email || '?')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleNavClick = (item: SidebarNavItem) => {
    if (item.requiresAuth && !user) {
      navigate('/auth');
      return;
    }
    navigate(item.path);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
            side="left"
            className="
                p-0
                w-[88%]
                max-w-[320px]
                flex
                flex-col
                gap-0
                safe-area-top
            "
        >
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <span className="font-display font-bold text-xl tracking-tight text-sky-400">
            Pitchin
          </span>
        </SheetHeader>

        {/* Profile block */}
        <div className="p-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 ring-2 ring-border">
                <AvatarImage src={profile?.avatar ?? user?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {profile?.full_name || user.full_name}
                </p>
                {user.role && (
                  <RoleBadge role={user.role as BadgeRole} size="sm" className="mt-1" />
                )}
              </div>
            </div>
          ) : (
            <SheetClose asChild>
              <Button className="w-full" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </SheetClose>
          )}
        </div>

        <Separator />

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const showBadge = item.path === '/notifications' && unreadCount > 0;

            return (
              <SheetClose asChild key={item.path}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'relative w-full flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium transition-colors touch-manipulation',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {showBadge && (
                    <span className="h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-full bg-primary" />
                  )}
                </button>
              </SheetClose>
            );
          })}
        </nav>

        <Separator />

        {/* Footer: Logout + Dark Mode */}
        <div className="p-3 space-y-1 safe-area-bottom">
          {user && (
            <SheetClose asChild>
              <button
                onClick={() => setShowSignOutDialog(true)}
                className="w-full flex items-center gap-3 h-12 px-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors touch-manipulation"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Logout</span>
              </button>
            </SheetClose>
          )}

          <div className="w-full flex items-center gap-3 h-12 px-3">
            <Moon className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-left text-sm font-medium text-foreground">
              Dark Mode
            </span>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>
      </SheetContent>
      <SignOutDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog} />
    </Sheet>
  );
}