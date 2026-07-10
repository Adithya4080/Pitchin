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
import { TrustSnapshot } from '@/components/network/provider-profile/TrustSnapshot';
import { ExpertiseSection } from '@/components/network/provider-profile/ExpertiseSection';
import { ServicesGrid } from '@/components/network/provider-profile/ServicesGrid';
import { BestFitFor } from '@/components/network/provider-profile/BestFitFor';
import { PortfolioGrid } from '@/components/network/provider-profile/PortfolioGrid';
import { CollaboratorsSection } from '@/components/network/provider-profile/CollaboratorsSection';
import { ProcessSteps } from '@/components/network/provider-profile/ProcessSteps';
import { CertificationsGrid } from '@/components/network/provider-profile/CertificationsGrid';
import { FaqSection } from '@/components/network/provider-profile/FaqSection';

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
  .pd-popup-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    box-shadow: 0 10px 32px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04);
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

  /* Trust snapshot — standard proportional row, no boxes */
  .pd-trust-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px 20px;
  }
  .pd-trust-item {
    display: flex; align-items: center; gap: 10px;
    padding-top: 14px; border-top: 1px solid #f3f4f6;
  }
  .pd-trust-icon {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #f9fafb;
  }
  .pd-trust-val { font-size: 14px; font-weight: 700; color: #111827; margin: 0; }
  .pd-trust-label { font-size: 11.5px; color: #9ca3af; margin: 1px 0 0; line-height: 1.3; }

  /* Service cards (sub-categories) */
  .pd-service-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
  }
  .pd-service-card {
    border: 1px solid #f0f0f0; border-radius: 12px; padding: 14px;
    transition: border-color 0.15s;
  }
  .pd-service-card:hover { border-color: #d1d5db; }

  /* Portfolio — project showcase cards */
  .pd-project-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  }
  .pd-project-card {
    display: block; border-radius: 12px; overflow: hidden;
    border: 1px solid #f0f0f0; background: #fff; text-decoration: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  a.pd-project-card:hover { border-color: #d1d5db; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .pd-project-image {
    aspect-ratio: 16/10; background: #fafafa;
  }
  .pd-project-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pd-project-body { padding: 12px 14px; }
  .pd-project-title { font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 4px; }
  .pd-project-desc { font-size: 12px; color: #6b7280; margin: 0; line-height: 1.5; }
  .pd-project-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11.5px; font-weight: 600; margin-top: 8px;
  }

  /* Collaborators / "Trusted by" strip */
  .pd-collab-strip { display: flex; flex-wrap: wrap; gap: 10px; }
  .pd-collab-item {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid #f0f0f0; border-radius: 10px; padding: 8px 12px;
    text-decoration: none; transition: border-color 0.15s;
  }
  a.pd-collab-item:hover { border-color: #d1d5db; }
  .pd-collab-logo { width: 24px; height: 24px; border-radius: 6px; object-fit: cover; display: block; }
  .pd-collab-logo-fallback {
    display: flex; align-items: center; justify-content: center;
    background: #f4f4f5; color: #9ca3af;
  }
  .pd-collab-name { font-size: 12.5px; font-weight: 600; color: #374151; }

  /* Process timeline */
  .pd-process-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  }
  .pd-process-step { display: flex; flex-direction: column; gap: 6px; }
  .pd-process-icon {
    width: 30px; height: 30px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: #f4f4f5; flex-shrink: 0;
  }

  /* Certifications */
  .pd-cert-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .pd-cert-item {
    display: flex; align-items: center; gap: 10px;
    border: 1px solid #f0f0f0; border-radius: 12px; padding: 12px;
  }

  /* FAQ */
  .pd-faq-item { border-bottom: 1px solid #f3f4f6; }
  .pd-faq-item:last-child { border-bottom: none; }
  .pd-faq-question {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0; background: none; border: none; cursor: pointer;
    font-size: 13px; font-weight: 600; color: #111827; text-align: left;
  }
  .pd-faq-answer { padding: 0 0 14px; font-size: 13px; color: #6b7280; line-height: 1.6; margin: 0; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .pd-two-col { flex-direction: column !important; }
    .pd-sidebar { width: 100% !important; position: static !important; }
    .pd-hero-actions { flex-direction: column !important; width: 100% !important; gap: 8px !important; }
    .pd-hero-actions button, .pd-hero-actions a { width: 100% !important; justify-content: center !important; }
    .pd-cs-grid { grid-template-columns: 1fr !important; }
    .pd-identity-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
    .pd-trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pd-service-grid { grid-template-columns: 1fr !important; }
    .pd-project-grid { grid-template-columns: 1fr !important; }
    .pd-process-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pd-cert-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .pd-stat-row { grid-template-columns: 1fr !important; }
    .pd-trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .pd-process-grid { grid-template-columns: 1fr !important; }
    .pd-project-grid { grid-template-columns: 1fr !important; }
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

  // Generic fallback FAQs — only used if the provider hasn't written their own yet.
  const faqs: { question: string; answer: string }[] = [
    {
      question: 'How does pricing work?',
      answer: provider.starting_price
        ? `Starting at ₹${Number(provider.starting_price).toLocaleString('en-IN')}${pricingLabel}. Final pricing depends on your specific scope — request a proposal for an exact quote.`
        : 'Pricing is scoped per project — send a proposal request with your requirement for a quote.',
    },
    {
      question: 'What stage of startup do you work with?',
      answer: provider.stage_focus_label
        ? `${provider.name} primarily works with startups at the ${provider.stage_focus_label.replace(' Focus', '').toLowerCase()}.`
        : `${provider.name} works with startups across stages — reach out to confirm fit for yours.`,
    },
    {
      question: 'How do I get started?',
      answer: 'Use "Request proposal" below to share your requirement, or "Book consultation" to schedule a call first.',
    },
  ];

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

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 8px 48px' }}>

          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 20, flexWrap: 'wrap' }}>
            <span><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#374151')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Home</Link></span>
            <span>›</span>
            <span><Link to="/network/services" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#374151')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Services</Link></span>
            <span>›</span>
            <span><Link to={`/network/services/${provider.category_slug}`} style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => (e.currentTarget.style.color = '#374151')} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>{provider.category_name}</Link></span>
            <span>›</span>
            <span style={{ color: '#374151', fontWeight: 600 }}>{provider.name}</span>
          </nav>

        {/* ── IDENTITY CARD — big banner, small logo overlapping bottom-left ── */}
        <div style={{
          background: '#fff',
          border: '1px solid #f0f0f0',
          borderRadius: 20,
          marginBottom: 16,
          overflow: 'hidden',
        }}>
          {/* Big banner */}
          <div style={{ height: 260, position: 'relative', background: avatarBg }}>
            {provider.banner_url ? (
              <img
                src={provider.banner_url}
                alt={`${provider.name} banner`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: `linear-gradient(135deg, ${avatarBg} 0%, ${accent}33 100%)`,
              }} />
            )}
          </div>

          <div style={{ padding: '0 20px 20px', position: 'relative' }}>
            {/* Small logo, overlapping the banner bottom-left */}
            <div style={{
              marginTop: -32,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 8,
            }}>
              <div style={{
                padding: 3, background: '#fff', borderRadius: 14,
                boxShadow: '0 2px 10px rgba(0,0,0,0.10)', flexShrink: 0,
              }}>
                {provider.logo_url ? (
                  <img
                    src={provider.logo_url}
                    alt={`${provider.name} logo`}
                    style={{ width: 56, height: 56, borderRadius: 11, objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <ProviderAvatar name={provider.name} avatarBg={avatarBg} size={56} />
                )}
              </div>

              {/* Action buttons */}
              <div className="pd-hero-actions" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
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

            {/* Name + meta below the logo */}
            <div style={{ marginTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 19, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
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
                {provider.is_top_rated && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, color: '#f97316',
                    background: '#fff7ed', border: '1px solid #fed7aa',
                    borderRadius: 20, padding: '3px 10px',
                  }}>
                    Top Rated
                  </span>
                )}
              </div>

              {provider.category_name && (
                <span style={{
                  display: 'inline-flex', marginTop: 6,
                  fontSize: 11, fontWeight: 600, color: '#4b5563',
                  background: '#f9fafb', border: '1px solid #f1f1f1',
                  borderRadius: 20, padding: '3px 10px',
                }}>
                  {provider.category_name}
                </span>
              )}

              {provider.tagline && (
                <p style={{ fontSize: 13, color: '#6b7280', margin: '6px 0 0' }}>{provider.tagline}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
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

            {/* Plain divider — no accent gradient */}
            <div style={{ height: 1, background: '#f3f4f6', marginTop: 16 }} />
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

            {/* Trust snapshot */}
            <TrustSnapshot provider={provider} accent={accent} />

            {/* Expertise / skills */}
            <ExpertiseSection tags={provider.tags} />

            {/* Services grid — real sub-categories set by the provider */}
            <ServicesGrid subCategories={provider.sub_categories} />

            {/* Best fit for — real stage focus, not a fabricated industry list */}
            <BestFitFor stageFocusLabel={provider.stage_focus_label} />

            {/* Portfolio — real work-sample uploads from the provider's own dashboard */}
            <PortfolioGrid media={provider.media || []} accent={accent} />

            {/* Trusted by — real companies/brands the provider has worked with */}
            <CollaboratorsSection collaborators={provider.collaborators || []} />

            {/* How we work */}
            <ProcessSteps accent={accent} />

            {/* Certifications — real verified / top-rated flags only */}
            <CertificationsGrid isVerified={provider.is_verified} isTopRated={provider.is_top_rated} accent={accent} />

            {/* FAQ — provider's own written FAQs, falling back to generic ones */}
            <FaqSection faqs={provider.faqs} fallback={faqs} />
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="pd-sidebar" style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 80 }}>

            <div className="pd-popup-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 4, background: accent }} />
              <div style={{ padding: 18 }}>
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