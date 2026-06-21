import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Star, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImagePlaceholder } from '@/components/network/ImagePlaceholder';
import { useServiceCategories, useServiceProviders } from '@/hooks/useServices';

export default function NetworkServices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [search, setSearch] = useState('');

  const { data: categories = [] } = useServiceCategories();
  const { data: providers = [], isLoading, isError } = useServiceProviders({
    category: activeCategory || undefined,
    search: search || undefined,
  });

  const setCategory = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <AppLayout showMobileHeader title="Services" showBottomNav>
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-5 md:py-8">
        <Link to="/network" className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Growth Hub
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Services Marketplace</h1>
        <p className="text-sm text-foreground/60 mt-1">Vetted providers across legal, tech, design, finance and more.</p>

        <div className="mt-5 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search providers…"
            className="pl-9 h-11 bg-background border-foreground/15"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setCategory('')}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              !activeCategory
                ? 'bg-foreground text-background border-foreground'
                : 'bg-white text-foreground/70 border-foreground/20 hover:border-foreground/40'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.slug)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === c.slug
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-white text-foreground/70 border-foreground/20 hover:border-foreground/40'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Provider grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 rounded-xl bg-foreground/[0.04] animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-sm text-foreground/60 mt-6">Couldn't load providers right now. Please try again shortly.</p>
        )}

        {!isLoading && !isError && providers.length === 0 && (
          <p className="text-sm text-foreground/60 mt-6">No providers found{activeCategory ? ' in this category' : ''} yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {providers.map((p) => (
            <Card key={p.id} className="bg-white border-foreground/10 p-4 flex flex-col">
              <div className="flex items-start gap-3">
                <ImagePlaceholder aspect="aspect-square" className="!w-12 !h-12 rounded-lg shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground truncate">{p.name}</h3>
                    {p.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-[11px] text-foreground/50">{p.category_name}</p>
                  {p.location && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-foreground/50 mt-0.5">
                      <MapPin className="h-3 w-3" /> {p.location}
                    </span>
                  )}
                </div>
              </div>

              {p.tagline && <p className="text-xs text-foreground/70 mt-3">{p.tagline}</p>}

              <div className="flex items-center justify-between mt-3">
                {Number(p.rating) > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs text-foreground/70">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {p.rating} <span className="text-foreground/40">({p.review_count})</span>
                  </span>
                ) : (
                  <Badge variant="secondary" className="text-[10px] bg-foreground/[0.05] text-foreground/60 font-normal">
                    New
                  </Badge>
                )}
                {p.starting_price && (
                  <span className="text-xs text-foreground/60">
                    From ${p.starting_price}{p.pricing_type === 'hourly' ? '/hr' : ''}
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" className="flex-1" disabled={!p.slug}>
                  {p.slug ? (
                    <Link to={`/network/provider/${p.slug}`}>View</Link>
                  ) : (
                    <span>View</span>
                  )}
                </Button>
                {p.website && (
                  <Button asChild size="sm" variant="outline" className="bg-white border-foreground/30">
                    <a href={p.website} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </div>  
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}