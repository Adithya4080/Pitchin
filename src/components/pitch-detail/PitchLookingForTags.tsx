import { Badge } from '@/components/ui/badge';

interface PitchLookingForTagsProps {
  items: string[];
}

export function PitchLookingForTags({ items }: PitchLookingForTagsProps) {
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="px-3 py-1.5 text-sm bg-secondary/80 text-foreground font-normal"
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}
