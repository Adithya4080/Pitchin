import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, CandlestickChart, Share2, Users, Lightbulb,
  Clock, Check, ArrowRight, ArrowLeft, Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { updateMyProfile } from '@/api/profiles';
import { updateMe } from '@/api/auth';

type UserRole = 'innovator' | 'startup' | 'investor' | 'consultant' | 'ecosystem_partner';

const roles: {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  available: boolean;
}[] = [
  {
    id: 'startup',
    title: 'Startup / Business',
    description: "I'm building or running a business venture",
    icon: <Store className="h-5 w-5" />,
    color: 'bg-blue-50 text-blue-700',
    available: true,
  },
  {
    id: 'innovator',
    title: 'Innovator',
    description: 'I have ideas and want to share them with the world',
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'bg-amber-50 text-amber-700',
    available: false,
  },
  {
    id: 'investor',
    title: 'Investor',
    description: "I'm looking to invest in promising ideas",
    icon: <CandlestickChart className="h-5 w-5" />,
    color: 'bg-green-50 text-green-700',
    available: false,
  },
  {
    id: 'consultant',
    title: 'Consultant',
    description: 'I offer expertise and advisory services',
    icon: <Share2 className="h-5 w-5" />,
    color: 'bg-purple-50 text-purple-700',
    available: false,
  },
  {
    id: 'ecosystem_partner',
    title: 'Ecosystem Partner',
    description: 'I represent an accelerator, incubator, or support organization',
    icon: <Users className="h-5 w-5" />,
    color: 'bg-teal-50 text-teal-700',
    available: false,
  },
];

export default function Onboarding() {
  const { user, refreshUser, setIsOnboarded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  const handleComplete = async () => {
    if (!user || !selectedRole) return;
    setIsSubmitting(true);
    try {
      await updateMe({ role: selectedRole });
      await updateMyProfile({ bio: bio || null, linkedin_url: linkedinUrl || null });
      await refreshUser();
      setIsOnboarded(true);
      toast({ title: "You're all set!", description: 'Welcome to PitchIn!' });
      navigate('/network');
    } catch (e: any) {
      toast({ title: 'Setup failed', description: e.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose role */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Who are you?</h1>
                <p className="text-sm text-muted-foreground">Choose the role that best describes you</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <div key={role.id} className="relative group">
                    <Card
                      className={`h-full transition-all ${
                        role.available
                          ? `cursor-pointer hover:shadow-md ${
                              selectedRole === role.id
                                ? 'ring-2 ring-primary'
                                : 'hover:border-primary/40'
                            }`
                          : 'opacity-50 cursor-not-allowed select-none'
                      }`}
                      onClick={() => role.available && setSelectedRole(role.id)}
                    >
                      <CardContent className="p-4 flex flex-col gap-2">
                        {/* Icon + checkmark row */}
                        <div className="flex items-start justify-between">
                          <div className={`inline-flex p-2 rounded-lg ${role.color}`}>
                            {role.icon}
                          </div>
                          {selectedRole === role.id && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          {!role.available && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground flex-shrink-0">
                              Soon
                            </span>
                          )}
                        </div>

                        {/* Text */}
                        <div>
                          <p className="text-sm font-medium leading-tight">{role.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                            {role.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tooltip on hover for disabled */}
                    {!role.available && (
                      <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 bg-popover text-popover-foreground border text-xs px-3 py-1.5 rounded-md whitespace-nowrap shadow-sm z-10 pointer-events-none">
                        <Clock className="h-3 w-3" />
                        Coming soon
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <Button onClick={() => setStep(2)} disabled={!selectedRole} className="gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Profile info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Tell us about yourself</h1>
                <p className="text-sm text-muted-foreground">Help others know who you are</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community about yourself..."
                    rows={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">LinkedIn URL (optional)</label>
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-primary" />
              </motion.div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">You're all set!</h1>
                <p className="text-muted-foreground text-sm">
                  Welcome to the community, {fullName || 'friend'}!
                </p>
              </div>

              {selectedRoleData && (
                <Card className="max-w-sm mx-auto">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback>{fullName?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">{fullName || 'Anonymous'}</p>
                        <div
                          className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${selectedRoleData.color}`}
                        >
                          {selectedRoleData.icon}
                          <span>{selectedRoleData.title}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={handleComplete} disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? 'Setting up...' : "Let's go!"}
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}