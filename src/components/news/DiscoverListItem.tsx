import { Bookmark } from 'lucide-react';
import { NewsItem, formatRelativeTime } from '@/data/newsItems';

interface Props {
  item: NewsItem;
}

export function DiscoverListItem({ item }: Props) {
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noreferrer"
      className="flex gap-3 p-3 rounded-2xl bg-card border border-border/60 active:bg-muted/50 transition-colors"
    >
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <span className="font-medium text-foreground/80 truncate">{item.source}</span>
          <span>·</span>
          <span className="shrink-0">{formatRelativeTime(item.publishedAt)}</span>
        </div>
        <h3 className="text-[14px] font-semibold leading-snug text-foreground line-clamp-3">
          {item.title}
        </h3>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {item.tags?.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 h-5 inline-flex items-center rounded-md bg-muted text-muted-foreground truncate"
              >
                {t}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="p-1 -m-1 rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Save"
          >
            <Bookmark className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="shrink-0 h-[88px] w-[88px] rounded-xl overflow-hidden bg-muted">
        <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
    </a>
  );
}
