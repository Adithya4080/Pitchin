import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import TheProblem from '../landing/the-problem';
import { SiteFooter } from '../landing/footer';
import WhoWeAre from '../landing/who-we-are';
import illustration from '@/assets/hero-illustration.webp';
import icon from '@/assets/pitchin-logo-text.webp';

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
  const { loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: 'Google sign-in failed', description: 'Please try again.', variant: 'destructive' });
    }
    setGoogleLoading(false);
  };

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
          {/* Content */}
          <div className="relative z-10 px-5 sm:px-8 pt-6 pb-10">
            {/* Logo */}
            <motion.div
              className="flex justify-center pt-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={icon}
                alt="PitchIn"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={220}
                height={56}
                draggable={false}
                className="
                  h-10
                  sm:h-14
                  w-auto
                  object-contain
                  opacity-100
                  select-none
                  will-change-transform
                  [content-visibility:auto]
                "
              />
            </motion.div>

            {/* Hero text */}
            <motion.div
              className="mt-6 sm:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="font-sans text-[32px] xs:text-[36px] sm:text-[54px] leading-[1.05] sm:leading-[0.95] font-medium tracking-tight text-foreground">
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

              <p className=" sm:mt-5 max-w-[320px] sm:max-w-[360px] text-sm sm:text-base  sm:leading-8 text-muted-foreground">
                Pitch connects innovators, investors, and experts
                to turn ideas into real-world startups.
              </p>
            </motion.div>

            {/* Illustration — sits above buttons, normal flow, never overlaps */}
            <motion.div
              className="flex justify-center mt-6 sm:mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <img
                src={illustration}
                alt="Team collaborating on ideas"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="w-full max-w-[400px] sm:max-w-[380px] h-auto object-contain select-none"
              />
            </motion.div>

            {/* Spacer — small breathing room between illustration and buttons */}
            <div className="h-6 sm:h-10" />

            {/* CTA */}
            <motion.div
              className="w-full max-w-md mx-auto space-y-3 mt-4 sm:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              >
              {/* Create account + Sign in — one row */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth?mode=signup')}
                  className="flex-1 h-13 sm:h-14 rounded-2xl text-sm sm:text-base font-medium shadow-sm"
                >
                  Create account
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/auth?mode=signin')}
                  className="flex-1 h-13 sm:h-14 rounded-2xl bg-background/95 backdrop-blur border text-sm sm:text-base font-medium shadow-sm"
                >
                  Sign in
                </Button>
              </div>

              {/* Google — full width, own row underneath */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                className="w-full h-13 sm:h-14 rounded-2xl bg-background/95 backdrop-blur border text-sm sm:text-base font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? 'Signing in…' : 'Continue with Google'}
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
        {/* Features */}
        <section className="py-10 sm:py-14">
          <div className="container">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
              {[
              {
                title: "Structured Profile Creation",
                desc: "Create a clear and credible profile that showcases your ideas, goals, and expertise in a structured way, making it easier for the right people to discover and trust you."
              },
              {
                title: "Networking",
                desc: "Connect with relevant innovators, investors, startups, and experts through a focused ecosystem designed for meaningful and goal-driven interactions."
              },
              {
                title: "Execution",
                desc: "Turn ideas into reality by collaborating with the right people, accessing resources, and taking actionable steps within a supportive ecosystem."
              },
              ].map((f) => (
                <div key={f.title} className="max-w-sm">
                  <h3 className="text-xl font-medium tracking-tight text-foreground">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Footer */}
        <div className="w-full overflow-hidden">
          <SiteFooter />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}