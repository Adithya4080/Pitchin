import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-sm"
      >
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="font-display text-2xl font-bold text-foreground mb-3">
          Coming Soon
        </h1>
        
        <p className="text-muted-foreground text-sm mb-8">
          This feature is currently under development. Stay tuned for updates!
        </p>

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="rounded-full px-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </motion.div>
    </div>
  );
}
