import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Flame, Sparkles, Users, Mail, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PitchCard } from '@/components/PitchCard';
import { CreatePitchModal } from '@/components/CreatePitchModal';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { SuggestedProfilesCard } from '@/components/mobile/SuggestedProfilesCard';
import { usePitches } from '@/hooks/usePitches';
import { useSuggestedProfiles } from '@/hooks/useSuggestedProfiles';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const FEED_TABS = [
  { id: 'newest', label: 'For You', icon: Sparkles },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'following', label: 'Following', icon: Users },
] as const;

export function MobileFeedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'newest' | 'trending'>('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const { data: pitches, isLoading, error } = usePitches(
    activeTab,
    undefined
  );

  const { data : suggestedProfiles = [] } = useSuggestedProfiles();

  // Generate randomized insertion points for suggested profiles (after every 1-3 posts)
  const suggestionInsertions = useMemo(() => {
    if (!pitches?.length || !suggestedProfiles.length) return new Set<number>();
    const insertAt = new Set<number>();
    let nextInsert = 1 + Math.floor(Math.random() * 2); // first after 1-2 posts (never at top)
    const chunkSize = 5; // profiles per card
    let chunkIndex = 0;
    while (nextInsert < pitches.length && chunkIndex * chunkSize < suggestedProfiles.length) {
      insertAt.add(nextInsert);
      chunkIndex++;
      nextInsert += 2 + Math.floor(Math.random() * 2); // gap of 2-3
    }
    return insertAt;
  }, [pitches?.length, suggestedProfiles.length]);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return await (await import('@/api/profiles')).getUserProfile(user.id);
    },
    enabled: !!user?.id,
  });

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* App Bar */}
      <div className="sticky top-0 z-40 bg-card backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left - Profile Picture */}
          <button
            onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
            className="touch-manipulation"
          >
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>

          {/* Center - Logo */}
          <span className="font-display font-bold text-lg tracking-tight text-sky-400">Pitchin</span>

          {/* Right - Tutorial & Mail Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTutorial(true)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors touch-manipulation"
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => navigate('/coming-soon')}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors touch-manipulation"
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2">
          {FEED_TABS.map((tab) => {
            const actualActive = tab.id === 'newest' ? activeTab === 'newest' : 
                                tab.id === 'trending' ? activeTab === 'trending' : false;
            return (
              <button
                key={tab.id}
                onClick={() => tab.id !== 'following' && setActiveTab(tab.id as 'newest' | 'trending')}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  actualActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  tab.id === 'following' && "opacity-40"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>


      {/* Feed Content */}
      <div>
        {isLoading ? (
          <div className="divide-y divide-border/50 bg-card">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full mb-3" />
                <Skeleton className="h-48 w-full" />
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 px-4 bg-card">
            <p className="text-destructive">Failed to load pitches</p>
          </div>
        ) : pitches?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-card"
          >
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No posts yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
              Stay tuned for updates!
            </p>
            {user && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="rounded-full px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="divide-y divide-border/50 bg-card">
            <AnimatePresence mode="popLayout">
              {pitches?.map((pitch, index) => {
                const chunkIndex = Array.from(suggestionInsertions).filter(i => i <= index).length;
                const showSuggestion = suggestionInsertions.has(index);
                const profileChunk = showSuggestion
                  ? suggestedProfiles.slice((chunkIndex - 1) * 5, chunkIndex * 5)
                  : [];

                return (
                  <div key={pitch.id}>
                    {showSuggestion && profileChunk.length > 0 && (
                      <SuggestedProfilesCard profiles={profileChunk} />
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <PitchCard pitch={pitch} hideBorder />
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Action Button - Visible to all, disabled for non-admin */}
      {user && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center z-50"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      )}

      {/* Create Pitch Modal */}
      <CreatePitchModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <OnboardingTutorial 
          onComplete={() => setShowTutorial(false)} 
          isOverlay 
        />
      )}
    </div>
  );
}
