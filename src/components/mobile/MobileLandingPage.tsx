import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import TheProblem from '../landing/the-problem';
import { SiteFooter } from '../landing/footer';
import WhoWeAre from '../landing/who-we-are';

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="flex flex-col items-center mb-10">
          <Skeleton className="h-16 w-32 rounded-2xl mb-4" />
        </div>
        <div className="flex flex-col items-center mb-10">
          <Skeleton className="h-6 w-48 rounded-full mb-4" />
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-8 w-40 mb-3" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4 w-full max-w-sm mx-auto">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>

      <div className="px-6 pb-8 flex justify-center">
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

export function MobileLandingPage() {
  const { loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen w-full bg-background flex flex-col relative overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
        </div>

        {/* Hero section */}
        <div className="relative w-full overflow-hidden">
          {/* Background illustration — scaled responsively, never overflows */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/hero-illustration.png"
              alt="PitchIn Illustration"
              className="absolute bottom-7 right-0 w-full max-w-[480px] h-auto max-h-[100vh] object-contain object-right-bottom opacity-95"
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 px-5 sm:px-8 pt-6 pb-10">
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
                className="h-10 sm:h-14 w-auto"
              />
            </motion.div>

            {/* Hero text */}
            <motion.div
              className="mt-6 sm:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="font-display text-[32px] xs:text-[36px] sm:text-[54px] leading-[1.05] sm:leading-[0.95] font-medium tracking-tight text-foreground">
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
              </h1>

              <p className="mt-2 sm:mt-5 max-w-[320px] sm:max-w-[360px] text-sm sm:text-base leading-7 sm:leading-8 text-muted-foreground">
                Pitch connects innovators, investors, and experts
                to turn ideas into real-world startups.
              </p>
            </motion.div>

            {/* Spacer to push CTA below illustration — scales with viewport */}
            <div className="h-[80px] xs:h-[220px] sm:h-[300px]" />

            {/* CTA */}
            <motion.div
              className="w-full max-w-md mx-auto space-y-3 mt-4 sm:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              >
              <Button
                size="lg"
                onClick={() => navigate('/auth?mode=signup')}
                className="w-full h-13 sm:h-14 rounded-2xl text-sm sm:text-base font-medium shadow-sm"
              >
                Create an account
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth?mode=signin')}
                className="w-full h-13 sm:h-14 rounded-2xl bg-background/95 backdrop-blur border text-sm sm:text-base font-medium shadow-sm"
              >
                Sign in
              </Button>

              <p className="text-center text-[11px] sm:text-xs text-muted-foreground pt-3 px-2">
                By signing up, you agree to our{' '}
                <a href="#" className="underline underline-offset-4">Terms</a>{' '}
                and{' '}
                <a href="#" className="underline underline-offset-4">Privacy Policy</a>
              </p>
            </motion.div>
          </div>
        </div>
        {/* The Problem */}
        <div className="w-full overflow-hidden">
          <TheProblem />
        </div>

        {/* Footer */}
        <div className="w-full overflow-hidden">
          <SiteFooter />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}