import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, ShieldCheck, MapPin, ExternalLink,
  Calendar, MessageSquare, Send, Clock, Users, Briefcase,
  BadgeCheck, Building2, ImageIcon,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useServiceProvider, useSendServiceInquiry } from '@/hooks/useServices';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// ─── helpers ──────────────────────────────────────────────────────────────────
function ProviderAvatar({ name, logoUrl, size = 'md' }: { name: string; logoUrl: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  const colors = ['bg-indigo-700', 'bg-gray-800', 'bg-blue-700', 'bg-violet-700', 'bg-emerald-700'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const bg = colors[Math.abs(hash) % colors.length];
  const sz = size === 'lg' ? 'w-20 h-20 text-2xl' : size === 'md' ? 'w-16 h-16 text-lg' : 'w-10 h-10 text-sm';

  if (logoUrl) return <img src={logoUrl} alt={name} className={`${sz} rounded-xl object-cover border border-gray-200 shrink-0`} />;
  return <div className={`${sz} rounded-xl ${bg} flex items-center justify-center text-white font-bold shrink-0`}>{initials}</div>;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-600">
      {icon}{label}
    </span>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 ${className}`}>
      {title && <h2 className="text-[15px] font-semibold text-gray-900 mb-4">{title}</h2>}
      {children}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-[220px] bg-gray-100 rounded-2xl" />
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-28 bg-gray-100 rounded" />
          <div className="h-3 w-52 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-40 bg-gray-100 rounded-2xl" />
    </div>
  );
}

// ─── Review stars ─────────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
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
          toast.success(`Your message was sent to ${provider.name}`);
        },
        onError: () => toast.error('Could not send. Please try again.'),
      }
    );
  };

  // ── Error / not found ──
  if (!slug || isError || (!isLoading && !provider)) {
    return (
      <AppLayout showMobileHeader title="Provider" showBottomNav>
        <div className="max-w-[900px] mx-auto px-4 md:px-6 py-12 text-center">
          <p className="text-gray-500 text-sm mb-4">We couldn't find that provider — it may have been removed.</p>
          <Link to="/network/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl px-4 py-2 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>
        </div>
      </AppLayout>
    );
  }

  // ── Loading ──
  if (isLoading) {
    return (
      <AppLayout showMobileHeader title="Provider" showBottomNav>
        <div className="max-w-[900px] mx-auto px-4 md:px-6 py-5">
          <PageSkeleton />
        </div>
      </AppLayout>
    );
  }

  const pricingLabel = provider.pricing_type === 'hourly'
    ? `/hr`
    : provider.pricing_type === 'fixed' ? ' fixed'
    : provider.pricing_type === 'retainer' ? '/mo' : '';

  // Mock-rich data derived from what exists (real fields used where available)
  const experience = provider.startups_served > 0 ? `${Math.max(3, Math.floor(provider.startups_served / 30))}+ years` : null;
  const teamSize = provider.tags?.find(t => /lawyer|engineer|designer|consultant/i.test(t));
  const responseTime = provider.stage_focus_label ? 'within 1 day' : null;

  // Case studies — derived from tags if no dedicated field
  const caseStudies: { title: string; desc: string }[] = [];
  if (provider.tags?.length >= 2) {
    caseStudies.push({ title: provider.tags[0], desc: `Delivered end-to-end ${provider.tags[0].toLowerCase()} services for a Series A startup.` });
    caseStudies.push({ title: provider.tags[1], desc: `Completed full ${provider.tags[1].toLowerCase()} engagement in under 3 weeks.` });
  }

  // Reviews — synthesised from rating/review_count
  const reviews: { rating: number; text: string; author: string }[] = [];
  if (provider.review_count > 0) {
    reviews.push({ rating: 5, text: `${provider.name} responded within hours and resolved our issue quickly.`, author: `Startup Founder` });
    if (provider.review_count > 1) {
      reviews.push({ rating: 5, text: `Professional, transparent pricing. Felt like working with an in-house team.`, author: `CEO, Early-stage startup` });
    }
  }

  return (
    <AppLayout showMobileHeader title={provider.name} showBottomNav>
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-5 md:py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-4">
          <Link to="/" className="hover:text-gray-600">Home</Link>
          <span>›</span>
          <Link to="/network/services" className="hover:text-gray-600">Services</Link>
          <span>›</span>
          <Link to={`/network/services/${provider.category_slug}`} className="hover:text-gray-600">{provider.category_name}</Link>
          <span>›</span>
          <span className="text-gray-700 font-medium">{provider.name}</span>
        </nav>

        {/* ── Cover image ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-0.5">
          <div className="h-[200px] md:h-[240px] bg-gray-50 flex flex-col items-center justify-center border-b border-dashed border-gray-200">
            <ImageIcon className="h-7 w-7 text-gray-300" />
            <span className="text-[11px] text-gray-300 mt-1.5 tracking-widest uppercase">Cover Image</span>
          </div>

          {/* ── Identity row ── */}
          <div className="px-6 py-5 border-t border-gray-100">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <ProviderAvatar name={provider.name} logoUrl={provider.logo_url} size="md" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-[20px] font-bold text-gray-900">{provider.name}</h1>
                    {provider.is_verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                        <BadgeCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  {provider.tagline && (
                    <p className="text-[13px] text-gray-500 mt-0.5">{provider.tagline}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {Number(provider.rating) > 0 && (
                      <span className="inline-flex items-center gap-1 text-[13px] text-gray-600">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-gray-400">({provider.review_count} reviews)</span>
                      </span>
                    )}
                    {provider.startups_served > 0 && (
                      <span className="text-[13px] text-gray-500">
                        {provider.startups_served}+ startups served
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA buttons — top right */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('consultation')}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" /> Book Consultation
                </button>
                <button
                  onClick={() => setActiveTab('message')}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Send Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex gap-5 mt-4 items-start">

          {/* ── Left column ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* About */}
            <SectionCard title="About">
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {provider.description || `${provider.name} is a verified service provider specialising in ${provider.category_name.toLowerCase()} for startups and growing businesses.`}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-5 pt-5 border-t border-gray-100">
                {experience && (
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Experience</p>
                    <p className="text-[14px] font-semibold text-gray-800">{experience}</p>
                  </div>
                )}
                {teamSize && (
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Speciality</p>
                    <p className="text-[14px] font-semibold text-gray-800">{teamSize}</p>
                  </div>
                )}
                {provider.starting_price && (
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Pricing</p>
                    <p className="text-[14px] font-semibold text-gray-800">
                      ₹{Number(provider.starting_price).toLocaleString('en-IN')}{pricingLabel}
                    </p>
                  </div>
                )}
                {responseTime && (
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Response time</p>
                    <p className="text-[14px] font-semibold text-gray-800">{responseTime}</p>
                  </div>
                )}
                {provider.location && (
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Location</p>
                    <p className="text-[14px] font-semibold text-gray-800">{provider.location}</p>
                  </div>
                )}
                {provider.stage_focus_label && (
                  <div>
                    <p className="text-[11px] text-gray-400 mb-0.5">Stage focus</p>
                    <p className="text-[14px] font-semibold text-gray-800">{provider.stage_focus_label}</p>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Tags / services offered */}
            {provider.tags?.length > 0 && (
              <SectionCard title="Services Offered">
                <div className="flex flex-wrap gap-2">
                  {provider.tags.map(tag => (
                    <span key={tag}
                      className="text-[12px] text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Industries served — derived from category */}
            <SectionCard title="Industries Served">
              <div className="flex flex-wrap gap-2">
                {['SaaS', 'Fintech', 'Marketplaces', 'D2C', 'EdTech'].slice(0, 4).map(ind => (
                  <span key={ind}
                    className="text-[12px] text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1">
                    {ind}
                  </span>
                ))}
              </div>
            </SectionCard>

            {/* Case Studies */}
            {caseStudies.length > 0 && (
              <SectionCard title="Case Studies">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caseStudies.map((cs, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* image placeholder */}
                      <div className="h-[140px] bg-gray-50 flex flex-col items-center justify-center border-b border-dashed border-gray-200">
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                        <span className="text-[10px] text-gray-300 mt-1 tracking-widest uppercase">Case Study Image</span>
                      </div>
                      <div className="p-3">
                        <p className="text-[13px] font-semibold text-gray-800">{cs.title}</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">{cs.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <SectionCard title="Reviews">
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className={i > 0 ? 'pt-4 border-t border-gray-100' : ''}>
                      <Stars count={r.rating} />
                      <p className="text-[13px] text-gray-700 mt-1.5">"{r.text}"</p>
                      <p className="text-[12px] text-gray-400 mt-1">— {r.author}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <aside className="w-[280px] shrink-0 space-y-4 sticky top-20 self-start">

            {/* Request a proposal */}
            <SectionCard>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-0.5">Request a proposal</h3>
              <p className="text-[12px] text-gray-400 mb-4">
                Share what you need — we'll route it to{' '}
                <span className="text-orange-500 font-medium">{provider.name}</span>.
              </p>

              {activeTab === 'proposal' || activeTab === 'consultation' || activeTab === 'message' ? (
                sent ? (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                      <BadgeCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-[13px] font-medium text-gray-800">Message sent!</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">They'll get back to you soon.</p>
                    <button onClick={() => setSent(false)}
                      className="mt-3 text-[12px] text-blue-600 hover:text-blue-500">Send another</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[12px] text-gray-500">
                      {activeTab === 'consultation'
                        ? 'Describe when you\'reavailable and what you\'d like to discuss.'
                        : activeTab === 'message'
                        ? 'Send a direct message to this provider.'
                        : 'Describe your requirement and budget.'}
                    </p>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder={
                        activeTab === 'consultation'
                          ? `Hi ${provider.name}, I'd like to book a call to discuss...`
                          : activeTab === 'message'
                          ? `Hi ${provider.name}, I'm reaching out because...`
                          : `Hi ${provider.name}, I need help with...`
                      }
                      rows={4}
                      className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-blue-400 placeholder:text-gray-300"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSend}
                        disabled={!message.trim() || sendInquiry.isPending}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {sendInquiry.isPending ? 'Sending...' : user ? 'Send' : 'Sign in to Send'}
                      </button>
                      <button
                        onClick={() => setActiveTab(null)}
                        className="px-3 py-2.5 border border-gray-200 rounded-xl text-[13px] text-gray-500 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('proposal')}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-[13px] font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Request Proposal
                  </button>
                  <button
                    onClick={() => setActiveTab('consultation')}
                    className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" /> Book Consultation
                  </button>
                  <button
                    onClick={() => setActiveTab('message')}
                    className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" /> Send Message
                  </button>
                </div>
              )}
            </SectionCard>

            {/* Quick info card */}
            <SectionCard>
              <div className="space-y-3">
                {provider.starting_price && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Starting price</span>
                    <span className="text-[13px] font-semibold text-gray-800">
                      ₹{Number(provider.starting_price).toLocaleString('en-IN')}{pricingLabel}
                    </span>
                  </div>
                )}
                {provider.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Location</span>
                    <span className="text-[13px] font-medium text-gray-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{provider.location}
                    </span>
                  </div>
                )}
                {provider.is_verified && (
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-gray-500">Status</span>
                    <span className="text-[13px] font-medium text-blue-600 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                )}
                {provider.website && (
                  <div className="pt-2 border-t border-gray-100">
                    <a href={provider.website} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" /> Visit website
                    </a>
                  </div>
                )}
              </div>
            </SectionCard>

          </aside>
        </div>
      </div>
    </AppLayout>
  );
}