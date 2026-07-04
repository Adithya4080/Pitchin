import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import comingSoonImage from '@/assets/coming-soon.webp';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <img
          src={comingSoonImage}
          alt="Feature under development"
          className="mx-auto w-full max-w-[340px] h-auto select-none pointer-events-none mb-6"
          draggable={false}
        />

        <h1 className="font-display text-2xl font-bold text-foreground mb-3">
          Feature Under Development
        </h1>

        <p className="text-muted-foreground text-sm mb-8">
          We're working behind the scenes to bring you something valuable.
          This feature will be available soon. Stay tuned!
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