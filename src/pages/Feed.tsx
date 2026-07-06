import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PitchFeed } from '@/components/PitchFeed';
import { FeedLeftSidebar } from '@/components/FeedLeftSidebar';
import { FeedRightSidebar } from '@/components/FeedRightSidebar';
import { AppLayout } from '@/components/layouts/AppLayout';
import { MobileFeedPage } from '@/components/mobile/MobileFeedPage';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Feed() {
  const navigate = useNavigate();
  const {
    user,
    isOnboarded,
    isOnboardingChecked
  } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user && isOnboardingChecked && isOnboarded === false) {
      navigate('/onboarding');
    }
  }, [user, isOnboarded, isOnboardingChecked, navigate]);

  // Previously both the mobile and desktop trees below were always mounted
  // (just hidden with Tailwind's `hidden`/`block` classes), which meant
  // MobileFeedPage's own usePitches() call AND PitchFeed's usePitches() call
  // both ran on every load regardless of viewport — double the component
  // tree, double the post images decoding/painting at once. Using
  // useIsMobile() here means only one tree ever mounts.
  if (isMobile) {
    return (
      <>
        <MobileFeedPage />
        <BottomNavigation />
      </>
    );
  }

  return (
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
  );
}