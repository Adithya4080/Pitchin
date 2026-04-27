import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProfileSkeletonProps {
  isMobile?: boolean;
}

export function ProfileSkeleton({ isMobile = false }: ProfileSkeletonProps) {
  if (isMobile) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background"
      >
        {/* Banner skeleton */}
        <Skeleton className="h-28 w-full" />
        
        <div className="bg-card w-full px-4 pb-4">
          {/* Avatar skeleton */}
          <div className="-mt-12 mb-3">
            <Skeleton className="h-28 w-28 rounded-full border-4 border-card" />
          </div>
          
          {/* Name and role */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28" />
          </div>
          
          {/* Bio */}
          <div className="mt-3 space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-4">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <div className="flex gap-1">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 w-full bg-card py-3 border-t border-border/30">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
        
        {/* Content sections */}
        <div className="mt-1 space-y-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border-t border-border/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-4 md:py-6"
    >
      <div className="flex gap-6 max-w-6xl mx-auto">
        <div className="flex-1 min-w-0 max-w-3xl space-y-6">
          {/* Profile Header Card */}
          <Card className="overflow-hidden border-border/50">
            {/* Banner */}
            <Skeleton className="h-36 sm:h-48 w-full" />
            
            <CardContent className="pt-0 pb-6 px-6">
              {/* Avatar row */}
              <div className="flex items-end justify-between">
                <Skeleton className="-mt-16 sm:-mt-20 h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-background" />
                <div className="flex gap-2 mb-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                </div>
              </div>
              
              {/* Name, role, location */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-5 w-32" />
              </div>
              
              {/* Bio */}
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-6 pt-5 border-t border-border/50">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="text-center space-y-1">
                    <Skeleton className="h-6 w-10 mx-auto" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* About Card */}
          <Card className="border-border/50">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
          
          {/* Additional sections */}
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
