import { Sparkles } from 'lucide-react';
import pitchinLogo from '@/assets/pitchin-logo-new.png';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {Header} from '@/components/Header';
import Features from '../landing/features';
import { SiteFooter } from '../landing/footer';

function LoadingSkeleton() {
  return (
    
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo skeleton */}
        <div className="flex flex-col items-center mb-10">
          <Skeleton className="h-16 w-32 rounded-2xl mb-4" />
        </div>

        {/* Tagline skeleton */}
        <div className="flex flex-col items-center mb-10">
          <Skeleton className="h-6 w-48 rounded-full mb-4" />
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-8 w-40 mb-3" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Buttons skeleton */}
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="px-6 pb-8 flex justify-center">
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

export function MobileLandingPage() {
  const { signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

return (
  
  <AnimatePresence mode="wait">
    <motion.div 
      className="min-h-screen bg-background flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">

        {/* Background Illustration */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/hero-illustration.png"
            alt="PitchIn Illustration"
            className="
              absolute
              bottom-0
              right-0
              w-[150%]
              h-[70%]
              object-cover
              object-right-bottom
              opacity-95
            "
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 px-6 pt-6 pb-8 sm:px-8">

          {/* Logo */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/logo-full.png"
              alt="PitchIn"
              className="h-12 sm:h-14 w-auto"
            />
          </motion.div>

          {/* Hero */}
          <motion.div
            className="mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >

            <h1
              className="
                font-display
                text-[42px]
                sm:text-[54px]
                leading-[0.95]
                font-medium
                tracking-tight
                text-foreground
              "
            >
              <span className="block">A Smarter</span>
              <span className="block">Ecosystem for Ideas,</span>
              <span className="block">People, and Growth.</span>
            </h1>

            <p
              className="
                mt-5
                max-w-[360px]
                text-base
                leading-8
                text-muted-foreground
              "
            >
              Pitch connects innovators, investors, and experts
              to turn ideas into real-world startups.
            </p>

          </motion.div>

          {/* Push illustration lower */}
          <div className="h-[280px] sm:h-[360px]" />

          {/* CTA */}
          <motion.div
            className="w-full max-w-md mx-auto space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >

            <Button
              variant="outline"
              size="lg"
              onClick={handleGoogleSignIn}
              className="
                w-full
                h-14
                rounded-2xl
                bg-background/95
                backdrop-blur
                border
                text-base
                font-medium
                shadow-sm
              "
            >
              <svg
                className="mr-3 h-5 w-5"
                viewBox="0 0 24 24"
              >
                {/* Google SVG */}
              </svg>

              Continue with Google
            </Button>

            <p className="text-center text-xs text-muted-foreground pt-4">
              By signing in, you agree to our{" "}
              <a href="#" className="underline underline-offset-4">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4">
                Privacy Policy
              </a>
            </p>

          </motion.div>

        </div>

      </div>
      <div>
         <Features />
      </div>
      <div>
        <SiteFooter />
      </div>

    </motion.div>
  </AnimatePresence>
);
}
