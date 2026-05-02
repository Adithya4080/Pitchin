import { useState } from 'react';
import { Image, Video, FileText, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PitchCard } from './PitchCard';
import { CreatePitchModal } from './CreatePitchModal';
import { FeedSkeleton } from '@/components/skeletons';
import { ContentTransition, StaggeredList, StaggeredItem } from '@/components/transitions';
import { usePitches } from '@/hooks/usePitches';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Database } from '@/integrations/supabase/types';

type PitchCategory = Database['public']['Enums']['pitch_category'];

export function PitchFeed() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
  const [categoryFilter, setCategoryFilter] = useState<PitchCategory | 'all'>('all');
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: pitches, isLoading, error } = usePitches(
    sortBy,
    categoryFilter === 'all' ? undefined : categoryFilter,
  );

  // Fetch user profile for the create post area
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // TODO: connect to backend API
      // return data;
    },
    enabled: !!user?.id,
  });

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="space-y-0">
      {/* Composer + Tabs Row - Hidden on mobile */}
      {user && (
        <div className="hidden md:flex items-center gap-3 mb-3">
          {/* PostComposer Capsule */}
          <div className="flex-1 flex items-center gap-3 bg-card border border-border/40 rounded-full pl-2 pr-3 py-2 shadow-sm">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 h-9 text-left text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Start a post...
            </button>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
                <Image className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
                <Video className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
                <FileText className="h-[18px] w-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
                <Plus className="h-[18px] w-[18px]" />
              </Button>
            </div>
          </div>

          {/* Vertical separator */}
          <div className="h-8 w-px bg-border/60" />

          {/* FeedTabs Capsule */}
          <div className="flex items-center gap-1 bg-card border border-border/40 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setSortBy('newest')}
              className={cn(
                "rounded-full px-4 h-9 text-sm font-medium transition-colors",
                sortBy === 'newest'
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              For You
            </button>
            <button
              onClick={() => setSortBy('trending')}
              className={cn(
                "rounded-full px-4 h-9 text-sm font-medium transition-colors",
                sortBy === 'trending'
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Following
            </button>
          </div>
        </div>
      )}
      {/* Mobile Filter Tabs */}
      <div className="flex items-center gap-2 mb-3 md:hidden px-1">
        <Button
          variant={sortBy === 'newest' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "rounded-full px-4 h-8 text-sm font-medium",
            sortBy === 'newest' && "bg-foreground text-background"
          )}
          onClick={() => setSortBy('newest')}
        >
          For You
        </Button>
        <Button
          variant={sortBy === 'trending' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "rounded-full px-4 h-8 text-sm font-medium",
            sortBy === 'trending' && "bg-foreground text-background"
          )}
          onClick={() => setSortBy('trending')}
        >
          Following
        </Button>
      </div>

      {/* Feed Card Container */}
      <div>

        {/* Feed */}
        {isLoading ? (
          <FeedSkeleton count={3} />
        ) : error ? (
          <ContentTransition className="text-center py-12">
            <p className="text-destructive">Failed to load posts</p>
          </ContentTransition>
        ) : pitches?.length === 0 ? (
          <ContentTransition className="text-center py-16 px-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-4">
              Stay tuned for updates!
            </p>
            {user && (
              <Button onClick={() => setShowCreateModal(true)}>
                Create Post
              </Button>
            )}
          </ContentTransition>
        ) : (
          <StaggeredList className="divide-y divide-border/40">
            <div className="space-y-3">
              {pitches?.map((pitch, index) => (
                <StaggeredItem key={pitch.id}>
                  <PitchCard pitch={pitch} />
                </StaggeredItem>
              ))}
            </div>
          </StaggeredList>
        )}
      </div>

      {/* Create Pitch Modal */}
      <CreatePitchModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
}
