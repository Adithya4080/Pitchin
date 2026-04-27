import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PitchCardSkeleton } from "./PitchCardSkeleton";

interface FeedSkeletonProps {
  isMobile?: boolean;
  count?: number;
}

export function FeedSkeleton({ isMobile = false, count = 3 }: FeedSkeletonProps) {
  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background"
      >
        {/* Mobile Header skeleton */}
        <div className="sticky top-0 z-50 bg-card border-b border-border/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex items-center gap-2 p-4">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        
        {/* Feed cards */}
        <div className="divide-y divide-border/40">
          {[...Array(count)].map((_, i) => (
            <PitchCardSkeleton key={i} hideBorder index={i} />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-0"
    >
      {/* Create Post Card skeleton */}
      <Card className="p-4 bg-card border-border/40 rounded-lg mb-2 hidden md:block">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <Skeleton className="flex-1 h-11 rounded-full" />
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-md" />
            ))}
          </div>
          <div className="h-8 w-px bg-border mx-2" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>
      </Card>
      
      {/* Feed Card Container */}
      <Card className="bg-card border-border/40 rounded-lg overflow-hidden">
        <div className="divide-y divide-border/40">
          {[...Array(count)].map((_, i) => (
            <PitchCardSkeleton key={i} hideBorder index={i} />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
