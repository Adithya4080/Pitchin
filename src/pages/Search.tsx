import { useState } from 'react';
import { Search as SearchIcon, TrendingUp, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layouts/AppLayout';

const TRENDING_TOPICS = [
  { tag: 'AI', count: 24 },
  { tag: 'Fintech', count: 18 },
  { tag: 'SaaS', count: 15 },
  { tag: 'CleanTech', count: 12 },
  { tag: 'HealthTech', count: 10 },
];

export default function Search() {
  const [query, setQuery] = useState('');

  return (
    <AppLayout showBottomNav={true}>
      <div className="container py-4 md:py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pitches, people, topics..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Trending Topics */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Trending Topics</h2>
              </div>

              <div className="space-y-3">
                {TRENDING_TOPICS.map((topic, index) => (
                  <button
                    key={topic.tag}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm font-medium w-4">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{topic.tag}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {topic.count} pitches
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Note */}
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              Full search functionality coming soon
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
