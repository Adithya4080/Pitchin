import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showMobileHeader?: boolean;
  showDesktopHeader?: boolean;
  showBottomNav?: boolean;
}

export function AppLayout({
  children,
  title,
  showMobileHeader = false,
  showDesktopHeader = true,
  showBottomNav = true,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      {showDesktopHeader && (
        <div className="hidden md:block">
          <Header />
        </div>
      )}

      {/* Mobile Header */}
      {showMobileHeader && <MobileHeader title={title} />}

      {/* Main Content */}
      <main className={showBottomNav ? "pb-20 md:pb-0" : ""}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
