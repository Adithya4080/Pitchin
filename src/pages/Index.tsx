import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, Users, Sparkles, Rocket, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MobileLandingPage } from '@/components/mobile';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import WhoWeAre from '@/components/landing/who-we-are';
import TheProblem from '@/components/landing/the-problem';
import TheSolution from '@/components/landing/solution';
import { SiteFooter } from '@/components/landing/footer';
import Features from '@/components/landing/features';


const TUTORIAL_COMPLETED_KEY = 'pitchnet_tutorial_completed';
export default function Index() {
  const navigate = useNavigate();
  const {
    user,
    isOnboarded,
    isOnboardingChecked,
    signInWithGoogle
  } = useAuth();
  const {
    toast
  } = useToast();

  // Check if user has seen the tutorial before
  const [showTutorial, setShowTutorial] = useState<boolean | null>(null);
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    setShowTutorial(tutorialCompleted !== 'true');
  }, []);

  // Redirect authenticated users to appropriate page
  useEffect(() => {
    if (user && isOnboardingChecked) {
      // Admin user skips onboarding, goes directly to feed
      if (user.email === 'pitchin.admn@gmail.com') {
        navigate('/feed');
      } else if (isOnboarded === false) {
        navigate('/onboarding');
      } else if (isOnboarded === true) {
        navigate('/feed');
      }
    }
  }, [user, isOnboarded, isOnboardingChecked, navigate]);
  const handleGoogleSignIn = async () => {
    const {
      error
    } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    setShowTutorial(false);
  };

  // Show loading while checking tutorial status
  if (showTutorial === null) {
    return null;
  }

  // Show tutorial for first-time visitors
  if (showTutorial && !user) {
    return <OnboardingTutorial onComplete={handleTutorialComplete} />;
  }

  // Show landing page for non-logged in users only
  // Logged in users are redirected via useEffect above
  if (user) {
    return null;
  }
  return <>
      {/* Mobile Landing - Direct Login */}
      <div className="md:hidden">
        <MobileLandingPage />
      </div>
      
      {/* Desktop Landing - Full page */}
      <div className="hidden md:block">
        <DesktopLanding handleGoogleSignIn={handleGoogleSignIn} />
      </div>
    </>;
}
function DesktopLanding({
  handleGoogleSignIn
}: {
  handleGoogleSignIn: () => Promise<void>;
}) {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[10%] left-[10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-24 py-10 lg:py-16">

          {/* Left Content */}
          <div className="relative z-10 flex w-full max-w-[620px] flex-col justify-center py-8 lg:py-0">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-4xl font-medium leading-[1] tracking-tight sm:text-5xl lg:text-6xl xl:text-6xl">

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

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Pitch connects innovators, investors, and experts to turn ideas into real-world startups.
              </p>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-4">

              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full text-base font-medium"
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
                className="h-12 w-full text-base font-medium opacity-50"
                disabled
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>

                Continue with LinkedIn

                <span className="ml-2 text-xs text-muted-foreground">
                  (Coming soon)
                </span>
              </Button>

              <p className="pt-2 text-center text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <a href="#" className="underline hover:text-foreground">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Right Illustration */}
            <div className="absolute right-[-8%] top-0 w-[65%] lg:w-[58%] xl:w-[55%] h-full flex items-start justify-end pointer-events-none">
              <img
                alt="Team collaborating on ideas"
                className="
                  w-full
                  h-auto
                  object-contain
                  max-w-none
                  opacity-100
                  min-w-[500px]
                  sm:min-w-[650px]
                  md:min-w-[750px]
                  lg:min-w-[900px]
                  xl:min-w-[1050px]
                "
                src="https://fymxcszzdpennpmgnstb.supabase.co/storage/v1/object/public/post-images/platform-official-image/hero-illustration.png"
              />
            </div>
        </div>
      </section>

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
                <h3 className="text-xl font-medium tracking-tight text-foreground">
                  {f.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>
      
      {/* Features */}
      <Features />
      
      {/* Who We Are */}
        <WhoWeAre />

      {/* The Problem */}
        <TheProblem />

      {/* The Solution */}
        <TheSolution />

      {/* Stats */}

      <section className="py-10 sm:py-14">
        <div className="container">

          <div className="grid gap-10 text-center sm:grid-cols-3">

            <div>
              <div className="mb-3 flex items-center justify-center">
                <Rocket className="mr-2 h-6 w-6 text-primary" />
                <span className="font-display text-4xl font-bold flash-gradient-text">
                  24h
                </span>
              </div>

              <p className="text-muted-foreground">
                Pitch lifespan
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-center">
                <Target className="mr-2 h-6 w-6 text-primary" />
                <span className="font-display text-4xl font-bold flash-gradient-text">
                  1
                </span>
              </div>

              <p className="text-muted-foreground">
                Active pitch at a time
              </p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                <span className="font-display text-4xl font-bold flash-gradient-text">
                  ∞
                </span>
              </div>

              <p className="text-muted-foreground">
                Potential connections
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/30 py-10 sm:py-14">
        <div className="container">

          <div className="mx-auto max-w-3xl text-center">

            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Ready to pitch your idea?
            </h2>

            <p className="mt-5 text-lg text-muted-foreground">
              Join the community and see if your idea resonates.
            </p>

            <Button
              size="lg"
              className="mt-8 px-10 font-semibold shadow-glow flash-gradient text-primary-foreground"
              onClick={handleGoogleSignIn}
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>

          </div>
        </div>
      </section>

      {/* Footer */}
        <SiteFooter />
    </div>
  );
}