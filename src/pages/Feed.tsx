import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PitchFeed } from '@/components/PitchFeed';
import { FeedLeftSidebar } from '@/components/FeedLeftSidebar';
import { FeedRightSidebar } from '@/components/FeedRightSidebar';
import { AppLayout } from '@/components/layouts/AppLayout';
import { MobileFeedPage } from '@/components/mobile/MobileFeedPage';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { useAuth } from '@/hooks/useAuth';

export default function Feed() {
  const navigate = useNavigate();
  const {
    user,
    isOnboarded,
    isOnboardingChecked
  } = useAuth();

  // Redirect to onboarding if user is logged in but not onboarded
  useEffect(() => {
    if (user && isOnboardingChecked && isOnboarded === false) {
      navigate('/onboarding');
    }
  }, [user, isOnboarded, isOnboardingChecked, navigate]);

  return (
    <>
      {/* Mobile view - CSS-driven visibility */}
      <div className="block md:hidden">
        <MobileFeedPage />
        <BottomNavigation />
      </div>

      {/* Desktop view - CSS-driven visibility */}
      <div className="hidden md:block">
        <AppLayout showBottomNav={true}>
          <div className="container py-4 md:py-6">
            <div className="flex gap-6">
              <div className="hidden lg:block">
                <FeedLeftSidebar />
              </div>
              <div className="flex-1 min-w-0">
                <PitchFeed />
              </div>
              <div className="hidden xl:block">
                <FeedRightSidebar />
              </div>
            </div>
          </div>
        </AppLayout>
      </div>
    </>
  );
}
