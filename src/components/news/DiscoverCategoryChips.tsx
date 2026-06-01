import { cn } from '@/lib/utils';
import { NEWS_CATEGORIES, NewsCategory } from '@/data/newsItems';

type Filter = NewsCategory | 'for-you';

interface Props {
  active: Filter;
  onChange: (f: Filter) => void;
}

export function DiscoverCategoryChips({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
      {NEWS_CATEGORIES.map((cat) => {
        const isActive = active === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value as Filter)}
            className={cn(
              'shrink-0 h-8 px-3.5 rounded-full text-xs font-medium border transition-colors',
              isActive
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-foreground/70 border-border/70 hover:border-foreground/30',
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
