import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { AppLayout } from '@/components/layouts/AppLayout';
import { FeedLeftSidebar } from '@/components/FeedLeftSidebar';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { MobileHeader } from '@/components/mobile/MobileHeader';

import { TopStoryCard } from '@/components/news/TopStoryCard';
import { LatestUpdateRow } from '@/components/news/LatestUpdateRow';
import { NewsRightSidebar } from '@/components/news/NewsRightSidebar';
import { TopNewsCard } from '@/components/news/TopNewsCard';
import { DiscoverHeroCard } from '@/components/news/DiscoverHeroCard';
import { DiscoverListItem } from '@/components/news/DiscoverListItem';
import { DiscoverCategoryChips } from '@/components/news/DiscoverCategoryChips';

import { NEWS_CATEGORIES, NewsCategory } from '@/data/newsItems';
import { getLiveNews } from '@/api/news';
import { cn } from '@/lib/utils';

type Filter = NewsCategory | 'for-you';
type LatestTab = 'latest' | 'popular' | 'trending' | 'saved';

export default function News() {
  const [activeFilter, setActiveFilter] = useState<Filter>('for-you');
  const [latestTab, setLatestTab] = useState<LatestTab>('latest');
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await getLiveNews();

        const mappedNews = (response.results || []).map(
          (item: any, index: number) => ({
            id: index + 1,
            title: item.title || 'Untitled',
            description: item.description || '',
            imageUrl:
              item.image_url ||
              'https://via.placeholder.com/800x600?text=News',
            sourceUrl: item.link || '#',
            source: item.source_name || 'Unknown',
            publishedAt: item.pubDate || new Date().toISOString(),
            tags: item.keywords || [],
            readMinutes: 3,
            sources: 1,
            category: 'startup',
            isTopStory: index === 0,
          })
        );

        setNewsItems(mappedNews);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const topStory = useMemo(
    () => newsItems.find((n) => n.isTopStory) ?? newsItems[0],
    [newsItems]
  );

  const topNews = useMemo(
    () =>
      newsItems
        .filter((n) => n.id !== topStory?.id)
        .slice(0, 3),
    [newsItems, topStory]
  );

  const latest = useMemo(
    () =>
      [...newsItems]
        .filter((n) => n.id !== topStory?.id)
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        ),
    [newsItems, topStory]
  );

  const mobileItems = useMemo(() => {
    if (activeFilter === 'for-you') return newsItems;

    return newsItems.filter(
      (item) => item.category === activeFilter
    );
  }, [activeFilter, newsItems]);

  const mobileHero =
    mobileItems.find((n) => n.isTopStory) ?? mobileItems[0];

  const mobileRest = mobileItems.filter(
    (n) => n.id !== mobileHero?.id
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading news...
      </div>
    );
  }

  const CategoryTabs = (
    <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide border-b border-border/60">
      {NEWS_CATEGORIES.map((cat) => {
        const active = activeFilter === cat.value;

        return (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value as Filter)}
            className={cn(
              'shrink-0 pb-3 pt-1 text-sm font-medium transition-colors relative',
              active
                ? 'text-sky-500'
                : 'text-foreground/60 hover:text-foreground'
            )}
          >
            {cat.label}

            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );

  const LatestTabs = (
    <div className="flex items-center gap-2 mb-2">
      {(['latest', 'popular', 'trending', 'saved'] as LatestTab[]).map(
        (tab) => {
          const active = latestTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setLatestTab(tab)}
              className={cn(
                'px-4 h-8 rounded-full text-xs font-medium border transition-colors capitalize',
                active
                  ? 'bg-sky-50 border-sky-300 text-sky-600'
                  : 'bg-background border-border text-foreground/70'
              )}
            >
              {tab}
            </button>
          );
        }
      )}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden min-h-screen bg-background">
        <MobileHeader title="News" />

        <div className="px-4 pt-3 pb-3 sticky top-14 bg-background/95 backdrop-blur-sm z-10 border-b border-border/40">
          <DiscoverCategoryChips
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        <main className="px-4 py-4 pb-24 space-y-5">
          {mobileHero && (
            <section>
              <DiscoverHeroCard item={mobileHero} />
            </section>
          )}

          <section>
            <div className="space-y-3">
              {mobileRest.map((item) => (
                <DiscoverListItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        </main>

        <BottomNavigation />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <AppLayout showBottomNav={false}>
          <div className="container py-6">
            <div className="flex gap-6">
              {/* <div className="hidden lg:block">
                <FeedLeftSidebar />
              </div> */}

              <div className="flex-1 min-w-0">
                <div className="mb-6 flex items-center gap-4">
                  <h1 className="text-3xl font-semibold tracking-tight">
                    News
                  </h1>

                  <div className="flex-1 max-w-xl ml-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <input
                      placeholder="Search news..."
                      className="w-full h-11 pl-11 pr-4 rounded-full bg-muted/60 text-sm"
                    />
                  </div>
                </div>

                <div className="mb-6">{CategoryTabs}</div>

                <div className="space-y-8">
                  {topStory && <TopStoryCard item={topStory} />}

                  <section>
                    <h2 className="text-xl font-semibold mb-4">
                      Top News
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {topNews.map((item) => (
                        <TopNewsCard
                          key={item.id}
                          item={item}
                        />
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold mb-4">
                      Latest Updates
                    </h2>

                    {LatestTabs}

                    <div>
                      {latest.map((item) => (
                        <LatestUpdateRow
                          key={item.id}
                          item={item}
                        />
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <div className="hidden xl:block">
                <NewsRightSidebar />
              </div>
            </div>
          </div>
        </AppLayout>
      </div>
    </>
  );
}