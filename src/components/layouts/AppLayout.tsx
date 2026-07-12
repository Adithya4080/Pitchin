import { Header } from '@/components/Header';
import { MobileSearchHeader } from '@/components/mobile/MobileSearchHeader';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showMobileHeader?: boolean;
  showDesktopHeader?: boolean;
  showBottomNav?: boolean;
  /** 'default' = existing MobileHeader (avatar + title + bell).
   *  'search' = new logo + animated search bar header (Feed/Network/Alerts). */
  mobileHeaderVariant?: 'default' | 'search';
}

export function AppLayout({
  children,
  title,
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
      {<MobileSearchHeader />}

      {/* Main Content */}
      <main className={`md:pt-16 min-h-screen ${showBottomNav ? "pb-20 md:pb-0" : ""}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}