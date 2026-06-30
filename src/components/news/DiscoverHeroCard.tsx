import { Bookmark, Share2 } from 'lucide-react';
import { NewsItem, formatRelativeTime } from '@/data/newsItems';

interface Props {
  item: NewsItem;
}

export function DiscoverHeroCard({ item }: Props) {
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="block rounded-2xl overflow-hidden bg-card border border-border/60"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center h-6 px-2 rounded-full bg-white/95 text-[11px] font-medium text-foreground">
            {item.source}
          </span>
          <span className="text-[11px] text-white/90">{formatRelativeTime(item.publishedAt)}</span>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-[17px] font-semibold leading-snug tracking-tight line-clamp-3 text-foreground">
          {item.title}
        </h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            {item.sources != null && <span>{item.sources} sources</span>}
            {item.sources != null && item.readMinutes && <span>·</span>}
            {item.readMinutes && <span>{item.readMinutes} min read</span>}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="p-1.5 rounded-full hover:bg-muted"
              aria-label="Save"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="p-1.5 rounded-full hover:bg-muted"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </a>
  );
}
