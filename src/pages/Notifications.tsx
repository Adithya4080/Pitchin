import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NotificationList } from '@/components/NotificationList';
import { AppLayout } from '@/components/layouts/AppLayout';
import { MobileNotificationsPage, BottomNavigation } from '@/components/mobile';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Notifications() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <AppLayout showBottomNav={true}>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  // Mobile view
  if (isMobile) {
    return (
      <>
        <MobileNotificationsPage />
        <BottomNavigation />
      </>
    );
  }

  return (
    <AppLayout showBottomNav={true}>
      <div className="container py-4 md:py-6">
        {/* Desktop back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 hidden md:inline-flex text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-display font-bold mb-4 hidden md:block">
            Notifications
          </h1>

          <Card className="border-border/50 overflow-hidden">
            <NotificationList />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
