import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { FeedLeftSidebar } from '@/components/FeedLeftSidebar';
import { FeedRightSidebar } from '@/components/FeedRightSidebar';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { NewsCard } from '@/components/news/NewsCard';
import { NEWS_ITEMS, NEWS_CATEGORIES, NewsCategory } from '@/data/newsItems';
import { cn } from '@/lib/utils';
import { Newspaper } from 'lucide-react';

type Filter = NewsCategory | 'all';

export default function News() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const sorted = [...NEWS_ITEMS].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    if (activeFilter === 'all') return sorted;
    return sorted.filter((n) => n.category === activeFilter);
  }, [activeFilter]);

  const FiltersBar = (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {NEWS_CATEGORIES.map((cat) => {
        const active = activeFilter === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value as Filter)}
            className={cn(
              'shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-colors border',
              active
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-foreground/80 border-border hover:bg-muted',
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );

  const NewsList = (
    <div className="space-y-4">
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No news in this category yet.</p>
        </div>
      ) : (
        filtered.map((item) => <NewsCard key={item.id} item={item} />)
      )}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden min-h-screen bg-background">
        <MobileHeader title="News" />
        <div className="px-4 py-3 sticky top-14 bg-background z-10 border-b border-border/40">
          {FiltersBar}
        </div>
        <main className="px-4 py-4 pb-24">{NewsList}</main>
        <BottomNavigation />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <AppLayout showBottomNav={false}>
          <div className="container py-4 md:py-6">
            <div className="flex gap-6">
              <div className="hidden lg:block">
                <FeedLeftSidebar />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-5">
                  <h1 className="font-display font-bold text-3xl tracking-tight mb-1">
                    News
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Weekly Indian startup, business, market & innovation updates
                  </p>
                </div>

                <div className="sticky top-16 z-20 bg-background/95 backdrop-blur py-3 -mx-1 px-1 mb-4">
                  {FiltersBar}
                </div>

                {NewsList}
              </div>

              <div className="hidden xl:block">
                <FeedRightSidebar />
              </div>
            </div>
          </div>
        </AppLayout>
      </div>
    </>
  );
}
