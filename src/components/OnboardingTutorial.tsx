import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Sparkles, UserCircle, Briefcase, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import tutorial images
import tutorialWelcome from '@/assets/tutorial-welcome.png';
import tutorialRole from '@/assets/tutorial-role.png';
import tutorialProfile from '@/assets/tutorial-profile.png';
import tutorialExplore from '@/assets/tutorial-explore.png';

interface TutorialStep {
  id: number;
  image: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    image: tutorialWelcome,
    icon: <Sparkles className="h-6 w-6" />,
    title: "Secure Your Entry",
    subtitle: "Create your identity in seconds",
    description: "Sign in securely to Pitch.net using your email or trusted accounts. Your identity is protected, verified, and always under your control.",
    tagline: "Credibility and privacy come first."
  },
  {
    id: 2,
    image: tutorialRole,
    icon: <UserCircle className="h-6 w-6" />,
    title: "Define Your Role",
    subtitle: "Choose your path in the ecosystem",
    description: "Choose a role—Innovator, Startup, Investor, or Consultant—and unlock purpose-built tools and experiences tailored to your journey.",
    tagline: "Every role matters in the ecosystem."
  },
  {
    id: 3,
    image: tutorialProfile,
    icon: <Briefcase className="h-6 w-6" />,
    title: "Create Your Professional Identity",
    subtitle: "Build trust over time",
    description: "Start with minimal details and build your profile, portfolio, pitches, or preferences over time to increase your credibility.",
    tagline: "Your reputation grows with you."
  },
  {
    id: 4,
    image: tutorialExplore,
    icon: <Compass className="h-6 w-6" />,
    title: "Explore the Innovation Ecosystem",
    subtitle: "Discover what matters to you",
    description: "Discover ideas, startups, investors, consultants, programs, and opportunities in a safe, controlled, and interest-based way.",
    tagline: "Connection starts with curiosity."
  }
];

interface OnboardingTutorialProps {
  onComplete: () => void;
  isOverlay?: boolean;
}

export function OnboardingTutorial({ onComplete, isOverlay = false }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      if (!isOverlay) {
        navigate('/auth');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    if (!isOverlay) {
      navigate('/auth');
    }
  };

  // Swipe handling
  const swipeThreshold = 50;
  const handleDragEnd = (event: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    
    // Swipe left (next)
    if (offset.x < -swipeThreshold || velocity.x < -500) {
      if (currentStep < tutorialSteps.length - 1) {
        setDirection(1);
        setCurrentStep(currentStep + 1);
      }
    }
    // Swipe right (previous)
    else if (offset.x > swipeThreshold || velocity.x > 500) {
      if (currentStep > 0) {
        setDirection(-1);
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className={`${isOverlay ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-background flex flex-col`}>
      {/* Skip/Close Button - Fixed Top Right */}
      <div className="absolute top-4 right-4 z-20 md:top-6 md:right-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="text-foreground hover:text-foreground/80 hover:bg-muted/20 backdrop-blur-sm"
        >
          {isOverlay ? 'Close' : 'Skip'}
        </Button>
      </div>

      {/* Main Content - Swipeable area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex-1 flex flex-col cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {/* Banner Image Section - Full width banner style */}
            <div className="relative w-full h-[35vh] md:h-[38vh] lg:h-[40vh] overflow-hidden pointer-events-none">
              {/* Banner Image */}
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover"
                draggable={false}
              />
              
              {/* Step indicator on banner - Desktop */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentStep ? 1 : -1);
                      setCurrentStep(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 pointer-events-auto ${
                      index === currentStep
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col bg-background">
              {/* Content Container */}
              <div className="flex-1 flex flex-col justify-center px-6 py-6 md:py-10 lg:py-12">
                <div className="w-full max-w-xl mx-auto space-y-4 md:space-y-6">
                  {/* Step Counter */}
                  <span className="text-sm font-medium text-primary/80">Step {currentStep + 1} of {tutorialSteps.length}</span>

                  {/* Title */}
                  <h1 className="font-display text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                    {step.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-foreground/60 text-base md:text-lg font-medium">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-foreground/70 text-base md:text-lg lg:text-xl leading-relaxed">
                    {step.description}
                  </p>

                  {/* Tagline */}
                  <p className="text-sm md:text-base text-primary/70 italic pt-2">
                    "{step.tagline}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-background border-t border-border/30 safe-area-bottom">
        <div className="px-6 py-4 md:py-5 max-w-xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`text-foreground/60 hover:text-foreground ${
                currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            {/* Mobile Step Counter */}
            <div className="flex items-center gap-2 md:hidden">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentStep ? 1 : -1);
                    setCurrentStep(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-6 bg-primary'
                      : 'w-1.5 bg-foreground/20'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Continue / Get Started Button */}
            <Button
              onClick={handleNext}
              className="flash-gradient text-primary-foreground font-semibold px-6 md:px-8 shadow-glow"
            >
              {isLastStep ? 'Get Started' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
