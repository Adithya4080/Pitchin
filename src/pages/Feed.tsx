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

  useEffect(() => {
    if (user && isOnboardingChecked && isOnboarded === false) {
      navigate('/onboarding');
    }
  }, [user, isOnboarded, isOnboardingChecked, navigate]);

  return (
    <>
      {/* Mobile view */}
      <div className="block md:hidden">
        <MobileFeedPage />
        <BottomNavigation />
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <AppLayout showBottomNav={true}>
          <div className="container py-4 md:py-6">
            <div className="flex gap-6 items-start">

              {/* Left sidebar — sticky */}
              <div className="hidden lg:block sticky top-[88px] self-start">
                <FeedLeftSidebar />
              </div>

              {/* Center feed — scrolls normally */}
              <div className="flex-1 min-w-0">
                <PitchFeed />
              </div>

              {/* Right sidebar — sticky */}
              <div className="hidden xl:block sticky top-[88px] self-start">
                <FeedRightSidebar />
              </div>

            </div>
          </div>
        </AppLayout>
      </div>
    </>
  );
}