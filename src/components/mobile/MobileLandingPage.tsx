import { Sparkles } from 'lucide-react';
import pitchinLogo from '@/assets/pitchin-logo-new.png';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {Header} from '@/components/Header';

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
          className="absolute inset-0 flex items-end justify-end pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/hero-illustration.png"
            alt="PitchIn Illustration"
            className="
              absolute
              bottom-[-20px]
              right-[-140px]
              w-[125%]
              max-w-none
              object-contain
              opacity-95
            "
          />
        </motion.div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col min-h-screen px-6 pt-8 pb-8">

          {/* Logo */}
          <motion.div 
            className="flex justify-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/logo-full.png"
              alt="PitchIn"
              className="h-16 w-auto"
            />
          </motion.div>

          {/* Hero Text */}
          <motion.div 
            className="mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >

            {/* Heading */}
            <h2 className="font-display text-[54px] leading-[0.95] font-medium tracking-tight text-foreground mb-6">

              <div className="overflow-hidden">
                <span className="typing-animation typing-animation-1 block">
                  A Smarter
                </span>
              </div>

              <div className="overflow-hidden">
                <span className="typing-animation typing-animation-2 block">
                  Ecosystem for Ideas,
                </span>
              </div>

              <div className="overflow-hidden">
                <span className="typing-animation typing-animation-3 block">
                  People, and Growth.
                </span>
              </div>

            </h2>

            {/* Description */}
            <p className="text-[16px] leading-8 text-muted-foreground max-w-[340px]">
              Pitch connects innovators, investors, and experts to turn ideas into real-world startups.
            </p>

          </motion.div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Buttons */}
          <motion.div 
            className="space-y-4 w-full pb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 text-base font-medium rounded-2xl bg-background/90 backdrop-blur border"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>

              Continue with Google
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 text-base font-medium rounded-2xl bg-background/90 backdrop-blur border opacity-60"
              disabled
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>

              Continue with LinkedIn

              <span className="ml-2 text-xs text-muted-foreground">
                (Soon)
              </span>
            </Button>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground pt-6">
              By signing in, you agree to our{' '}
              <a href="#" className="underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="underline">
                Privacy Policy
              </a>
            </p>

          </motion.div>

        </div>

      </div>

    </motion.div>
  </AnimatePresence>
);
}
