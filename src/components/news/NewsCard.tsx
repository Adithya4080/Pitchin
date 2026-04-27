import { ExternalLink, Clock } from 'lucide-react';
import { NewsItem, formatRelativeTime } from '@/data/newsItems';

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-border transition-all hover:shadow-md"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-56 sm:shrink-0 aspect-video sm:aspect-square bg-muted overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground/80">{item.source}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(item.publishedAt)}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg leading-snug text-foreground group-hover:text-sky-500 transition-colors line-clamp-2">
            {item.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {item.description}
          </p>

          <div className="mt-auto pt-2 inline-flex items-center gap-1 text-xs font-medium text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
            Read on {item.source}
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
      </div>
    </a>
  );
}
