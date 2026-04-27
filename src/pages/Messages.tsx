import { AppLayout } from '@/components/layouts/AppLayout';
import { FeedLeftSidebar } from '@/components/FeedLeftSidebar';
import { FeedRightSidebar } from '@/components/FeedRightSidebar';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { MessageCircle, Sparkles } from 'lucide-react';

function ComingSoonContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-sky-400/20 blur-2xl rounded-full" />
        <div className="relative h-20 w-20 rounded-2xl bg-card border border-border/60 flex items-center justify-center shadow-sm">
          <MessageCircle className="h-10 w-10 text-sky-500" strokeWidth={1.75} />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-4">
        <Sparkles className="h-3.5 w-3.5" />
        Coming Soon
      </div>

      <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-3 max-w-md">
        Direct Messages are on the way
      </h1>

      <p className="text-muted-foreground max-w-md leading-relaxed">
        We&apos;re building a focused, distraction-free space for founders, investors and
        operators to connect privately. Real-time chat, contact requests and team
        conversations — all under one roof.
      </p>

      <p className="text-sm text-muted-foreground/80 mt-6 italic">
        Stay tuned. Something great is being crafted for you.
      </p>
    </div>
  );
}

export default function Messages() {
  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden min-h-screen bg-background">
        <MobileHeader title="Messages" />
        <main className="pb-24">
          <ComingSoonContent />
        </main>
        <BottomNavigation />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <AppLayout showBottomNav={false}>
          <div className="container py-4 md:py-6">
            <div className="flex gap-6">
              <div className="hidden lg:block">
                <FeedLeftSidebar />
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-card rounded-2xl border border-border/40 min-h-[70vh] flex items-center justify-center">
                  <ComingSoonContent />
                </div>
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
