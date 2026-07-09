// import { useState } from 'react';
// import { Image, Video, FileText, Plus, Zap } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { PitchCard } from './PitchCard';
// import { CreatePitchModal } from './CreatePitchModal';
// import { FeedSkeleton } from '@/components/skeletons';
// import { ContentTransition, StaggeredList, StaggeredItem } from '@/components/transitions';
// import { usePitches } from '@/hooks/usePitches';
// import { useAuth } from '@/hooks/useAuth';
// import { cn } from '@/lib/utils';
// import { Database } from '@/integrations/supabase/types';

// type PitchCategory = Database['public']['Enums']['pitch_category'];

// export function PitchFeed() {
//   const { user } = useAuth();
//   const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
//   const [categoryFilter, setCategoryFilter] = useState<PitchCategory | 'all'>('all');
  
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const { data: pitches, isLoading, error } = usePitches(
//     sortBy,
//     categoryFilter === 'all' ? undefined : categoryFilter,
//   );

//   const initials = user?.full_name
//     ?.split(' ')
//     .map(n => n[0])
//     .join('')
//     .toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

//   return (
//     <div className="space-y-0">
//       {/* Composer + Tabs Row - Hidden on mobile */}
//       {user && (
//         <div className="hidden md:flex items-center gap-3 mb-3">
//           {/* PostComposer Capsule */}
//           <div className="flex-1 flex items-center gap-3 bg-card border border-border/40 rounded-full pl-2 pr-3 py-2 shadow-sm">
//             <Avatar className="h-10 w-10 shrink-0">
//               <AvatarImage
//                 src={user?.avatar_url || ""}
//               />
//               <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
//                 {initials}
//               </AvatarFallback>
//             </Avatar>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="flex-1 h-9 text-left text-muted-foreground hover:text-foreground transition-colors text-sm"
//             >
//               Start a post...
//             </button>
//             <div className="flex items-center gap-0.5">
//               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
//                 <Image className="h-[18px] w-[18px]" />
//               </Button>
//               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
//                 <Video className="h-[18px] w-[18px]" />
//               </Button>
//               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
//                 <FileText className="h-[18px] w-[18px]" />
//               </Button>
//               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => setShowCreateModal(true)}>
//                 <Plus className="h-[18px] w-[18px]" />
//               </Button>
//             </div>
//           </div>

//           {/* Vertical separator */}
//           <div className="h-8 w-px bg-border/60" />

//           {/* FeedTabs Capsule */}
//           <div className="flex items-center gap-1 bg-card border border-border/40 rounded-full p-1 shadow-sm">
//             <button
//               onClick={() => setSortBy('newest')}
//               className={cn(
//                 "rounded-full px-4 h-9 text-sm font-medium transition-colors",
//                 sortBy === 'newest'
//                   ? "bg-foreground text-background"
//                   : "text-muted-foreground hover:text-foreground"
//               )}
//             >
//               For You
//             </button>
//             <button
//               onClick={() => setSortBy('trending')}
//               className={cn(
//                 "rounded-full px-4 h-9 text-sm font-medium transition-colors",
//                 sortBy === 'trending'
//                   ? "bg-foreground text-background"
//                   : "text-muted-foreground hover:text-foreground"
//               )}
//             >
//               Following
//             </button>
//           </div>
//         </div>
//       )}
//       {/* Mobile Filter Tabs */}
//       <div className="flex items-center gap-2 mb-3 md:hidden px-1">
//         <Button
//           variant={sortBy === 'newest' ? 'default' : 'outline'}
//           size="sm"
//           className={cn(
//             "rounded-full px-4 h-8 text-sm font-medium",
//             sortBy === 'newest' && "bg-foreground text-background"
//           )}
//           onClick={() => setSortBy('newest')}
//         >
//           For You
//         </Button>
//         <Button
//           variant={sortBy === 'trending' ? 'default' : 'outline'}
//           size="sm"
//           className={cn(
//             "rounded-full px-4 h-8 text-sm font-medium",
//             sortBy === 'trending' && "bg-foreground text-background"
//           )}
//           onClick={() => setSortBy('trending')}
//         >
//           Following
//         </Button>
//       </div>

//       {/* Feed Card Container */}
//       <div>
//         {/* Feed */}
//         {isLoading ? (
//           <FeedSkeleton count={3} />
//         ) : error ? (
//           <ContentTransition className="text-center py-12">
//             <p className="text-destructive">Failed to load posts</p>
//           </ContentTransition>
//         ) : pitches?.length === 0 ? (
//           <ContentTransition className="text-center py-16 px-4">
//             <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
//               <Zap className="h-8 w-8 text-primary" />
//             </div>
//             <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
//             <p className="text-muted-foreground max-w-sm mx-auto mb-4">
//               Stay tuned for updates!
//             </p>
//             {user && (
//               <Button onClick={() => setShowCreateModal(true)}>
//                 Create Post
//               </Button>
//             )}
//           </ContentTransition>
//         ) : (
//           <StaggeredList className="divide-y divide-border/40">
//             <div className="space-y-3">
//               {pitches?.map((pitch, index) => (
//                 <StaggeredItem key={pitch.id}>
//                   <PitchCard pitch={pitch} />
//                 </StaggeredItem>
//               ))}
//             </div>
//           </StaggeredList>
//         )}
//       </div>

//       {/* Create Pitch Modal */}
//       <CreatePitchModal 
//         open={showCreateModal} 
//         onOpenChange={setShowCreateModal} 
//       />
//     </div>
//   );
// }


import { useState } from 'react';
import { Image, Video, FileText, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PitchCard } from './PitchCard';
import { CreatePitchModal } from './CreatePitchModal';
import { FeedSkeleton } from '@/components/skeletons';
import { ContentTransition, StaggeredList, StaggeredItem } from '@/components/transitions';
import { useInfinitePitches } from '@/hooks/usePitches';
import { useInView } from '@/hooks/useInView';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

type PitchCategory = Database['public']['Enums']['pitch_category'];

export function PitchFeed() {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<'newest' | 'trending'>('newest');
  const [categoryFilter, setCategoryFilter] = useState<PitchCategory | 'all'>('all');
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    pitches,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePitches(
    sortBy,
    categoryFilter === 'all' ? undefined : categoryFilter,
  );

  // Sentinel div near the bottom of the list — once it scrolls into view
  // (400px before it's actually visible) we pull in the next page of 10
  // posts, instead of ever having tried to fetch everything at once.
  const sentinelRef = useInView<HTMLDivElement>(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    { enabled: hasNextPage && !isFetchingNextPage }
  );

  const initials = user?.full_name
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
              <AvatarImage
                src={user?.avatar_url || ""}
              />
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

        {/* Infinite-scroll sentinel: invisible, just triggers fetchNextPage
            when it scrolls near the viewport. Only rendered once the first
            page has loaded and there's more to fetch. */}
        {!isLoading && !error && hasNextPage && (
          <div ref={sentinelRef} className="flex justify-center py-6">
            {isFetchingNextPage && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
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