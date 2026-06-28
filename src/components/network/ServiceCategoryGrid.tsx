// import { Link } from 'react-router-dom';
// import { ArrowRight, Scale, Megaphone, FileText, Layout, Palette, Code2, TrendingUp, Shield, Users, HelpCircle } from 'lucide-react';
// import { useServiceCategories } from '@/hooks/useServices';

// // Map backend icon slugs → lucide icons + colors
// const ICON_MAP: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
//   scale: {
//     icon: <Scale className="h-6 w-6" />,
//     bg: 'bg-blue-50',
//     text: 'text-blue-600',
//   },
//   briefcase: {
//     icon: <FileText className="h-6 w-6" />,
//     bg: 'bg-indigo-50',
//     text: 'text-indigo-600',
//   },
//   megaphone: {
//     icon: <Megaphone className="h-6 w-6" />,
//     bg: 'bg-orange-50',
//     text: 'text-orange-500',
//   },
//   palette: {
//     icon: <Palette className="h-6 w-6" />,
//     bg: 'bg-pink-50',
//     text: 'text-pink-500',
//   },
//   code: {
//     icon: <Code2 className="h-6 w-6" />,
//     bg: 'bg-violet-50',
//     text: 'text-violet-600',
//   },
//   calculator: {
//     icon: <TrendingUp className="h-6 w-6" />,
//     bg: 'bg-emerald-50',
//     text: 'text-emerald-600',
//   },
//   'shield-check': {
//     icon: <Shield className="h-6 w-6" />,
//     bg: 'bg-red-50',
//     text: 'text-red-500',
//   },
//   users: {
//     icon: <Users className="h-6 w-6" />,
//     bg: 'bg-cyan-50',
//     text: 'text-cyan-600',
//   },
//   'trending-up': {
//     icon: <TrendingUp className="h-6 w-6" />,
//     bg: 'bg-green-50',
//     text: 'text-green-600',
//   },
//   other: {
//     icon: <HelpCircle className="h-6 w-6" />,
//     bg: 'bg-gray-50',
//     text: 'text-gray-500',
//   },
//   // presentation deck alias
//   presentation: {
//     icon: <Layout className="h-6 w-6" />,
//     bg: 'bg-amber-50',
//     text: 'text-amber-500',
//   },
// };

// function getIconConfig(icon: string) {
//   return ICON_MAP[icon] ?? ICON_MAP['other'];
// }

// // Skeleton card
// function CategorySkeleton() {
//   return (
//     <div className="rounded-xl border border-foreground/10 bg-white p-4 animate-pulse">
//       <div className="h-12 w-12 rounded-xl bg-foreground/[0.06] mb-3" />
//       <div className="h-4 w-24 bg-foreground/[0.06] rounded mb-2" />
//       <div className="h-3 w-32 bg-foreground/[0.04] rounded mb-3" />
//       <div className="h-3 w-16 bg-foreground/[0.04] rounded" />
//     </div>
//   );
// }

// export function ServiceCategoryGrid() {
//   const { data: categories = [], isLoading, isError } = useServiceCategories();

//   return (
//     <section>
//       {/* Section header */}
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h2 className="text-lg md:text-xl font-bold text-foreground">
//             Find Services for Your Startup
//           </h2>
//           <p className="text-sm text-foreground/55 mt-0.5">
//             Browse top categories and find the right experts to build, validate and scale.
//           </p>
//         </div>
//         <Link
//           to="/network/services?view=all"
//           className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0 mt-1"
//         >
//           View all services <ArrowRight className="h-4 w-4" />
//         </Link>
//       </div>

//       {/* Error state */}
//       {isError && (
//         <p className="text-sm text-foreground/55 py-6 text-center">
//           Couldn't load categories right now. Please refresh.
//         </p>
//       )}

//       {/* Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
//         {isLoading
//           ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
//           : categories.map((cat) => {
//               const { icon, bg, text } = getIconConfig(cat.icon);
//               return (
//                 <Link
//                   key={cat.id}
//                   to={`/network/services/${cat.slug}`}
//                   className="group flex flex-col rounded-xl border border-foreground/10 bg-white hover:border-primary/40 hover:shadow-sm transition-all p-4"
//                 >
//                   {/* Icon */}
//                   <span
//                     className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${bg} ${text} mb-3 group-hover:scale-105 transition-transform`}
//                   >
//                     {icon}
//                   </span>

//                   {/* Name */}
//                   <p className="text-sm font-semibold text-foreground leading-snug mb-1">
//                     {cat.name}
//                   </p>

//                   {/* Description (truncate to 2 lines) */}
//                   {cat.description && (
//                     <p className="text-[11px] text-foreground/50 leading-snug line-clamp-2 mb-3 flex-1">
//                       {cat.description}
//                     </p>
//                   )}

//                   {/* Provider count */}
//                   <p className="text-[11px] font-medium text-foreground/40 mt-auto">
//                     {cat.provider_count > 0
//                       ? `${cat.provider_count}+ Providers`
//                       : 'Coming soon'}
//                   </p>
//                 </Link>
//               );
//             })}
//       </div>

//       {/* Mobile "view all" link */}
//       <div className="flex md:hidden justify-center mt-4">
//         <Link
//           to="/network/services?view=all"
//           className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
//         >
//           View all services <ArrowRight className="h-4 w-4" />
//         </Link>
//       </div>
//     </section>
//   );
// }


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Megaphone, FileText, Layout, Palette, Code2, TrendingUp, Shield, Users, HelpCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { useServiceCategories } from '@/hooks/useServices';

const ICON_MAP: Record<string, { icon: React.ReactNode; accent: string; bg: string; lightBg: string }> = {
  scale:          { icon: <Scale className="h-5 w-5" />,      accent: '#2563EB', bg: '#1D4ED8', lightBg: '#EFF6FF' },
  briefcase:      { icon: <FileText className="h-5 w-5" />,   accent: '#4F46E5', bg: '#4338CA', lightBg: '#EEF2FF' },
  megaphone:      { icon: <Megaphone className="h-5 w-5" />,  accent: '#EA580C', bg: '#C2410C', lightBg: '#FFF7ED' },
  palette:        { icon: <Palette className="h-5 w-5" />,    accent: '#DB2777', bg: '#BE185D', lightBg: '#FDF2F8' },
  code:           { icon: <Code2 className="h-5 w-5" />,      accent: '#7C3AED', bg: '#6D28D9', lightBg: '#F5F3FF' },
  calculator:     { icon: <TrendingUp className="h-5 w-5" />, accent: '#059669', bg: '#047857', lightBg: '#ECFDF5' },
  'shield-check': { icon: <Shield className="h-5 w-5" />,     accent: '#DC2626', bg: '#B91C1C', lightBg: '#FEF2F2' },
  users:          { icon: <Users className="h-5 w-5" />,      accent: '#0891B2', bg: '#0E7490', lightBg: '#ECFEFF' },
  'trending-up':  { icon: <TrendingUp className="h-5 w-5" />, accent: '#16A34A', bg: '#15803D', lightBg: '#F0FDF4' },
  presentation:   { icon: <Layout className="h-5 w-5" />,     accent: '#D97706', bg: '#B45309', lightBg: '#FFFBEB' },
  lightbulb:      { icon: <Lightbulb className="h-5 w-5" />,  accent: '#7C3AED', bg: '#6D28D9', lightBg: '#F5F3FF' },
  other:          { icon: <HelpCircle className="h-5 w-5" />, accent: '#6B7280', bg: '#4B5563', lightBg: '#F9FAFB' },
};

function getIconConfig(icon: string) {
  return ICON_MAP[icon] ?? ICON_MAP['other'];
}

// Featured category gets a bigger card
function FeaturedCategoryCard({ cat, cfg }: { cat: any; cfg: ReturnType<typeof getIconConfig> }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/network/services/${cat.slug}`}
      className="group relative flex flex-col col-span-2 rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-100 hover:border-gray-200 hover:-translate-y-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background gradient that reveals on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${cfg.lightBg} 0%, white 50%)`,
          opacity: hovered ? 1 : 0
        }}
      />
      {/* Left colored bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
        style={{ background: cfg.accent, opacity: hovered ? 1 : 0.3 }}
      />

      <div className="relative p-5 flex items-start gap-4">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: cfg.lightBg, color: cfg.accent }}
        >
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[14px] font-bold text-gray-900 leading-snug">{cat.name}</p>
            <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </div>
          {cat.description && (
            <p className="text-[12px] text-gray-400 mt-1 leading-relaxed line-clamp-2">{cat.description}</p>
          )}
          <p className="text-[11px] font-semibold mt-2.5" style={{ color: cfg.accent }}>
            {cat.provider_count > 0 ? `${cat.provider_count}+ providers` : 'Coming soon'}
          </p>
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({ cat, cfg, idx }: { cat: any; cfg: ReturnType<typeof getIconConfig>; idx: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/network/services/${cat.slug}`}
      className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-gray-100/80 hover:border-gray-200 hover:-translate-y-0.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover fill */}
      <div
        className="absolute inset-0 transition-opacity duration-200 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${cfg.lightBg} 0%, white 55%)`, opacity: hovered ? 1 : 0 }}
      />
      <div className="relative p-4 flex flex-col h-full">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 shrink-0"
          style={{ background: cfg.lightBg, color: cfg.accent }}
        >
          {cfg.icon}
        </div>
        <p className="text-[13px] font-bold text-gray-900 leading-snug mb-1">{cat.name}</p>
        {cat.description && (
          <p className="text-[11px] text-gray-400 leading-snug line-clamp-2 flex-1 mb-2.5">{cat.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-[10px] font-semibold text-gray-300">
            {cat.provider_count > 0 ? `${cat.provider_count}+` : '—'}
          </p>
          <ArrowRight className="h-3 w-3 text-gray-200 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-150" />
        </div>
      </div>
    </Link>
  );
}

function CategorySkeleton({ wide }: { wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-4 animate-pulse ${wide ? 'col-span-2' : ''}`}>
      <div className="h-10 w-10 rounded-xl bg-gray-100 mb-3" />
      <div className="h-3.5 w-20 bg-gray-100 rounded mb-2" />
      <div className="h-3 w-32 bg-gray-50 rounded mb-1" />
      <div className="h-3 w-24 bg-gray-50 rounded" />
    </div>
  );
}

export function ServiceCategoryGrid() {
  const { data: categories = [], isLoading, isError } = useServiceCategories();

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Services for Every Stage
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Browse top categories. Find the right expert, fast.
          </p>
        </div>
        <Link
          to="/network/services?view=all"
          className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-bold text-gray-900 hover:text-gray-600 transition-colors border border-gray-200 rounded-xl px-3.5 py-2 hover:bg-gray-50"
        >
          See all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isError && (
        <p className="text-sm text-gray-400 py-6 text-center">Couldn't load categories. Please refresh.</p>
      )}

      {/* Asymmetric grid: first 2 featured (wide), rest normal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <CategorySkeleton key={i} wide={i < 2 && false} />)
          : categories.map((cat, idx) => {
              const cfg = getIconConfig(cat.icon);
              return <CategoryCard key={cat.id} cat={cat} cfg={cfg} idx={idx} />;
            })}
      </div>

      <div className="flex md:hidden justify-center mt-5">
        <Link to="/network/services?view=all" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-900">
          View all services <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
