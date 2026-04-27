import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuSheetProps {
  trigger: React.ReactNode;
}

export function MobileMenuSheet({ trigger }: MobileMenuSheetProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
const initials = (user.full_name || user.email || '?')
  .split(' ')
  .map((n: string) => n[0])
  .join('')
  .toUpperCase()
  .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="sr-only">Menu</DrawerTitle>
          <div className="flex items-center gap-3 py-2">
            <Avatar className="h-12 w-12 ring-2 ring-border">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {user?.full_name ||  'User'}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DrawerHeader>

        <Separator />

        <div className="p-4 space-y-2">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-base"
              onClick={() => navigate('/dashboard')}
            >
              <User className="mr-3 h-5 w-5" />
              My Profile
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-base text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
