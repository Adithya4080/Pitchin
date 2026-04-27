import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Building2, TrendingUp, Lightbulb, ArrowRight, ArrowLeft, Check, Handshake,
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

const roles = [
  { id: 'innovator' as UserRole, title: 'Innovator', description: 'I have ideas and want to share them with the world', icon: <Lightbulb className="h-8 w-8" />, color: 'from-amber-500 to-orange-500' },
  { id: 'startup' as UserRole, title: 'Startup / Business', description: "I'm building or running a business venture", icon: <Building2 className="h-8 w-8" />, color: 'from-blue-500 to-indigo-500' },
  { id: 'investor' as UserRole, title: 'Investor', description: "I'm looking to invest in promising ideas", icon: <TrendingUp className="h-8 w-8" />, color: 'from-emerald-500 to-teal-500' },
  { id: 'consultant' as UserRole, title: 'Consultant', description: 'I offer expertise and advisory services', icon: <Rocket className="h-8 w-8" />, color: 'from-purple-500 to-pink-500' },
  { id: 'ecosystem_partner' as UserRole, title: 'Ecosystem Partner', description: 'I represent an accelerator, incubator, or support organization', icon: <Handshake className="h-8 w-8" />, color: 'from-cyan-500 to-blue-500' },
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
      // 1. Set the role on the user account
      await updateMe({ role: selectedRole });

      // 2. Update profile with bio and linkedin
      await updateMyProfile({ bio: bio || null, linkedin_url: linkedinUrl || null });

      // 3. Refresh local user so onboarding status updates
      await refreshUser();
      setIsOnboarded(true);

      toast({ title: "You're all set!", description: 'Welcome to PitchIn!' });
      navigate('/feed');
    } catch (e: any) {
      toast({ title: 'Setup failed', description: e.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
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
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Who are you?</h1>
                <p className="text-muted-foreground">Choose the role that best describes you</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <Card
                    key={role.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedRole === role.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${role.color} text-white mb-3`}>
                        {role.icon}
                      </div>
                      <h3 className="font-semibold mb-1">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
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
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Tell us about yourself</h1>
                <p className="text-muted-foreground">Help others know who you are</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community about yourself..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
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
              className="space-y-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-primary" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">You're all set!</h1>
                <p className="text-muted-foreground">Welcome to the community, {fullName || 'friend'}!</p>
              </div>

              {selectedRoleData && (
                <Card className="max-w-sm mx-auto">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback>{fullName?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">{fullName || 'Anonymous'}</p>
                        <div className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${selectedRoleData.color} text-white`}>
                          {selectedRoleData.icon}
                          <span className="ml-1">{selectedRoleData.title}</span>
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
