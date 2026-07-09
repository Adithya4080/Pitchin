import { Header } from '@/components/Header';
import { MobileHeader } from '@/components/mobile/MobileHeader';
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
  showMobileHeader = false,
  showDesktopHeader = true,
  showBottomNav = true,
  mobileHeaderVariant = 'default',
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
      {showMobileHeader && (
        mobileHeaderVariant === 'search'
          ? <MobileSearchHeader />
          : <MobileHeader title={title} />
      )}

      {/* Main Content */}
      <main className={`md:pt-16 min-h-screen ${showBottomNav ? "pb-20 md:pb-0" : ""}`}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}