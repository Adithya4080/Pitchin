import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Scale, Megaphone, FileText, Palette, Code2, TrendingUp, Shield, Users, HelpCircle, PieChart, Pencil } from 'lucide-react';
import { useServiceCategories } from '@/hooks/useServices';

const ICON_MAP: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  scale:          { icon: <Scale className="h-5 w-5" />,      bg: 'bg-red-50',     text: 'text-red-500' },
  briefcase:      { icon: <FileText className="h-5 w-5" />,   bg: 'bg-indigo-50',  text: 'text-indigo-600' },
  megaphone:      { icon: <Megaphone className="h-5 w-5" />,  bg: 'bg-orange-50',  text: 'text-orange-500' },
  palette:        { icon: <Palette className="h-5 w-5" />,    bg: 'bg-pink-50',    text: 'text-pink-500' },
  code:           { icon: <Code2 className="h-5 w-5" />,      bg: 'bg-blue-50',    text: 'text-blue-600' },
  calculator:     { icon: <PieChart className="h-5 w-5" />,   bg: 'bg-emerald-50', text: 'text-emerald-600' },
  'shield-check': { icon: <Shield className="h-5 w-5" />,     bg: 'bg-red-50',     text: 'text-red-500' },
  users:          { icon: <Users className="h-5 w-5" />,      bg: 'bg-cyan-50',    text: 'text-cyan-600' },
  'trending-up':  { icon: <TrendingUp className="h-5 w-5" />, bg: 'bg-green-50',   text: 'text-green-600' },
  presentation:   { icon: <Pencil className="h-5 w-5" />,     bg: 'bg-amber-50',   text: 'text-amber-500' },
  other:          { icon: <HelpCircle className="h-5 w-5" />, bg: 'bg-gray-50',    text: 'text-gray-500' },
};

function getIconConfig(icon: string) {
  return ICON_MAP[icon] ?? ICON_MAP['other'];
}

const VISIBLE_COUNT = 5;

function CategorySkeleton() {
  return (
    <div className="shrink-0 basis-1/5 min-w-[180px] px-1.5 flex">
      <div className="px-4 py-3 w-full animate-pulse border border-gray-100 rounded-xl" style={{ height: 176 }}>
        <div className="h-10 w-10 rounded-lg bg-gray-100 mb-3" />
        <div className="h-3.5 w-20 bg-gray-100 rounded mb-2" />
        <div className="h-3 w-24 bg-gray-50 rounded mb-3" />
        <div className="h-3 w-16 bg-gray-50 rounded" />
      </div>
    </div>
  );
}

// ─── Tilt + glow card, matching ProviderCard's "liquid glass" hover effect ──
function CategoryCell({ cat, isFirst }: { cat: any; isFirst: boolean }) {
  const cfg = getIconConfig(cat.icon);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setTilt({
      x: ((cy / rect.height) - 0.5) * -10,
      y: ((cx / rect.width) - 0.5) * 10,
    });
    setGlowPos({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <div className="shrink-0 basis-1/5 min-w-[180px] px-1.5 flex" style={{ perspective: '900px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative bg-white rounded-xl overflow-hidden w-full"
        style={{
          border: '1px solid #e5e7eb',
          height: 176,
          // transform: hovered
          //   ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(14px) scale(1.015)`
          //   : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          // transition: hovered
          //   ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
          //   : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out',
          boxShadow: hovered
            ? '0 20px 60px -8px rgba(0,0,0,0.16), 0 8px 20px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          willChange: 'transform',
        }}
      >
        {/* macOS liquid glow */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl z-10"
            style={{
              background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}

        <Link
          to={`/network/services/${cat.slug}`}
          className="group relative flex flex-col h-full px-4 py-3"
        >
          {isFirst && (
            <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Most Popular
            </span>
          )}
          <span className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${cfg.bg} ${cfg.text} mb-3 shrink-0`}>
            {cfg.icon}
          </span>
          <p className="text-[14px] font-bold text-gray-900 leading-snug mb-1 line-clamp-1">{cat.name}</p>
          {cat.description && (
            <p className="text-[12px] text-gray-400 leading-snug mb-3 line-clamp-2">{cat.description}</p>
          )}
          <p className="text-[12px] font-semibold text-blue-600 mt-auto inline-flex items-center gap-1 shrink-0">
            {cat.provider_count > 0 ? `${cat.provider_count} Providers` : 'View providers'}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </Link>
      </div>
    </div>
  );
}

export function ServiceCategoryGrid() {
  const { data: categories = [], isLoading, isError } = useServiceCategories();
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const total = categories.length;
  const maxPage = Math.max(0, Math.ceil(total / VISIBLE_COUNT) - 1);
  const canPrev = page > 0;
  const canNext = page < maxPage;

  // Keep page in range if the category list shrinks/loads in
  useEffect(() => {
    if (page > maxPage) setPage(maxPage);
  }, [maxPage, page]);

  const scrollToPage = (next: number) => {
    const clamped = Math.max(0, Math.min(maxPage, next));
    setPage(clamped);
    const track = trackRef.current;
    if (track && total > 0) {
      const cardWidth = track.scrollWidth / total;
      track.scrollTo({ left: cardWidth * VISIBLE_COUNT * clamped, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-[17px] font-bold text-gray-900">Services for Every Stage</h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Find the right experts for every milestone of your startup journey.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0 mt-1">
          <Link
            to="/network/services?view=all"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-500 transition-colors"
          >
            See all services <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {maxPage > 0 && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
              <button
                onClick={() => scrollToPage(page - 1)}
                disabled={!canPrev}
                aria-label="Previous services"
                className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToPage(page + 1)}
                disabled={!canNext}
                aria-label="Next services"
                className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isError && (
        <p className="text-sm text-gray-400 py-6 text-center">
          Couldn't load categories right now. Please refresh.
        </p>
      )}

      <div
        ref={trackRef}
        className="flex items-stretch overflow-x-auto scroll-smooth -mx-1.5 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingTop: 4, paddingBottom: 4 }} // headroom so the tilt/scale doesn't clip
      >
        {isLoading
          ? Array.from({ length: VISIBLE_COUNT }).map((_, i) => <CategorySkeleton key={i} />)
          : categories.map((cat, i) => (
              <div key={cat.id} className="snap-start flex">
                <CategoryCell cat={cat} isFirst={i === 0} />
              </div>
            ))}
      </div>

      {/* Mobile: see all link (swipe handles navigation on touch) */}
      <div className="flex md:hidden items-center justify-center mt-5">
        <Link
          to="/network/services?view=all"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
        >
          See all services <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
// import { useRef, useState, useCallback, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
// import * as LucideIcons from 'lucide-react';
// import type { LucideIcon } from 'lucide-react';
// import { useServiceCategories } from '@/hooks/useServices';

// // ─── Dynamic icon resolver ────────────────────────────────────────────────
// // `cat.icon` stores the exact lucide-react component name (e.g. "Scale",
// // "Bot", "Laptop") set from the Django admin. New categories/icons need
// // zero frontend changes — just pick a valid Lucide name in the admin.
// function resolveIcon(name: string): LucideIcon {
//   const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
//   return Icon ?? HelpCircle;
// }

// // ─── Static color palette ─────────────────────────────────────────────────
// // Tailwind needs literal class names (no template strings) to detect them
// // at build time, so this map must stay explicit — but it only changes if
// // you add a brand-new color option, which is rare. Keys match the backend's
// // ServiceCategory.COLOR_CHOICES.
// const PALETTE: Record<string, { bg: string; text: string }> = {
//   red:     { bg: 'bg-red-50',     text: 'text-red-500' },
//   orange:  { bg: 'bg-orange-50',  text: 'text-orange-500' },
//   amber:   { bg: 'bg-amber-50',   text: 'text-amber-500' },
//   lime:    { bg: 'bg-lime-50',    text: 'text-lime-600' },
//   green:   { bg: 'bg-green-50',   text: 'text-green-600' },
//   emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
//   teal:    { bg: 'bg-teal-50',    text: 'text-teal-600' },
//   cyan:    { bg: 'bg-cyan-50',    text: 'text-cyan-600' },
//   sky:     { bg: 'bg-sky-50',     text: 'text-sky-600' },
//   blue:    { bg: 'bg-blue-50',    text: 'text-blue-600' },
//   indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600' },
//   violet:  { bg: 'bg-violet-50',  text: 'text-violet-600' },
//   purple:  { bg: 'bg-purple-50',  text: 'text-purple-600' },
//   fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
//   pink:    { bg: 'bg-pink-50',    text: 'text-pink-500' },
//   slate:   { bg: 'bg-slate-50',   text: 'text-slate-600' },
//   gray:    { bg: 'bg-gray-50',    text: 'text-gray-500' },
// };

// function getStyle(color: string) {
//   return PALETTE[color] ?? PALETTE.gray;
// }

// const VISIBLE_COUNT = 5;

// function CategorySkeleton() {
//   return (
//     <div className="shrink-0 basis-1/5 min-w-[180px] px-1.5 flex">
//       <div className="px-4 py-3 w-full animate-pulse border border-gray-100 rounded-xl" style={{ height: 176 }}>
//         <div className="h-10 w-10 rounded-lg bg-gray-100 mb-3" />
//         <div className="h-3.5 w-20 bg-gray-100 rounded mb-2" />
//         <div className="h-3 w-24 bg-gray-50 rounded mb-3" />
//         <div className="h-3 w-16 bg-gray-50 rounded" />
//       </div>
//     </div>
//   );
// }

// // ─── Tilt + glow card, matching ProviderCard's "liquid glass" hover effect ──
// function CategoryCell({ cat, isFirst }: { cat: any; isFirst: boolean }) {
//   const Icon = resolveIcon(cat.icon);
//   const style = getStyle(cat.color);
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [tilt, setTilt] = useState({ x: 0, y: 0 });
//   const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
//   const [hovered, setHovered] = useState(false);

//   const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
//     const card = cardRef.current;
//     if (!card) return;
//     const rect = card.getBoundingClientRect();
//     const cx = e.clientX - rect.left;
//     const cy = e.clientY - rect.top;
//     setTilt({
//       x: ((cy / rect.height) - 0.5) * -10,
//       y: ((cx / rect.width) - 0.5) * 10,
//     });
//     setGlowPos({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
//   }, []);

//   const handleMouseLeave = useCallback(() => {
//     setTilt({ x: 0, y: 0 });
//     setHovered(false);
//   }, []);

//   return (
//     <div className="shrink-0 basis-1/5 min-w-[180px] px-1.5 flex" style={{ perspective: '900px' }}>
//       <div
//         ref={cardRef}
//         onMouseMove={handleMouseMove}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={handleMouseLeave}
//         className="relative bg-white rounded-xl overflow-hidden w-full"
//         style={{
//           border: '1px solid #e5e7eb',
//           height: 176,
//           // transform: hovered
//           //   ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(14px) scale(1.015)`
//           //   : 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
//           // transition: hovered
//           //   ? 'transform 0.08s ease-out, box-shadow 0.2s ease-out'
//           //   : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease-out',
//           boxShadow: hovered
//             ? '0 20px 60px -8px rgba(0,0,0,0.16), 0 8px 20px -4px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)'
//             : '0 1px 3px rgba(0,0,0,0.05)',
//           willChange: 'transform',
//         }}
//       >
//         {/* macOS liquid glow */}
//         {hovered && (
//           <div
//             className="absolute inset-0 pointer-events-none rounded-xl z-10"
//             style={{
//               background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
//               mixBlendMode: 'screen',
//             }}
//           />
//         )}

//         <Link
//           to={`/network/services/${cat.slug}`}
//           className="group relative flex flex-col h-full px-4 py-3"
//         >
//           {isFirst && (
//             <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
//               Most Popular
//             </span>
//           )}
//           <span className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${style.bg} ${style.text} mb-3 shrink-0`}>
//             <Icon className="h-5 w-5" />
//           </span>
//           <p className="text-[14px] font-bold text-gray-900 leading-snug mb-1 line-clamp-1">{cat.name}</p>
//           {cat.description && (
//             <p className="text-[12px] text-gray-400 leading-snug mb-3 line-clamp-2">{cat.description}</p>
//           )}
//           <p className="text-[12px] font-semibold text-blue-600 mt-auto inline-flex items-center gap-1 shrink-0">
//             {cat.provider_count > 0 ? `${cat.provider_count} Providers` : 'View providers'}
//             <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
//           </p>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export function ServiceCategoryGrid() {
//   const { data: categories = [], isLoading, isError } = useServiceCategories();
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [page, setPage] = useState(0);

//   const total = categories.length;
//   const maxPage = Math.max(0, Math.ceil(total / VISIBLE_COUNT) - 1);
//   const canPrev = page > 0;
//   const canNext = page < maxPage;

//   // Keep page in range if the category list shrinks/loads in
//   useEffect(() => {
//     if (page > maxPage) setPage(maxPage);
//   }, [maxPage, page]);

//   const scrollToPage = (next: number) => {
//     const clamped = Math.max(0, Math.min(maxPage, next));
//     setPage(clamped);
//     const track = trackRef.current;
//     if (track && total > 0) {
//       const cardWidth = track.scrollWidth / total;
//       track.scrollTo({ left: cardWidth * VISIBLE_COUNT * clamped, behavior: 'smooth' });
//     }
//   };

//   return (
//     <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
//       <div className="flex items-start justify-between mb-3">
//         <div>
//           <h2 className="text-[17px] font-bold text-gray-900">Services for Every Stage</h2>
//           <p className="text-[13px] text-gray-400 mt-0.5">
//             Find the right experts for every milestone of your startup journey.
//           </p>
//         </div>

//         <div className="hidden md:flex items-center gap-3 shrink-0 mt-1">
//           <Link
//             to="/network/services?view=all"
//             className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:text-blue-500 transition-colors"
//           >
//             See all services <ArrowRight className="h-3.5 w-3.5" />
//           </Link>

//           {maxPage > 0 && (
//             <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
//               <button
//                 onClick={() => scrollToPage(page - 1)}
//                 disabled={!canPrev}
//                 aria-label="Previous services"
//                 className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => scrollToPage(page + 1)}
//                 disabled={!canNext}
//                 aria-label="Next services"
//                 className="h-7 w-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {isError && (
//         <p className="text-sm text-gray-400 py-6 text-center">
//           Couldn't load categories right now. Please refresh.
//         </p>
//       )}

//       <div
//         ref={trackRef}
//         className="flex items-stretch overflow-x-auto scroll-smooth -mx-1.5 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
//         style={{ paddingTop: 4, paddingBottom: 4 }} // headroom so the tilt/scale doesn't clip
//       >
//         {isLoading
//           ? Array.from({ length: VISIBLE_COUNT }).map((_, i) => <CategorySkeleton key={i} />)
//           : categories.map((cat, i) => (
//               <div key={cat.id} className="snap-start flex">
//                 <CategoryCell cat={cat} isFirst={i === 0} />
//               </div>
//             ))}
//       </div>

//       {/* Mobile: see all link (swipe handles navigation on touch) */}
//       <div className="flex md:hidden items-center justify-center mt-5">
//         <Link
//           to="/network/services?view=all"
//           className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
//         >
//           See all services <ArrowRight className="h-4 w-4" />
//         </Link>
//       </div>
//     </section>
//   );
// }