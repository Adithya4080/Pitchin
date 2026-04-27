import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, LogOut, User, Bell, Shield, HelpCircle, 
  ChevronRight, X, Moon, Sun
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MobileSettingsSheetProps {
  trigger: React.ReactNode;
}

export function MobileSettingsSheet({ trigger }: MobileSettingsSheetProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  const handleLogout = async () => {
    try {
      // signout handled by useAuth
      toast.success('Logged out successfully');
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const menuItems = [
    {
      icon: User,
      label: 'Account',
      description: 'Manage your account settings',
      onClick: () => {},
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Configure notification preferences',
      onClick: () => navigate('/notifications'),
    },
    {
      icon: Shield,
      label: 'Privacy',
      description: 'Control your privacy settings',
      onClick: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help or contact support',
      onClick: () => {},
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-0 pb-8">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Settings</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">
                      {darkMode ? 'Currently enabled' : 'Currently disabled'}
                    </p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </motion.div>

            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 pt-4 border-t border-border/50">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Log Out</span>
            </motion.button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
