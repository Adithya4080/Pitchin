import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Megaphone, FileText, Layout, Palette, Code2, TrendingUp, Shield, Users, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useServiceCategories } from '@/hooks/useServices';
import { useState, useEffect, useCallback } from 'react';

const ICON_MAP: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  scale: { icon: <Scale className="h-6 w-6" />, bg: 'bg-blue-50', text: 'text-blue-600' },
  briefcase: { icon: <FileText className="h-6 w-6" />, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  megaphone: { icon: <Megaphone className="h-6 w-6" />, bg: 'bg-orange-50', text: 'text-orange-500' },
  palette: { icon: <Palette className="h-6 w-6" />, bg: 'bg-pink-50', text: 'text-pink-500' },
  code: { icon: <Code2 className="h-6 w-6" />, bg: 'bg-violet-50', text: 'text-violet-600' },
  calculator: { icon: <TrendingUp className="h-6 w-6" />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  'shield-check': { icon: <Shield className="h-6 w-6" />, bg: 'bg-red-50', text: 'text-red-500' },
  users: { icon: <Users className="h-6 w-6" />, bg: 'bg-cyan-50', text: 'text-cyan-600' },
  'trending-up': { icon: <TrendingUp className="h-6 w-6" />, bg: 'bg-green-50', text: 'text-green-600' },
  other: { icon: <HelpCircle className="h-6 w-6" />, bg: 'bg-gray-50', text: 'text-gray-500' },
  presentation: { icon: <Layout className="h-6 w-6" />, bg: 'bg-amber-50', text: 'text-amber-500' },
};

function getIconConfig(icon: string) {
  return ICON_MAP[icon] ?? ICON_MAP['other'];
}

// How many cards per "slide page" based on screen — we use 5 (matches xl grid)
const CARDS_PER_SLIDE = 5;

function CategorySkeleton() {
  return (
    <div className="rounded-xl border border-foreground/10 bg-white p-4 animate-pulse flex-shrink-0 w-[180px]">
      <div className="h-12 w-12 rounded-xl bg-foreground/[0.06] mb-3" />
      <div className="h-4 w-24 bg-foreground/[0.06] rounded mb-2" />
      <div className="h-3 w-32 bg-foreground/[0.04] rounded mb-3" />
      <div className="h-3 w-16 bg-foreground/[0.04] rounded" />
    </div>
  );
}

export function ServiceCategoryGrid() {
  const { data: categories = [], isLoading, isError } = useServiceCategories();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = Math.ceil(categories.length / CARDS_PER_SLIDE);

  const goNext = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Reset slide if categories change
  useEffect(() => {
    setCurrentSlide(0);
  }, [categories.length]);

  const visibleCards = categories.slice(
    currentSlide * CARDS_PER_SLIDE,
    currentSlide * CARDS_PER_SLIDE + CARDS_PER_SLIDE
  );

  return (
    <section>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground">
            Services for Every Stage
          </h2>
          <p className="text-sm text-foreground/55 mt-0.5">
            Browse top categories. Find the right expert, fast.
          </p>
        </div>
        <Link
          to="/network/services?view=all"
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-foreground border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors shrink-0 mt-1"
        >
          See all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isError && (
        <p className="text-sm text-foreground/55 py-6 text-center">
          Couldn't load categories right now. Please refresh.
        </p>
      )}

      {/* Slider container */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 min-h-[160px]">
          {isLoading
            ? Array.from({ length: CARDS_PER_SLIDE }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : visibleCards.map((cat) => {
                const { icon, bg, text } = getIconConfig(cat.icon);
                return (
                  <Link
                    key={cat.id}
                    to={`/network/services/${cat.slug}`}
                    className="group flex flex-col rounded-xl border border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm transition-all duration-200 p-4"
                  >
                    <span
                      className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${bg} ${text} mb-3 group-hover:scale-105 transition-transform`}
                    >
                      {icon}
                    </span>
                    <p className="text-sm font-semibold text-foreground leading-snug mb-1">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-[11px] text-foreground/50 leading-snug line-clamp-2 mb-3 flex-1">
                        {cat.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-[11px] font-medium text-foreground/40">
                        {cat.provider_count > 0 ? `${cat.provider_count}+` : '—'}
                      </p>
                      <ArrowRight className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Prev / Next arrows — only show if more than 1 slide */}
        {!isLoading && totalSlides > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goNext}
              className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {!isLoading && totalSlides > 1 && (
        <div className="flex items-center justify-center">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile "view all" */}
      <div className="flex md:hidden justify-center mt-4">
        <Link
          to="/network/services?view=all"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}