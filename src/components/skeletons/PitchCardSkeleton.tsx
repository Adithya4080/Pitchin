import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PitchCardSkeletonProps {
  hideBorder?: boolean;
  index?: number;
}

export function PitchCardSkeleton({ hideBorder = false, index = 0 }: PitchCardSkeletonProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn("py-4 px-4 bg-card", !hideBorder && "rounded-lg border border-border")}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      
      {/* Content */}
      <div className="mb-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Image placeholder - shown randomly */}
      {index % 2 === 0 && (
        <Skeleton className="w-full h-48 rounded-lg mb-3" />
      )}
      
      {/* Stats row */}
      <div className="flex items-center justify-between py-2 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Action bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-10 rounded-md" />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>
    </motion.div>
  );
}
