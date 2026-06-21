import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  label?: string;
  aspect?: string;
  className?: string;
}

export function ImagePlaceholder({ label, aspect = 'aspect-video', className }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-dashed border-foreground/15 bg-foreground/[0.03] flex flex-col items-center justify-center gap-1.5 text-foreground/30',
        aspect,
        className
      )}
    >
      <ImageIcon className="h-5 w-5" />
      {label && <span className="text-[10px] text-foreground/40">{label}</span>}
    </div>
  );
}