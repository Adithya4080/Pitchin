import { Bookmark, Share2 } from 'lucide-react';
import { NewsItem, formatRelativeTime } from '@/data/newsItems';

export function TopStoryCard({ item }: { item: NewsItem }) {
  return (
    <article className="bg-card rounded-2xl border border-border/60 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-6 md:p-8 flex flex-col">
          <span className="text-[11px] font-semibold tracking-wider text-sky-500 uppercase mb-3">
            Top Story
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight mb-3">
            {item.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <span>{item.readMinutes} min read</span>
            <span>·</span>
            <span>{item.sources} sources</span>
            <span>·</span>
            <span>{formatRelativeTime(item.publishedAt)}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.description}</p>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 h-7 inline-flex items-center rounded-full bg-muted text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-foreground/60">
              <button className="p-2 hover:text-foreground rounded-full hover:bg-muted">
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="p-2 hover:text-foreground rounded-full hover:bg-muted">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="aspect-[4/3] md:aspect-auto bg-muted overflow-hidden order-first md:order-last">
          <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
    </article>
  );
}
