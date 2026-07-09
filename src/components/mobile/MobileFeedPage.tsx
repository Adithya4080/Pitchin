// import { useState, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Plus, Zap, HelpCircle } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Skeleton } from '@/components/ui/skeleton';
// import { PitchCard } from '@/components/PitchCard';
// import { CreatePitchModal } from '@/components/CreatePitchModal';
// import { SuggestedProfilesCard } from '@/components/mobile/SuggestedProfilesCard';
// import { MobileSearchHeader } from '@/components/mobile/MobileSearchHeader';
// import { usePitches } from '@/hooks/usePitches';
// import { useSuggestedProfiles } from '@/hooks/useSuggestedProfiles';
// import { useAuth } from '@/hooks/useAuth';

// export function MobileFeedPage() {
//   const { user } = useAuth();
//   const activeTab = 'newest' as const;
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showTutorial, setShowTutorial] = useState(false);

//   const { data: pitches, isLoading, error } = usePitches(
//     activeTab,
//     undefined
//   );

//   const { data : suggestedProfiles = [] } = useSuggestedProfiles();

//   // Generate randomized insertion points for suggested profiles (after every 1-3 posts)
//   const suggestionInsertions = useMemo(() => {
//     if (!pitches?.length || !suggestedProfiles.length) return new Set<number>();
//     const insertAt = new Set<number>();
//     let nextInsert = 1 + Math.floor(Math.random() * 2); // first after 1-2 posts (never at top)
//     const chunkSize = 5; // profiles per card
//     let chunkIndex = 0;
//     while (nextInsert < pitches.length && chunkIndex * chunkSize < suggestedProfiles.length) {
//       insertAt.add(nextInsert);
//       chunkIndex++;
//       nextInsert += 2 + Math.floor(Math.random() * 2); // gap of 2-3
//     }
//     return insertAt;
//   }, [pitches?.length, suggestedProfiles.length]);

//   return (
//     <div className="min-h-screen bg-background pb-24">
//       {/* App Bar */}
//       <MobileSearchHeader />


//       {/* Feed Content */}
//       <div>
//         {isLoading ? (
//           <div className="divide-y divide-border/50 bg-card">
//             {[...Array(3)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.1 }}
//                 className="p-4"
//               >
//                 <div className="flex items-start gap-3 mb-3">
//                   <Skeleton className="h-12 w-12 rounded-full" />
//                   <div className="space-y-2 flex-1">
//                     <Skeleton className="h-4 w-32" />
//                     <Skeleton className="h-3 w-20" />
//                   </div>
//                 </div>
//                 <Skeleton className="h-20 w-full mb-3" />
//                 <Skeleton className="h-48 w-full" />
//               </motion.div>
//             ))}
//           </div>
//         ) : error ? (
//           <div className="text-center py-12 px-4 bg-card">
//             <p className="text-destructive">Failed to load pitches</p>
//           </div>
//         ) : pitches?.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="text-center py-16 px-6 bg-card"
//           >
//             <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
//               <Zap className="h-10 w-10 text-primary" />
//             </div>
//             <h3 className="font-display text-xl font-semibold text-foreground mb-2">
//               No posts yet
//             </h3>
//             <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
//               Stay tuned for updates!
//             </p>
//             {user && (
//               <Button 
//                 onClick={() => setShowCreateModal(true)}
//                 className="rounded-full px-6"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Post
//               </Button>
//             )}
//           </motion.div>
//         ) : (
//           <div className="divide-y divide-border/50 bg-card">
//             <AnimatePresence mode="popLayout">
//               {pitches?.map((pitch, index) => {
//                 const chunkIndex = Array.from(suggestionInsertions).filter(i => i <= index).length;
//                 const showSuggestion = suggestionInsertions.has(index);
//                 const profileChunk = showSuggestion
//                   ? suggestedProfiles.slice((chunkIndex - 1) * 5, chunkIndex * 5)
//                   : [];

//                 return (
//                   <div key={pitch.id}>
//                     {showSuggestion && profileChunk.length > 0 && (
//                       <SuggestedProfilesCard profiles={profileChunk} />
//                     )}
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ delay: index * 0.03 }}
//                     >
//                       <PitchCard pitch={pitch} hideBorder />
//                     </motion.div>
//                   </div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>

//       {/* Floating Action Button - Visible to all, disabled for non-admin */}
//       {user && (
//         <motion.button
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setShowCreateModal(true)}
//           className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center z-50"
//         >
//           <Plus className="h-6 w-6" />
//         </motion.button>
//       )}

//       {/* Create Pitch Modal */}
//       <CreatePitchModal 
//         open={showCreateModal} 
//         onOpenChange={setShowCreateModal} 
//       />
//     </div>
//   );
// }


import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PitchCard } from '@/components/PitchCard';
import { CreatePitchModal } from '@/components/CreatePitchModal';
import { SuggestedProfilesCard } from '@/components/mobile/SuggestedProfilesCard';
import { MobileSearchHeader } from '@/components/mobile/MobileSearchHeader';
import { useInfinitePitches } from '@/hooks/usePitches';
import { useInView } from '@/hooks/useInView';
import { useSuggestedProfiles } from '@/hooks/useSuggestedProfiles';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function MobileFeedPage() {
  const { user } = useAuth();
  const activeTab = 'newest' as const;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const {
    pitches,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePitches(activeTab, undefined);

  const sentinelRef = useInView<HTMLDivElement>(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    { enabled: hasNextPage && !isFetchingNextPage }
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* App Bar */}
      <MobileSearchHeader />


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

        {!isLoading && !error && hasNextPage && (
          <div ref={sentinelRef} className="flex justify-center py-6 bg-card">
            {isFetchingNextPage && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
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
    </div>
  );
}