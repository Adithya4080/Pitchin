import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Scale, Megaphone, FileText, Layout, Palette, Code2, TrendingUp, Shield, Users, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useServiceCategories } from '@/hooks/useServices';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const ICON_MAP: Record<string, { icon: React.ReactNode; bg: string; text: string; accent: string; lightBg: string }> = {
  scale:          { icon: <Scale className="h-6 w-6" />,      bg: 'bg-blue-50',    text: 'text-blue-600',   accent: '#2563EB', lightBg: '#EFF6FF' },
  briefcase:      { icon: <FileText className="h-6 w-6" />,   bg: 'bg-indigo-50',  text: 'text-indigo-600', accent: '#4F46E5', lightBg: '#EEF2FF' },
  megaphone:      { icon: <Megaphone className="h-6 w-6" />,  bg: 'bg-orange-50',  text: 'text-orange-500', accent: '#EA580C', lightBg: '#FFF7ED' },
  palette:        { icon: <Palette className="h-6 w-6" />,    bg: 'bg-pink-50',    text: 'text-pink-500',   accent: '#DB2777', lightBg: '#FDF2F8' },
  code:           { icon: <Code2 className="h-6 w-6" />,      bg: 'bg-violet-50',  text: 'text-violet-600', accent: '#7C3AED', lightBg: '#F5F3FF' },
  calculator:     { icon: <TrendingUp className="h-6 w-6" />, bg: 'bg-emerald-50', text: 'text-emerald-600',accent: '#059669', lightBg: '#ECFDF5' },
  'shield-check': { icon: <Shield className="h-6 w-6" />,     bg: 'bg-red-50',     text: 'text-red-500',    accent: '#DC2626', lightBg: '#FEF2F2' },
  users:          { icon: <Users className="h-6 w-6" />,      bg: 'bg-cyan-50',    text: 'text-cyan-600',   accent: '#0891B2', lightBg: '#ECFEFF' },
  'trending-up':  { icon: <TrendingUp className="h-6 w-6" />, bg: 'bg-green-50',   text: 'text-green-600',  accent: '#16A34A', lightBg: '#F0FDF4' },
  other:          { icon: <HelpCircle className="h-6 w-6" />, bg: 'bg-gray-50',    text: 'text-gray-500',   accent: '#6B7280', lightBg: '#F9FAFB' },
  presentation:   { icon: <Layout className="h-6 w-6" />,     bg: 'bg-amber-50',   text: 'text-amber-500',  accent: '#D97706', lightBg: '#FFFBEB' },
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

// ─── Thrust-forward + macOS liquid hover card ─────────────────────────────────
function CategoryCard({ cat }: { cat: any }) {
  const cfg = getIconConfig(cat.icon);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setTilt({
      x: ((cy / rect.height) - 0.5) * -14,
      y: ((cx / rect.width) - 0.5) * 14,
    });
    setGlowPos({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  // Touch equivalent — no cursor position, so glow radiates from touch point
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      const touch = e.touches[0];
      setGlowPos({
        x: ((touch.clientX - rect.left) / rect.width) * 100,
        y: ((touch.clientY - rect.top) / rect.height) * 100,
      });
    }
    setPressed(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Let the glow/tint linger briefly so it reads as a tap response, not a flash
    window.setTimeout(() => setPressed(false), 220);
  }, []);

  const active = hovered || pressed;

  return (
    <div style={{ perspective: "800px" }} className="h-full">
      <motion.a
        ref={cardRef}
        href={`/network/services/${cat.slug}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/network/services/${cat.slug}`);
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        whileTap={{ scale: 0.97 }}
        className="group relative flex flex-col rounded-xl bg-white overflow-hidden h-full touch-manipulation"
        style={{
          border: '1px solid #e5e7eb',
          transform: hovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(16px) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transition: hovered
            ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
            : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out',
          boxShadow: active
            ? '0 18px 50px -8px rgba(0,0,0,0.16), 0 6px 16px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          willChange: 'transform',
          textDecoration: 'none',
        }}
      >
        {/* macOS liquid glow — follows cursor (or last touch point) */}
        {active && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl z-10"
            style={{
              background: `radial-gradient(240px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Single grey top border accent line */}
        <div className="h-px w-full bg-gray-200" />

        {/* Subtle colour tint on hover/press */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${cfg.lightBg} 0%, white 60%)`,
            opacity: active ? 1 : 0,
          }}
        />

        <div className="relative p-4 flex flex-col h-full">
          {/* Icon */}
          <span
            className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${cfg.bg} ${cfg.text} mb-3 shrink-0`}
            style={{
              transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
              transform: active ? 'scale(1.12)' : 'scale(1)',
            }}
          >
            {cfg.icon}
          </span>

          {/* Name */}
          <p className="text-sm font-semibold text-foreground leading-snug mb-1">
            {cat.name}
          </p>

          {/* Description */}
          {cat.description && (
            <p className="text-[11px] text-foreground/50 leading-snug line-clamp-2 mb-3 flex-1">
              {cat.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto">
            <p
              className="text-[11px] font-medium transition-colors duration-200"
              style={{ color: active ? cfg.accent : 'rgba(0,0,0,0.25)' }}
            >
              {cat.provider_count > 0 ? `${cat.provider_count}+` : '—'}
            </p>
            <ArrowRight
              className="h-3.5 w-3.5 transition-all duration-200"
              style={{
                color: active ? cfg.accent : 'rgba(0,0,0,0.2)',
                transform: active ? 'translateX(2px)' : 'translateX(0)',
              }}
            />
          </div>
        </div>
      </motion.a>
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
            : visibleCards.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} />
              ))}
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