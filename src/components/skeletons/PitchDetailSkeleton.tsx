import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PitchDetailSkeletonProps {
  isMobile?: boolean;
}

export function PitchDetailSkeleton({ isMobile = false }: PitchDetailSkeletonProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className={isMobile ? "px-0 py-0" : "max-w-2xl mx-auto px-4 py-8"}>
        <div className={isMobile ? "space-y-0" : "space-y-4"}>
          {/* Header Card */}
          <Card className={isMobile ? "rounded-none border-x-0" : "border-border/50"}>
            {/* Cover image */}
            <Skeleton className="w-full h-48 md:h-64" />
            
            <CardContent className="p-5 space-y-4">
              {/* Badge and date */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              
              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
              </div>
              
              {/* Edit button area */}
              <Skeleton className="h-9 w-20" />
            </CardContent>
          </Card>
          
          {/* Content sections */}
          {[...Array(4)].map((_, i) => (
            <Card key={i} className={isMobile ? "rounded-none border-x-0" : "border-border/50"}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Author Card */}
          <Card className={isMobile ? "rounded-none border-x-0" : "border-border/50"}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
