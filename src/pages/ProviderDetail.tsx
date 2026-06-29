import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, ShieldCheck, MapPin, ExternalLink,
  Calendar, MessageSquare, Send, BadgeCheck,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useServiceProvider, useSendServiceInquiry } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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

// ─── Injected styles ──────────────────────────────────────────────────────────
const PAGE_STYLES = `
  .pd-action-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600;
    padding: 8px 16px; border-radius: 24px;
    border: 1px solid #e2e8f0;
    background: #fff; color: #374151;
    cursor: pointer; transition: all 0.15s;
    text-decoration: none;
  }
  .pd-action-btn:hover { border-color: #94a3b8; color: #111827; background: #f8fafc; }
  .pd-action-btn.primary {
    background: #0f0f0f; color: #fff; border-color: #0f0f0f;
  }
  .pd-action-btn.primary:hover { background: #1f1f1f; border-color: #1f1f1f; opacity: 0.9; }

  .pd-tag {
    display: inline-flex; align-items: center;
    font-size: 12px; color: #4b5563;
    background: #f9fafb; border: 1px solid #f1f1f1;
    border-radius: 20px; padding: 4px 12px;
    font-weight: 500;
  }

  .pd-sidebar-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    font-size: 13px; font-weight: 600; padding: 11px;
    border-radius: 12px; cursor: pointer; transition: all 0.15s;
    border: 1px solid #e5e7eb; background: #fff; color: #374151;
  }
  .pd-sidebar-btn:hover { background: #f8fafc; border-color: #94a3b8; }
  .pd-sidebar-btn.primary {
    background: #0f0f0f; color: #fff; border-color: #0f0f0f;
  }
  .pd-sidebar-btn.primary:hover { opacity: 0.88; }
  .pd-sidebar-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .pd-section {
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 16px;
    padding: 22px;
  }
  .pd-section-title {
    font-size: 14px; font-weight: 700;
    color: #0f172a; margin: 0 0 16px;
    letter-spacing: -0.1px;
  }
  .pd-stat-row {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px 24px;
    padding-top: 16px; margin-top: 16px;
    border-top: 1px solid #f3f4f6;
  }
  .pd-stat-label { font-size: 11px; color: #9ca3af; margin: 0 0 3px; }
  .pd-stat-val { font-size: 14px; font-weight: 700; color: #111827; margin: 0; }

  .pd-review {
    padding: 14px;
    background: #fafafa;
    border: 1px solid #f1f1f1;
    border-radius: 12px;
  }

  .pd-cs-card {
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .pd-cs-card:hover { border-color: #d1d5db; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .pd-two-col { flex-direction: column !important; }
    .pd-sidebar { width: 100% !important; position: static !important; }
    .pd-hero-actions { flex-direction: column !important; width: 100% !important; gap: 8px !important; }
    .pd-hero-actions button, .pd-hero-actions a { width: 100% !important; justify-content: center !important; }
    .pd-cs-grid { grid-template-columns: 1fr !important; }
    .pd-identity-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
  }
  @media (max-width: 480px) {
    .pd-stat-row { grid-template-columns: 1fr !important; }
  }
`;

// ─── Avatar ───────────────────────────────────────────────────────────────────
function ProviderAvatar({
  name, avatarBg, size = 80,
}: { name: string; avatarBg: string; size?: number }) {
  const parts = name.trim().split(/\s+/);
  const initials = [parts[0]?.[0], parts[1]?.[0]]
    .filter(Boolean).map(c => c!.toUpperCase()).join('');
  return (
    <div style={{
      width: size, height: size, borderRadius: 14, flexShrink: 0,
      background: avatarBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.30, fontWeight: 700, color: '#fff', letterSpacing: '1px',
    }}>
      {initials}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
      ))}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-pulse">
      <div style={{ height: 260, background: '#f3f4f6', borderRadius: 20 }} />
      <div style={{ height: 100, background: '#f9fafb', borderRadius: 16 }} />
      <div style={{ height: 200, background: '#f9fafb', borderRadius: 16 }} />
    </div>
  );
}

// ─── hexToRgb ─────────────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

// ─── Shared hero sub-components ───────────────────────────────────────────────
function GridOverlay() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
      <defs>
        <pattern id="pd-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pd-hero-grid)" />
    </svg>
  );
}

function GlowBlob({ accent, top, right }: { accent: string; top: number; right: number }) {
  return (
    <div style={{
      position: 'absolute', top, right,
      width: 180, height: 180, borderRadius: '50%',
      background: accent, opacity: 0.12,
      filter: 'blur(55px)', pointerEvents: 'none',
    }} />
  );
}

function CategoryPill({ accent, label }: { accent: string; label: string }) {
  return (
    <div style={{
      position: 'absolute', top: 16, left: 20,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20, padding: '4px 12px',
      zIndex: 2,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em', textTransform: 'capitalize' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Hero illustration — banner only, NO overflow issues ──────────────────────
// Note: borderRadius only on top corners; bottom is straight so the card below connects.
// overflow:hidden is scoped here so avatar (rendered outside) is never clipped.
function HeroIllustration({ accent, avatarBg, categorySlug }: {
  accent: string; avatarBg: string; categorySlug?: string;
}) {
  const slug = (categorySlug ?? '').toLowerCase();
  const wrapStyle: React.CSSProperties = {
    position: 'relative', height: 180, overflow: 'hidden',
    borderRadius: '20px 20px 0 0',
  };

  if (slug.includes('marketing')) return (
    <div style={{ ...wrapStyle, background: `linear-gradient(135deg, #0a1628 0%, ${avatarBg} 100%)` }}>
      <GridOverlay />
      <GlowBlob accent={accent} top={-30} right={60} />
      <svg viewBox="0 0 520 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {[40, 70, 55, 90, 65, 80].map((h, i) => (
          <rect key={i} x={80 + i * 44} y={160 - h} width={28} height={h} rx={4} fill={accent} opacity={0.15 + i * 0.1} />
        ))}
        <polyline points="80,140 124,110 168,120 212,80 256,95 300,55" fill="none" stroke={accent} strokeWidth="2" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
        {[{x:80,y:140},{x:124,y:110},{x:168,y:120},{x:212,y:80},{x:256,y:95},{x:300,y:55}].map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={accent} opacity="0.8" />
        ))}
        <g transform="translate(360,50)" opacity="0.55">
          <polygon points="0,20 0,40 15,40 15,20 40,5 40,55 15,55 15,40" fill="none" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M15,55 Q12,70 5,72 Q0,72 0,65 L0,55" fill="none" stroke={accent} strokeWidth="1.5" />
          <path d="M40,10 Q55,30 55,30 Q55,30 40,50" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" />
        </g>
      </svg>
      <CategoryPill accent={accent} label="Marketing" />
    </div>
  );

  if (slug.includes('legal') || slug.includes('legel')) return (
    <div style={{ ...wrapStyle, background: `linear-gradient(135deg, #0a0a14 0%, ${avatarBg} 100%)` }}>
      <GridOverlay />
      <GlowBlob accent={accent} top={-20} right={80} />
      <svg viewBox="0 0 520 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g transform="translate(180,20)" opacity="0.65">
          <line x1="70" y1="10" x2="70" y2="130" stroke={accent} strokeWidth="1.5" />
          <line x1="20" y1="40" x2="120" y2="40" stroke={accent} strokeWidth="1.5" />
          <circle cx="70" cy="10" r="4" fill={accent} />
          <line x1="20" y1="40" x2="20" y2="80" stroke={accent} strokeWidth="1" opacity="0.6" />
          <path d="M5,80 Q20,95 35,80" fill="none" stroke={accent} strokeWidth="1.5" />
          <line x1="120" y1="40" x2="120" y2="95" stroke={accent} strokeWidth="1" opacity="0.6" />
          <path d="M105,95 Q120,110 135,95" fill="none" stroke={accent} strokeWidth="1.5" />
          <rect x="55" y="128" width="30" height="6" rx="3" fill={accent} opacity="0.4" />
        </g>
        <g transform="translate(360,40)" opacity="0.45">
          <rect x="0" y="0" width="80" height="100" rx="6" fill="none" stroke={accent} strokeWidth="1.5" />
          {[20,35,50,65,80].map((y,i) => (
            <line key={i} x1="12" y1={y} x2={i===4?50:68} y2={y} stroke={accent} strokeWidth="1" opacity="0.6" />
          ))}
        </g>
      </svg>
      <CategoryPill accent={accent} label="Legal" />
    </div>
  );

  if (slug.includes('web')) return (
    <div style={{ ...wrapStyle, background: `linear-gradient(135deg, #060d1f 0%, ${avatarBg} 100%)` }}>
      <GridOverlay />
      <GlowBlob accent={accent} top={-20} right={40} />
      <svg viewBox="0 0 520 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g transform="translate(70,25)" opacity="0.7">
          <rect x="0" y="0" width="220" height="140" rx="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" />
          <rect x="0" y="0" width="220" height="28" rx="8" fill={accent} opacity="0.08" />
          {[14,26,38].map((cx,i) => <circle key={i} cx={cx} cy={14} r={4} fill={accent} opacity={0.3 + i*0.1} />)}
          <rect x="50" y="8" width="120" height="12" rx="6" fill={accent} opacity="0.1" />
          {[{x:14,w:80,o:0.5},{x:24,w:120,o:0.35},{x:24,w:90,o:0.35},{x:14,w:60,o:0.5},{x:24,w:140,o:0.3},{x:34,w:70,o:0.25},{x:24,w:100,o:0.3},{x:14,w:40,o:0.5}].map((l,i)=>(
            <rect key={i} x={l.x} y={42+i*11} width={l.w} height={5} rx={2.5} fill={accent} opacity={l.o} />
          ))}
        </g>
        <text x="360" y="80" fontSize="48" fill={accent} opacity="0.15" fontFamily="monospace">{'{ }'}</text>
        <text x="390" y="130" fontSize="24" fill={accent} opacity="0.1" fontFamily="monospace">{'</>'}</text>
      </svg>
      <CategoryPill accent={accent} label="Web Development" />
    </div>
  );

  if (slug.includes('design') || slug.includes('brand')) return (
    <div style={{ ...wrapStyle, background: `linear-gradient(135deg, #0d0822 0%, ${avatarBg} 100%)` }}>
      <GridOverlay />
      <GlowBlob accent={accent} top={-30} right={60} />
      <svg viewBox="0 0 520 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <circle cx="150" cy="90" r="55" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.3" />
        <circle cx="150" cy="90" r="35" fill={accent} opacity="0.08" />
        <polygon points="260,35 305,120 215,120" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.35" />
        <rect x="330" y="40" width="80" height="80" rx="8" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.3" transform="rotate(15,370,80)" />
        {['#6366f1','#a855f7','#ec4899','#f59e0b','#10b981'].map((c,i)=>(
          <circle key={i} cx={110+i*22} cy={158} r={7} fill={c} opacity="0.7" />
        ))}
      </svg>
      <CategoryPill accent={accent} label="Design & Branding" />
    </div>
  );

  if (slug.includes('book') || slug.includes('finance') || slug.includes('account')) return (
    <div style={{ ...wrapStyle, background: `linear-gradient(135deg, #0c0a00 0%, ${avatarBg} 100%)` }}>
      <GridOverlay />
      <GlowBlob accent={accent} top={-20} right={50} />
      <svg viewBox="0 0 520 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g transform="translate(150,90)">
          <circle cx="0" cy="0" r="55" fill="none" stroke={accent} strokeWidth="12" strokeDasharray="173 173" opacity="0.5" />
          <circle cx="0" cy="0" r="55" fill="none" stroke={accent} strokeWidth="12" strokeDasharray="86 260" strokeDashoffset="-173" opacity="0.25" />
          <circle cx="0" cy="0" r="38" fill={avatarBg} />
          <text x="0" y="6" textAnchor="middle" fill={accent} fontSize="14" fontWeight="700" opacity="0.8">₹</text>
        </g>
        <g transform="translate(290,30)" opacity="0.4">
          <rect x="0" y="0" width="150" height="110" rx="6" fill="none" stroke={accent} strokeWidth="1" />
          <line x1="0" y1="22" x2="150" y2="22" stroke={accent} strokeWidth="1" opacity="0.5" />
          <line x1="90" y1="0" x2="90" y2="110" stroke={accent} strokeWidth="1" opacity="0.3" />
          {['Revenue','Expense','Net'].map((t,i)=>(
            <text key={i} x="8" y={42+i*26} fontSize="9" fill={accent} opacity="0.6" fontFamily="monospace">{t}</text>
          ))}
          {['₹4.2L','₹1.8L','₹2.4L'].map((v,i)=>(
            <text key={i} x="98" y={42+i*26} fontSize="9" fill={accent} opacity="0.8" fontFamily="monospace">{v}</text>
          ))}
        </g>
      </svg>
      <CategoryPill accent={accent} label="Bookkeeping" />
    </div>
  );

  // Default
  return (
    <div style={{ ...wrapStyle, background: `linear-gradient(135deg, #0c0f1d 0%, ${avatarBg} 100%)` }}>
      <GridOverlay />
      <GlowBlob accent={accent} top={-30} right={60} />
      <svg viewBox="0 0 520 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {[{x:160,y:90},{x:240,y:50},{x:240,y:130},{x:320,y:70},{x:320,y:110},{x:400,y:90}].map((n,i,arr)=>{
          const next = arr[i+1];
          return next ? <line key={i} x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke={accent} strokeWidth="1" opacity="0.25" /> : null;
        })}
        {[{x:160,y:90,r:8},{x:240,y:50,r:6},{x:240,y:130,r:5},{x:320,y:70,r:7},{x:320,y:110,r:5},{x:400,y:90,r:9}].map((n,i)=>(
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={accent} opacity={0.2+i*0.08} />
        ))}
      </svg>
      <CategoryPill accent={accent} label={categorySlug ?? 'Services'} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProviderDetail() {
  const { slug: rawSlug } = useParams<{ slug: string }>();
  const slug = rawSlug && rawSlug !== 'undefined' ? rawSlug : undefined;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: provider, isLoading, isError } = useServiceProvider(slug);
  const sendInquiry = useSendServiceInquiry();

  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'proposal' | 'consultation' | 'message' | null>(null);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!user) { navigate('/auth'); return; }
    if (!provider || !message.trim()) return;
    sendInquiry.mutate(
      { providerId: provider.id, message: message.trim() },
      {
        onSuccess: () => {
          setSent(true);
          setMessage('');
          setActiveTab(null);
          toast.success(`Message sent to ${provider.name}`);
        },
        onError: () => toast.error('Could not send. Please try again.'),
      }
    );
  };

  if (!slug || isError || (!isLoading && !provider)) {
    return (
      <AppLayout showMobileHeader title="Provider" showBottomNav>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
            We couldn't find that provider — it may have been removed.
          </p>
          <Link to="/network/services" className="pd-action-btn">
            <ArrowLeft size={14} /> Back to Services
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout showMobileHeader title="Provider" showBottomNav>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px' }}>
          <PageSkeleton />
        </div>
      </AppLayout>
    );
  }

  const { accent, avatarBg } = getCategoryColors(provider.category_slug);

  const pricingLabel = provider.pricing_type === 'hourly' ? '/hr'
    : provider.pricing_type === 'fixed' ? ' fixed'
    : provider.pricing_type === 'retainer' ? '/mo' : '';

  const experience = provider.startups_served > 0
    ? `${Math.max(3, Math.floor(provider.startups_served / 30))}+ years`
    : null;

  const caseStudies: { title: string; desc: string }[] = [];
  if (provider.tags?.length >= 2) {
    caseStudies.push({ title: provider.tags[0], desc: `End-to-end ${provider.tags[0].toLowerCase()} for a Series A startup.` });
    caseStudies.push({ title: provider.tags[1], desc: `Full ${provider.tags[1].toLowerCase()} engagement completed in under 3 weeks.` });
  }

  const reviews: { rating: number; text: string; author: string }[] = [];
  if (provider.review_count > 0) {
    reviews.push({ rating: 5, text: `${provider.name} responded within hours and resolved our issue quickly.`, author: 'Startup Founder' });
    if (provider.review_count > 1) {
      reviews.push({ rating: 5, text: 'Professional, transparent pricing. Felt like working with an in-house team.', author: 'CEO, Early-stage startup' });
    }
  }

  const tabPlaceholder = activeTab === 'consultation'
    ? `Hi ${provider.name}, I'd like to book a call to discuss...`
    : activeTab === 'message'
    ? `Hi ${provider.name}, I'm reaching out because...`
    : `Hi ${provider.name}, I need help with...`;

  const tabHelper = activeTab === 'consultation'
    ? "Describe when you're available and what you'd like to discuss."
    : activeTab === 'message'
    ? 'Send a direct message to this provider.'
    : 'Describe your requirement and budget.';

  return (
    <AppLayout showMobileHeader title={provider.name} showBottomNav>
      <style>{PAGE_STYLES}</style>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 16px 48px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 20, flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#374151')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Home</Link>
          <span>›</span>
          <Link to="/network/services" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#374151')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Services</Link>
          <span>›</span>
          <Link to={`/network/services/${provider.category_slug}`} style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#374151')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>{provider.category_name}</Link>
          <span>›</span>
          <span style={{ color: '#374151', fontWeight: 600 }}>{provider.name}</span>
        </nav>

        {/* ── HERO CARD ─────────────────────────────────────────────────────── */}
        {/*
          CRITICAL FIX:
          The card wrapper has NO overflow:hidden and NO borderRadius that would
          create a clipping stacking context. The illustration div handles its own
          top-corner rounding. The avatar sits in the white area below the banner,
          pushed UP visually by a negative marginTop on its wrapper — but since
          the card itself never clips, it renders correctly on top of the banner.
        */}
        <div style={{
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: 20,
          marginBottom: 16,
          /* NO overflow: hidden here — that was clipping the avatar */
        }}>
          {/* Banner illustration — has its own overflow:hidden scoped to itself */}
          <HeroIllustration accent={accent} avatarBg={avatarBg} categorySlug={provider.category_slug} />

          {/* Identity section */}
          <div style={{ padding: '0 20px 20px' }}>

            {/*
              LAYOUT STRATEGY:
              - Avatar floats up via negative marginTop, anchored left
              - Name + meta live in the white area, indented to clear the avatar
              - Action buttons sit top-right of the white area
              This avoids any flex-end alignment fighting with the overlap.
            */}

            {/* Row 1: avatar (overlapping) + action buttons flush right */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginTop: -40,
              flexWrap: 'wrap',
              gap: 8,
            }}>
              {/* Avatar with white border ring */}
              <div style={{
                padding: 3,
                background: '#fff',
                borderRadius: 17,
                boxShadow: `0 0 0 1px rgba(${hexToRgb(accent)},0.35), 0 4px 16px rgba(0,0,0,0.12)`,
                flexShrink: 0,
                position: 'relative',
                zIndex: 1,
              }}>
                <ProviderAvatar name={provider.name} avatarBg={avatarBg} size={72} />
              </div>

              {/* Action buttons — sit in the white area, aligned top-right */}
              <div className="pd-hero-actions" style={{
                display: 'flex', gap: 8, alignItems: 'center',
                flexWrap: 'wrap', marginTop: 48,
              }}>
                <button className="pd-action-btn" onClick={() => setActiveTab('consultation')}>
                  <Calendar size={13} /> Book consultation
                </button>
                <button className="pd-action-btn" onClick={() => setActiveTab('message')}>
                  <MessageSquare size={13} /> Message
                </button>
                {provider.website && (
                  <a href={provider.website} target="_blank" rel="noreferrer" className="pd-action-btn">
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>

            {/* Row 2: name + meta below the avatar */}
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>
                  {provider.name}
                </h1>
                {provider.is_verified && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 11, fontWeight: 600, color: '#2563eb',
                    background: '#eff6ff', border: '1px solid #bfdbfe',
                    borderRadius: 20, padding: '3px 10px',
                  }}>
                    <BadgeCheck size={12} /> Verified
                  </span>
                )}
              </div>
              {provider.tagline && (
                <p style={{ fontSize: 13, color: '#6b7280', margin: '3px 0 0' }}>{provider.tagline}</p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                {Number(provider.rating) > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151' }}>
                    <Star size={14} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                    <strong>{provider.rating}</strong>
                    <span style={{ color: '#9ca3af' }}>({provider.review_count} reviews)</span>
                  </span>
                )}
                {provider.location && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ca3af' }}>
                    <MapPin size={12} /> {provider.location}
                  </span>
                )}
                {provider.startups_served > 0 && (
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{provider.startups_served}+ startups served</span>
                )}
              </div>
            </div>

            {/* Accent divider */}
            <div style={{ height: 1, background: `linear-gradient(90deg, ${accent}33 0%, transparent 100%)`, marginTop: 16 }} />
          </div>
        </div>

        {/* ── TWO-COLUMN LAYOUT ─────────────────────────────────────────────── */}
        <div className="pd-two-col" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

          {/* LEFT COLUMN */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* About */}
            <div className="pd-section">
              <p className="pd-section-title">About</p>
              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                {provider.description || `${provider.name} is a verified service provider specialising in ${(provider.category_name || '').toLowerCase()} for startups and growing businesses.`}
              </p>
              <div className="pd-stat-row">
                {provider.starting_price && (
                  <div>
                    <p className="pd-stat-label">Starting price</p>
                    <p className="pd-stat-val" style={{ color: accent }}>₹{Number(provider.starting_price).toLocaleString('en-IN')}{pricingLabel}</p>
                  </div>
                )}
                {provider.location && (
                  <div>
                    <p className="pd-stat-label">Location</p>
                    <p className="pd-stat-val">{provider.location}</p>
                  </div>
                )}
                {experience && (
                  <div>
                    <p className="pd-stat-label">Experience</p>
                    <p className="pd-stat-val">{experience}</p>
                  </div>
                )}
                {provider.stage_focus_label && (
                  <div>
                    <p className="pd-stat-label">Stage focus</p>
                    <p className="pd-stat-val">{provider.stage_focus_label}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {provider.tags?.length > 0 && (
              <div className="pd-section">
                <p className="pd-section-title">Services offered</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {provider.tags.map((tag: string) => (
                    <span key={tag} className="pd-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Industries */}
            <div className="pd-section">
              <p className="pd-section-title">Industries served</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {['SaaS', 'Fintech', 'Marketplaces', 'D2C', 'EdTech'].slice(0, 4).map(ind => (
                  <span key={ind} className="pd-tag">{ind}</span>
                ))}
              </div>
            </div>

            {/* Case studies */}
            {caseStudies.length > 0 && (
              <div className="pd-section">
                <p className="pd-section-title">Case studies</p>
                <div className="pd-cs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {caseStudies.map((cs, i) => (
                    <div key={i} className="pd-cs-card">
                      <div style={{
                        height: 120,
                        background: `linear-gradient(135deg, ${avatarBg} 0%, #0f172a 100%)`,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
                          <svg width="100%" height="100%">
                            <defs>
                              <pattern id={`cs-grid-${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#cs-grid-${i})`} />
                          </svg>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', position: 'relative' }}>
                          Case Study
                        </span>
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{cs.title}</p>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{cs.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="pd-section">
                <p className="pd-section-title">Reviews</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reviews.map((r, i) => (
                    <div key={i} className="pd-review">
                      <Stars count={r.rating} />
                      <p style={{ fontSize: 13, color: '#374151', margin: '8px 0 6px', lineHeight: 1.6 }}>"{r.text}"</p>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>— {r.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="pd-sidebar" style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 80 }}>

            <div className="pd-section" style={{ padding: 18 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Request a proposal</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 16px', lineHeight: 1.5 }}>
                Share what you need — we'll route it to{' '}
                <span style={{ color: accent, fontWeight: 600 }}>{provider.name}</span>.
              </p>

              {(activeTab === 'proposal' || activeTab === 'consultation' || activeTab === 'message') ? (
                sent ? (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <BadgeCheck size={22} style={{ color: '#16a34a' }} />
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Message sent!</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px' }}>They'll get back to you soon.</p>
                    <button onClick={() => setSent(false)} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Send another</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{tabHelper}</p>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={tabPlaceholder}
                      rows={4}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        fontSize: 13, border: '1px solid #e5e7eb',
                        borderRadius: 10, padding: '10px 12px',
                        resize: 'none', outline: 'none',
                        color: '#111827', lineHeight: 1.5, transition: 'border-color 0.15s',
                      }}
                      onFocus={e => (e.target.style.borderColor = accent)}
                      onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={handleSend} disabled={!message.trim() || sendInquiry.isPending} className="pd-sidebar-btn primary" style={{ flex: 1 }}>
                        <Send size={14} />
                        {sendInquiry.isPending ? 'Sending…' : user ? 'Send' : 'Sign in to send'}
                      </button>
                      <button onClick={() => setActiveTab(null)} style={{ padding: '0 14px', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 13, color: '#6b7280', background: '#fff', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => setActiveTab('proposal')} className="pd-sidebar-btn primary">
                    <Send size={15} /> Request proposal
                  </button>
                  <button onClick={() => setActiveTab('consultation')} className="pd-sidebar-btn">
                    <Calendar size={15} /> Book consultation
                  </button>
                  <button onClick={() => setActiveTab('message')} className="pd-sidebar-btn">
                    <MessageSquare size={15} /> Send message
                  </button>
                </div>
              )}
            </div>

            {/* Quick info */}
            <div className="pd-section" style={{ padding: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {provider.starting_price && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Starting price</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>₹{Number(provider.starting_price).toLocaleString('en-IN')}{pricingLabel}</span>
                  </div>
                )}
                {provider.location && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Location</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {provider.location}
                    </span>
                  </div>
                )}
                {provider.is_verified && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Status</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ShieldCheck size={13} /> Verified
                    </span>
                  </div>
                )}
                {provider.website && (
                  <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
                    <a href={provider.website} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#111827')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                    >
                      <ExternalLink size={13} /> Visit website
                    </a>
                  </div>
                )}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </AppLayout>
  );
}