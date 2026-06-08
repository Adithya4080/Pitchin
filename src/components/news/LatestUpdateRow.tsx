import { Bookmark } from 'lucide-react';
import { NewsItem, formatRelativeTime } from '@/data/newsItems';

export function LatestUpdateRow({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 py-4 border-b border-border/60 last:border-0"
    >
      <div className="w-24 h-20 md:w-32 md:h-24 shrink-0 rounded-xl bg-muted overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
          <span className="font-medium text-foreground/70">{item.source}</span>
          <span>·</span>
          <span>{formatRelativeTime(item.publishedAt)}</span>
        </div>
        <h3 className="text-sm md:text-base font-medium leading-snug line-clamp-2 group-hover:text-sky-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.description}</p>
      </div>
      <button
        onClick={(e) => e.preventDefault()}
        className="self-start p-1.5 text-foreground/40 hover:text-foreground rounded-full hover:bg-muted"
      >
        <Bookmark className="h-4 w-4" />
      </button>
    </a>
  );
}
