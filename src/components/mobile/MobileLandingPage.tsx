import { Sparkles } from 'lucide-react';
import pitchinLogo from '@/assets/pitchin-logo-new.png';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="flex-1 flex flex-col justify-center px-6 py-12">
          {/* Logo and Brand */}
          <motion.div 
            className="flex flex-col items-center mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={pitchinLogo} alt="PitchIn" className="h-28 mb-4" />
          </motion.div>

          {/* Tagline */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Ideas that spark connections
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
              Share your idea.
              <br />
              <span className="flash-gradient-text">Connect.</span> Make it count.
            </h2>
            <p className="text-muted-foreground text-sm px-4">
              Post your pitch, connect with like-minded people, and make things happen.
            </p>
          </motion.div>

          {/* Auth Buttons */}
          <motion.div 
            className="space-y-4 w-full max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full h-14 text-base font-medium rounded-xl border-2"
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
              className="w-full h-14 text-base font-medium opacity-50 rounded-xl border-2" 
              disabled
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
              <span className="ml-2 text-xs text-muted-foreground">(Soon)</span>
            </Button>
          </motion.div>
        </div>

      {/* Bottom illustration - subtle monochrome */}
      <div className="absolute bottom-0 left-0 right-0 -z-5 pointer-events-none overflow-hidden" style={{ height: '45%' }}>
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax meet"
          style={{ opacity: 0.08 }}
        >
          {/* Fade mask - transparent top, visible bottom */}
          <defs>
            <linearGradient id="fadeUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="40%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            <mask id="fadeMask">
              <rect width="400" height="300" fill="url(#fadeUp)" />
            </mask>
          </defs>
          <g mask="url(#fadeMask)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
            {/* City skyline at bottom */}
            <rect x="10" y="250" width="25" height="50" rx="2" />
            <rect x="15" y="255" width="4" height="5" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="22" y="255" width="4" height="5" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="15" y="263" width="4" height="5" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="22" y="263" width="4" height="5" rx="0.5" fill="currentColor" opacity="0.3" />

            <rect x="40" y="230" width="20" height="70" rx="2" />
            <rect x="44" y="235" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="50" y="235" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="44" y="243" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="50" y="243" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="44" y="251" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />

            <rect x="65" y="260" width="18" height="40" rx="2" />
            <rect x="69" y="264" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="76" y="264" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />

            {/* Taller building right side */}
            <rect x="340" y="235" width="22" height="65" rx="2" />
            <rect x="344" y="240" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="351" y="240" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="344" y="248" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />
            <rect x="351" y="248" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />

            <rect x="367" y="255" width="18" height="45" rx="2" />
            <rect x="371" y="259" width="3" height="4" rx="0.5" fill="currentColor" opacity="0.3" />

            <rect x="390" y="268" width="12" height="32" rx="2" />

            {/* Rocket launching from center-right */}
            <g transform="translate(310, 170) rotate(-15)">
              <path d="M0 30 L6 0 L12 30 Z" />
              <path d="M0 30 L-4 38 L4 32 Z" fill="currentColor" opacity="0.2" />
              <path d="M12 30 L16 38 L8 32 Z" fill="currentColor" opacity="0.2" />
              {/* Flame */}
              <path d="M4 32 Q6 42 6 46 Q6 42 8 32" strokeWidth="1" opacity="0.5" />
              <path d="M5 34 Q6 40 7 34" strokeWidth="0.8" opacity="0.3" />
            </g>

            {/* Exhaust trail */}
            <circle cx="313" cy="210" r="3" opacity="0.15" fill="currentColor" />
            <circle cx="316" cy="222" r="4" opacity="0.1" fill="currentColor" />
            <circle cx="312" cy="236" r="5" opacity="0.07" fill="currentColor" />

            {/* Founders discussing ideas - left group */}
            <g transform="translate(100, 220)">
              {/* Person 1 */}
              <circle cx="0" cy="0" r="6" />
              <path d="M0 6 L0 22" />
              <path d="M0 10 L-8 16" />
              <path d="M0 10 L7 14" />
              <path d="M0 22 L-6 35" />
              <path d="M0 22 L6 35" />
              {/* Person 2 */}
              <circle cx="28" cy="-2" r="6" />
              <path d="M28 4 L28 20" />
              <path d="M28 8 L20 14" />
              <path d="M28 8 L36 12" />
              <path d="M28 20 L22 33" />
              <path d="M28 20 L34 33" />
              {/* Idea lightbulb between them */}
              <circle cx="14" cy="-12" r="5" opacity="0.4" />
              <path d="M12 -7 L12 -4" strokeWidth="0.8" opacity="0.3" />
              <path d="M16 -7 L16 -4" strokeWidth="0.8" opacity="0.3" />
              <path d="M12 -4 L16 -4" strokeWidth="0.8" opacity="0.3" />
              {/* Rays */}
              <path d="M14 -18 L14 -20" strokeWidth="0.8" opacity="0.3" />
              <path d="M8 -14 L6 -16" strokeWidth="0.8" opacity="0.3" />
              <path d="M20 -14 L22 -16" strokeWidth="0.8" opacity="0.3" />
            </g>

            {/* Gears - center bottom */}
            <g transform="translate(200, 260)">
              <circle cx="0" cy="0" r="14" strokeDasharray="4 3" />
              <circle cx="0" cy="0" r="5" />
              <circle cx="22" cy="-10" r="10" strokeDasharray="3 2.5" />
              <circle cx="22" cy="-10" r="3.5" />
              <circle cx="-8" cy="-22" r="7" strokeDasharray="2.5 2" />
              <circle cx="-8" cy="-22" r="2.5" />
            </g>

            {/* Network connection nodes */}
            <circle cx="160" cy="195" r="3" fill="currentColor" opacity="0.3" />
            <circle cx="240" cy="190" r="3" fill="currentColor" opacity="0.3" />
            <circle cx="270" cy="215" r="2.5" fill="currentColor" opacity="0.3" />
            <circle cx="145" cy="225" r="2" fill="currentColor" opacity="0.3" />
            <circle cx="260" cy="245" r="2.5" fill="currentColor" opacity="0.3" />
            <circle cx="180" cy="240" r="2" fill="currentColor" opacity="0.3" />

            {/* Connection lines */}
            <line x1="160" y1="195" x2="240" y2="190" opacity="0.2" />
            <line x1="240" y1="190" x2="270" y2="215" opacity="0.2" />
            <line x1="160" y1="195" x2="145" y2="225" opacity="0.2" />
            <line x1="270" y1="215" x2="260" y2="245" opacity="0.2" />
            <line x1="145" y1="225" x2="180" y2="240" opacity="0.2" />
            <line x1="180" y1="240" x2="260" y2="245" opacity="0.2" />
            <line x1="240" y1="190" x2="260" y2="245" opacity="0.15" />

            {/* Small floating elements on sides */}
            <circle cx="5" cy="200" r="2" fill="currentColor" opacity="0.15" />
            <circle cx="395" cy="210" r="2" fill="currentColor" opacity="0.15" />
            <path d="M388 185 L392 180 L396 185" opacity="0.15" />
            <path d="M8 175 L12 170 L16 175" opacity="0.15" />
          </g>
        </svg>
      </div>

      {/* Footer */}
      <motion.div 
        className="px-6 pb-8 text-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="#" className="underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
}
