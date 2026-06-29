import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, MapPin, ExternalLink, Star } from 'lucide-react';
import { useServiceProviders, useServiceCategories } from '@/hooks/useServices';

// ─── Category color map ───────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { accent: string; avatarBg: string }> = {
  'designing-branding': { accent: '#6366f1', avatarBg: '#1e1b4b' },
  'designing':          { accent: '#6366f1', avatarBg: '#1e1b4b' },
  'branding':           { accent: '#a855f7', avatarBg: '#2e1065' },
  'marketing':          { accent: '#10b981', avatarBg: '#022c22' },
  'web-development':    { accent: '#3b82f6', avatarBg: '#172554' },
  'web':                { accent: '#3b82f6', avatarBg: '#172554' },
  'web-devolepment':    { accent: '#3b82f6', avatarBg: '#172554' },
  'bookkeeping':        { accent: '#f59e0b', avatarBg: '#431407' },
  'book-keeping':       { accent: '#f59e0b', avatarBg: '#431407' },
  'finance':            { accent: '#f59e0b', avatarBg: '#431407' },
  'legal':              { accent: '#ef4444', avatarBg: '#450a0a' },
  'legel':              { accent: '#ef4444', avatarBg: '#450a0a' },
  'documentation':      { accent: '#06b6d4', avatarBg: '#083344' },
  'hr':                 { accent: '#ec4899', avatarBg: '#500724' },
  'operations':         { accent: '#84cc16', avatarBg: '#1a2e05' },
};

const DEFAULT_COLORS = { accent: '#94a3b8', avatarBg: '#1e293b' };

function getCategoryColors(slug?: string) {
  if (!slug) return DEFAULT_COLORS;
  const key = slug.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_COLORS[key] ?? DEFAULT_COLORS;
}

// Inject card hover styles once
const CARD_STYLE = `
  .apv-card {
    background: #ffffff;
    border: 1px solid #f1f1f1;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    flex-direction: column;
  }
  .apv-card:hover {
    border-color: var(--card-accent-hover);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px -4px var(--card-shadow);
  }
  .apv-card-wash {
    pointer-events: none;
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 80px;
    opacity: 0;
    transition: opacity 0.2s ease;
    background: linear-gradient(180deg, var(--card-accent-wash) 0%, transparent 100%);
  }
  .apv-card:hover .apv-card-wash {
    opacity: 1;
  }
`;

interface Provider {
  id: number | string;
  name: string;
  category_slug?: string;
  category_name?: string;
  location?: string;
  tagline?: string;
  logo_url?: string;
  rating?: number | string;
  review_count?: number;
  is_verified?: boolean;
  website?: string;
}

function ProviderCard({ p }: { p: Provider }) {
  const { accent, avatarBg } = getCategoryColors(p.category_slug);
  const initials = p.name
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');
  const rating = Number(p.rating ?? 0);

  // Convert hex to rgb for shadow
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const cssVars = {
    '--card-accent-hover': accent + '66',
    '--card-accent-wash': accent,
    '--card-shadow': `rgba(${hexToRgb(accent)}, 0.15)`,
  } as React.CSSProperties;

  return (
    <div className="apv-card" style={cssVars}>
      {/* Gradient wash on hover */}
      <div className="apv-card-wash" />

      {/* Accent bar */}
      <div style={{ height: '3px', background: accent, flexShrink: 0 }} />

      {/* Body */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
        {/* Top: avatar + name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
          {p.logo_url ? (
            <img
              src={p.logo_url}
              alt={p.name}
              style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }}
            />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: avatarBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: '#ffffff', letterSpacing: '0.5px',
            }}>
              {initials}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.name}
              </p>
              {p.is_verified && (
                <ShieldCheck size={13} style={{ color: '#3b82f6', flexShrink: 0 }} strokeWidth={2.5} />
              )}
            </div>
            {p.category_name && (
              <p style={{ fontSize: 11, fontWeight: 600, color: accent, margin: '0 0 2px' }}>
                {p.category_name}
              </p>
            )}
            {p.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#9ca3af' }}>
                <MapPin size={10} />
                {p.location}
              </div>
            )}
          </div>
        </div>

        {/* Tagline */}
        {p.tagline && (
          <p style={{
            fontSize: 12, color: '#6b7280', lineHeight: 1.55, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {p.tagline}
          </p>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
            <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{rating.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: '#9ca3af' }}>({p.review_count ?? 0})</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
          <Link
            to={`/network/services/${p.category_slug}`}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#0f0f0f', color: '#ffffff',
              borderRadius: 10, padding: '8px 0',
              fontSize: 12, fontWeight: 600, textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            View profile
          </Link>
          {p.website && (
            <a
              href={p.website}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid #e5e7eb', borderRadius: 10, color: '#9ca3af',
                transition: 'all 0.15s', textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#9ca3af'; }}
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', border: '1px solid #f1f1f1', borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ height: 3, background: '#f3f4f6' }} />
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f3f4f6', flexShrink: 0 }} className="animate-pulse" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ height: 12, width: '60%', borderRadius: 6, background: '#f3f4f6' }} className="animate-pulse" />
            <div style={{ height: 10, width: '40%', borderRadius: 6, background: '#f9fafb' }} className="animate-pulse" />
          </div>
        </div>
        <div style={{ height: 10, width: '90%', borderRadius: 6, background: '#f9fafb' }} className="animate-pulse" />
        <div style={{ height: 10, width: '70%', borderRadius: 6, background: '#f9fafb' }} className="animate-pulse" />
        <div style={{ height: 34, borderRadius: 10, background: '#f3f4f6', marginTop: 4 }} className="animate-pulse" />
      </div>
    </div>
  );
}

export function AllProvidersView() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const { data: categories = [] } = useServiceCategories();
  const { data: providers = [], isLoading } = useServiceProviders({
    category: activeCategory || undefined,
    search: search || undefined,
    sort: 'top_rated',
  } as any);

  return (
    <>
      {/* Inject card hover CSS */}
      <style>{CARD_STYLE}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              Service providers
            </h2>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Browse vetted providers across every category
            </p>
          </div>
          <Link
            to="/network/services"
            style={{
              fontSize: 12, fontWeight: 500, color: '#6b7280',
              border: '1px solid #e5e7eb', borderRadius: 20,
              padding: '6px 14px', textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#111827'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
          >
            ← Back
          </Link>
        </div>

        {/* Search + count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
            <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search providers…"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 14px 9px 38px',
                border: '1px solid #e2e8f0', borderRadius: 24,
                background: '#ffffff', color: '#0f172a',
                fontSize: 13, outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#94a3b8')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>
          {!isLoading && (
            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto', flexShrink: 0 }}>
              {providers.length} provider{providers.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Category filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <button
            onClick={() => setActiveCategory('')}
            style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              border: '1px solid',
              borderColor: !activeCategory ? '#0f0f0f' : '#e5e7eb',
              background: !activeCategory ? '#0f0f0f' : '#ffffff',
              color: !activeCategory ? '#ffffff' : '#6b7280',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            All
          </button>

          {categories.map(c => {
            const { accent } = getCategoryColors(c.slug);
            const isActive = activeCategory === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(isActive ? '' : c.slug)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: '1px solid',
                  borderColor: isActive ? accent + '55' : '#e5e7eb',
                  background: isActive ? accent + '12' : '#ffffff',
                  color: isActive ? accent : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!isLoading && providers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', fontSize: 13, color: '#94a3b8' }}>
            No providers found.
          </div>
        )}

        {!isLoading && providers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {providers.map(p => <ProviderCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </>
  );
}