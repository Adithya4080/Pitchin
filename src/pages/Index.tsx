import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, Users, Sparkles, Rocket, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { MobileLandingPage } from '@/components/mobile';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import heroIllustration from '@/assets/hero-illustration.png';
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
  return <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Auth */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center px-[90px]">
            {/* Left side - Auth Form */}
            <div className="max-w-md mx-auto lg:mx-0 w-full">
              <div className="space-y-8 px-[40px]">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
                    <Sparkles className="h-4 w-4" />
                    Ideas that spark connections
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 animate-fade-in [animation-delay:100ms]">
                    Share your idea.
                    <br />
                    <span className="flash-gradient-text">Connect.</span> Make it count.
                  </h1>
                  <p className="text-lg text-muted-foreground animate-fade-in [animation-delay:200ms]">
                    Flash Pitch is where bold ideas meet fast action. Post your pitch and connect with like-minded people.
                  </p>
                </div>

                {/* Auth Buttons */}
                <div className="space-y-4 animate-fade-in [animation-delay:300ms]">
                  <Button variant="outline" size="lg" className="w-full h-12 text-base font-medium" onClick={handleGoogleSignIn}>
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button variant="outline" size="lg" className="w-full h-12 text-base font-medium opacity-50" disabled>
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Continue with LinkedIn
                    <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
                  </Button>

                  {/* Terms */}
                  <p className="text-center text-sm text-muted-foreground pt-2">
                    By signing in, you agree to our{' '}
                    <a href="#" className="underline hover:text-foreground">
                      Terms
                    </a>{' '}
                    and{' '}
                    <a href="#" className="underline hover:text-foreground">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Illustration */}
            <div className="hidden lg:flex items-center justify-center animate-fade-in [animation-delay:400ms]">
              <img alt="Team collaborating on ideas" className="w-full max-w-lg xl:max-w-xl object-contain" src="/lovable-uploads/44b5b22b-8a8a-4494-bb2a-0d65d694f330.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simple, fast, and effective. Get your idea in front of people who matter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center p-8 rounded-2xl bg-card border shadow-soft text-center">
              <div className="h-14 w-14 rounded-full flash-gradient flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Fast & Simple</h3>
              <p className="text-muted-foreground">
                One-line pitch, instant visibility. No complex profiles or lengthy setup required.
              </p>
            </div>

            <div className="flex flex-col items-center p-8 rounded-2xl bg-card border shadow-soft text-center">
              <div className="h-14 w-14 rounded-full flash-gradient flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Stay Fresh</h3>
              <p className="text-muted-foreground">
                The feed stays dynamic with new ideas flowing in every day.
              </p>
            </div>

            <div className="flex flex-col items-center p-8 rounded-2xl bg-card border shadow-soft text-center">
              <div className="h-14 w-14 rounded-full flash-gradient flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Quick Connections</h3>
              <p className="text-muted-foreground">
                Save, react, and request contact—all in one seamless, frictionless flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="flex items-center justify-center mb-3">
                <Rocket className="h-6 w-6 text-primary mr-2" />
                <span className="font-display text-4xl font-bold flash-gradient-text">24h</span>
              </div>
              <p className="text-muted-foreground">Pitch lifespan</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-primary mr-2" />
                <span className="font-display text-4xl font-bold flash-gradient-text">1</span>
              </div>
              <p className="text-muted-foreground">Active pitch at a time</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6 text-primary mr-2" />
                <span className="font-display text-4xl font-bold flash-gradient-text">∞</span>
              </div>
              <p className="text-muted-foreground">Potential connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Ready to pitch your idea?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join the community and see if your idea resonates. No commitment, just experimentation.
            </p>
            <Button size="lg" className="flash-gradient text-primary-foreground font-semibold px-10 shadow-glow" onClick={handleGoogleSignIn}>
              <Zap className="h-5 w-5 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg flash-gradient">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">FlashPitch</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FlashPitch. Ideas that move fast.
          </p>
        </div>
      </footer>
    </div>;
}