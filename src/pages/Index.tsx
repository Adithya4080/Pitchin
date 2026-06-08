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
  } = useAuth();
  const {
    toast
  } = useToast();

  const [showTutorial, setShowTutorial] = useState<boolean | null>(null);
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    setShowTutorial(tutorialCompleted !== 'true');
  }, []);

  useEffect(() => {
    if (user && isOnboardingChecked) {
      if (user.email === 'pitchin.admn@gmail.com') {
        navigate('/feed');
      } else if (isOnboarded === false) {
        navigate('/onboarding');
      } else if (isOnboarded === true) {
        navigate('/feed');
      }
    }
  }, [user, isOnboarded, isOnboardingChecked, navigate]);

  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    setShowTutorial(false);
  };

  if (showTutorial === null) {
    return null;
  }

  if (showTutorial && !user) {
    return <OnboardingTutorial onComplete={handleTutorialComplete} />;
  }

  if (user) {
    return null;
  }

  return <>
    {/* Mobile Landing */}
    <div className="md:hidden">
      <MobileLandingPage />
    </div>

    {/* Desktop Landing */}
    <div className="hidden md:block">
      <DesktopLanding />
    </div>
  </>;
}

function DesktopLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      {/* Hero Section */}
        <section className="relative min-h-[600px] overflow-visible">
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
                <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-6xl">
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
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <Button
                  size="lg"
                  className="h-12 flex-1 text-base font-medium flash-gradient text-primary-foreground"
                  onClick={() => navigate('/auth?tab=register')}
                >
                  Create Account
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 flex-1 text-base font-medium"
                  onClick={() => navigate('/auth?tab=login')}
                >
                  Sign In
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <a href="#" className="underline hover:text-foreground">Terms</a>
                {" "}and{" "}
                <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
              </p>
            </div>

            {/* Right Illustration — original size restored */}
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
      {/* Footer */}
      <SiteFooter />
    </div>
  );
}