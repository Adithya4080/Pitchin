import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Phase = 'confirm' | 'signing' | 'done';

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('confirm');

  const handleConfirm = async () => {
    setPhase('signing');
    // Wait for sign-out to actually finish AND give the spinner a moment
    // to actually be seen, even if the request resolves instantly.
    await Promise.all([
      signOut(),
      new Promise((resolve) => setTimeout(resolve, 900)),
    ]);
    setPhase('done');
    // Hold the goodbye message long enough to actually register.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    onOpenChange(false);
    setPhase('confirm');
    navigate('/');
  };

  const handleOpenChange = (next: boolean) => {
    // Don't let the dialog be dismissed mid-flow.
    if (phase !== 'confirm') return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-sm overflow-hidden [&>button]:hidden"
        onInteractOutside={(e) => phase !== 'confirm' && e.preventDefault()}
        onEscapeKeyDown={(e) => phase !== 'confirm' && e.preventDefault()}
      >
        <AnimatePresence mode="wait">
          {phase === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center gap-4 py-2"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <LogOut className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-semibold">Sign out of PitchIn?</h2>
                <p className="text-sm text-muted-foreground">
                  Your pitches, chats, and connections will be right here when you get back.
                </p>
              </div>
              <div className="flex w-full gap-2 mt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleConfirm}
                >
                  Sign out
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'signing' && (
            <motion.div
              key="signing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center gap-4 py-10"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
              >
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </motion.div>
              <p className="text-sm font-medium text-muted-foreground">Signing you out…</p>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col items-center text-center gap-4 py-8 overflow-hidden"
            >
              {/* pulsing glow */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.6, 2.2], opacity: [0.5, 0.25, 0] }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="absolute top-2 h-20 w-20 rounded-full bg-primary/30 blur-xl"
              />

              {/* spark burst */}
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 70;
                return (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance - 10,
                      opacity: 0,
                      scale: 0.4,
                    }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="absolute top-10 h-1.5 w-1.5 rounded-full bg-primary"
                  />
                );
              })}

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <motion.span
                  animate={{ rotate: [0, 20, -12, 20, -8, 0] }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  style={{ transformOrigin: '70% 70%' }}
                  className="text-3xl"
                >
                  👋
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
                className="space-y-1"
              >
                <p className="text-base font-semibold">You're signed out</p>
                <p className="text-sm text-muted-foreground">
                  See you soon — come back and keep the momentum going.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}