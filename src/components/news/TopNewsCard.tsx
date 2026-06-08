import { Bookmark } from 'lucide-react';
import { NewsItem } from '@/data/newsItems';

export function TopNewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card rounded-2xl border border-border/60 overflow-hidden flex flex-col hover:border-foreground/20 transition-colors"
    >
      <div className="aspect-[16/10] bg-muted overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm md:text-base font-semibold leading-snug line-clamp-2 mb-2">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
          <span>{item.readMinutes} min read</span>
          <span>·</span>
          <span>{item.sources} sources</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          {item.tags?.[0] && (
            <span className="px-2.5 h-6 inline-flex items-center rounded-full bg-muted text-[11px] font-medium">
              {item.tags[0]}
            </span>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="p-1.5 text-foreground/50 hover:text-foreground rounded-full hover:bg-muted"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
    </a>
  );
}
