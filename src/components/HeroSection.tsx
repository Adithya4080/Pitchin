import { Clock, Users, Sparkles, Rocket, Zap } from 'lucide-react';
import pitchinLogo from '@/assets/pitchin-logo-new.png';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Ideas that spark connections
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in [animation-delay:100ms]">
            Share your idea.
            <br />
            <span className="flash-gradient-text">Connect.</span> Make it count.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in [animation-delay:200ms]">
            PitchIn is where bold ideas meet fast action. Post your pitch, connect with like-minded people, and see if your idea has legs—all before the clock runs out.
          </p>

          {/* CTA */}
          {!user && (
            <Button
              size="lg"
              className="flash-gradient text-primary-foreground font-semibold px-8 shadow-glow animate-fade-in [animation-delay:300ms]"
              onClick={() => navigate('/auth')}
            >
              <Rocket className="h-5 w-5 mr-2" />
              Start Pitching
            </Button>
          )}

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mt-16 animate-fade-in [animation-delay:400ms]">
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border shadow-soft">
              <div className="h-12 w-12 rounded-full flash-gradient flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">Fast & Simple</h3>
              <p className="text-sm text-muted-foreground text-center">
                One-line pitch, instant visibility. No complex profiles required.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border shadow-soft">
              <div className="h-12 w-12 rounded-full flash-gradient flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">Stay Fresh</h3>
              <p className="text-sm text-muted-foreground text-center">
                The feed stays dynamic with new ideas flowing in every day.
              </p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border shadow-soft">
              <div className="h-12 w-12 rounded-full flash-gradient flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold mb-2">Quick Connections</h3>
              <p className="text-sm text-muted-foreground text-center">
                Save, react, and request contact—all in one seamless flow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
