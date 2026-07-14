import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  User,
  Rocket,
  Database,
  KeyRound,
  Wallet,
  SlidersHorizontal,
  Share2,
  Trash2,
  Bell,
  Fingerprint,
  Server,
  Clock,
  Baby,
  Globe2,
  RefreshCcw,
  Mail,
  FileText,
  Lock,
  type LucideIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const LAST_UPDATED = '12 JUL 2026';
const FILE_NO = 'PP—04';

interface Destination {
  icon: LucideIcon;
  name: string;
  purpose: string;
  tag: string;
}

const destinations: Destination[] = [
  { icon: Database, name: 'Supabase', purpose: 'stores your profile, pitches & files', tag: 'A' },
  { icon: KeyRound, name: 'Google', purpose: "verifies it's really you", tag: 'B' },
  { icon: Wallet, name: 'Razorpay', purpose: 'processes Pro subscription payments', tag: 'C' },
];

interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  ref: string;
  to?: string;
  href?: string;
}

const quickActions: QuickAction[] = [
  { icon: SlidersHorizontal, label: 'Update your info', description: 'Edit profile & account details', ref: '§5', to: '/settings' },
  { icon: Share2, label: 'Control sharing', description: 'Turn public links on or off', ref: '§5', to: '/settings' },
  { icon: Bell, label: 'Manage notifications', description: 'Choose what we email you', ref: '§5', to: '/settings' },
  { icon: Trash2, label: 'Delete your data', description: 'Request full account deletion', ref: '§5', href: 'mailto:hello@pitchin.app' },
];

interface Section {
  id: string;
  no: string;
  icon: LucideIcon;
  title: string;
  body: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'what-we-collect',
    no: '01',
    icon: Database,
    title: 'What information we collect',
    body: (
      <>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-2">Provided by you</p>
        <ul>
          <li><strong>Account &amp; profile data:</strong> name, email, profile photo/avatar, banner image, role (Startup, Investor, Innovator, Ecosystem Partner/Consultant), bio, and other onboarding fields.</li>
          <li><strong>Pitch &amp; content data:</strong> pitch decks, descriptions, media, and anything else you create or upload.</li>
          <li><strong>Messages:</strong> content you send other members through the Platform's messaging feature.</li>
          <li><strong>Contact form submissions:</strong> name, email, and message content when you reach out to us.</li>
          <li><strong>Payment information:</strong> Razorpay handles your subscription payment; we receive confirmation of payment and subscription status, never your full card, UPI, or bank details.</li>
        </ul>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 mb-2 mt-5">Collected automatically</p>
        <ul>
          <li><strong>Authentication data:</strong> basic profile info (name, email, photo) from Google, if you sign in that way.</li>
          <li><strong>Usage data:</strong> pages visited, features used, and view counts on shared profiles/pitches.</li>
          <li><strong>Device &amp; log data:</strong> IP address and browser type, kept for security and troubleshooting.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    no: '02',
    icon: Fingerprint,
    title: 'How we use it',
    body: (
      <ul>
        <li>To create and operate your account and profile;</li>
        <li>To connect you with relevant startups, investors, and service providers;</li>
        <li>To enable messaging and notifications between members;</li>
        <li>To process payments and manage subscriptions;</li>
        <li>To generate and serve the shareable links you choose to create;</li>
        <li>To keep the Platform secure and running well;</li>
        <li>To respond when you contact us; and</li>
        <li>To meet our legal obligations.</li>
      </ul>
    ),
  },
  {
    id: 'storage',
    no: '03',
    icon: Server,
    title: 'How we store your data',
    body: (
      <p>
        Your data lives in Supabase (PostgreSQL and file storage) and is processed by our backend
        infrastructure. We apply reasonable technical and organizational safeguards to protect it,
        though no system can be guaranteed 100% secure.
      </p>
    ),
  },
  {
    id: 'sharing',
    no: '04',
    icon: Share2,
    title: 'When we share your information',
    body: (
      <>
        <p>We don't sell your personal data. We share it only in these cases:</p>
        <ul>
          <li><strong>With other members, by design:</strong> your profile and pitch content are visible to other members — and, for anything shared via a public link, to anyone with that link.</li>
          <li><strong>Service providers:</strong> Supabase (hosting/database), Google (authentication), and Razorpay (payments) — each under its own privacy terms.</li>
          <li><strong>Legal reasons:</strong> if required by law, regulation, or valid legal process, or to protect Pitchin, our users, or the public.</li>
          <li><strong>Business transfers:</strong> if Pitchin is acquired or merges, your data may transfer as part of that deal, subject to this Policy.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    no: '05',
    icon: SlidersHorizontal,
    title: 'Your choices & rights',
    body: (
      <ul>
        <li><strong>Access &amp; update:</strong> edit most of your info directly from Dashboard and Settings.</li>
        <li><strong>Sharing controls:</strong> turn a public share link on or off whenever you like.</li>
        <li><strong>Deletion:</strong> email <a href="mailto:hello@pitchin.app" className="text-primary underline underline-offset-2 hover:text-primary/80">hello@pitchin.app</a> to have your account and data deleted or anonymized, except where we're legally required to keep it.</li>
        <li><strong>Communications:</strong> manage notification preferences in Settings.</li>
      </ul>
    ),
  },
  {
    id: 'retention',
    no: '06',
    icon: Clock,
    title: 'How long we keep it',
    body: (
      <p>
        We retain your information while your account is active or as needed to provide the
        Platform. After deletion, we remove or anonymize your data within a reasonable period,
        except where retention is required for legal, security, or fraud-prevention purposes.
      </p>
    ),
  },
  {
    id: 'children',
    no: '07',
    icon: Baby,
    title: "Children's privacy",
    body: (
      <p>
        Pitchin isn't directed at, or intended for, anyone under 18. We don't knowingly collect
        personal information from children.
      </p>
    ),
  },
  {
    id: 'international',
    no: '08',
    icon: Globe2,
    title: 'International users',
    body: (
      <p>
        Pitchin is operated from India, and your information may be processed and stored there or
        by service providers located elsewhere. Using the Platform means you consent to this.
      </p>
    ),
  },
  {
    id: 'changes',
    no: '09',
    icon: RefreshCcw,
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. Material changes come with an
        updated "Last updated" date above and, where appropriate, an in-app notice.
      </p>
    ),
  },
  {
    id: 'contact',
    no: '10',
    icon: Mail,
    title: 'Contact us',
    body: (
      <p>
        Questions about this Policy or your data? Reach us at{' '}
        <a href="mailto:hello@pitchin.app" className="text-primary underline underline-offset-2 hover:text-primary/80">hello@pitchin.app</a>{' '}
        or through our <Link to="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">Contact page</Link>.
      </p>
    ),
  },
];

function DashRule({ className = '' }: { className?: string }) {
  return <div className={`border-t border-dashed border-border ${className}`} />;
}

export default function Privacy() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | undefined>(sections[0].id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-8 touch-manipulation hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Cover block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 mb-4">
            Data handling record — File {FILE_NO}
          </p>

          <div className="flex items-start justify-between gap-6 mb-5">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Privacy Policy
            </h1>

            {/* Signature element: rotated seal */}
            <div className="relative shrink-0 h-16 w-16 -rotate-6 select-none">
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 flex items-center justify-center">
                <div className="absolute inset-1.5 rounded-full border border-dashed border-primary/40" />
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <p className="text-muted-foreground text-sm max-w-md mb-5">
            What we collect, why we collect it, and where it goes.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> Status: Active</span>
            <span className="text-border">·</span>
            <span>Revised {LAST_UPDATED}</span>
            <span className="text-border">·</span>
            <span>Jurisdiction: IN</span>
          </div>
        </motion.div>

        <DashRule className="mt-6 mb-8" />


        {/* Quick actions — requisition tickets */}
        {/* <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 mb-4">
            Requests you can file yourself
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((a) => {
              const Icon = a.icon;
              const content = (
                <>
                  <div className="flex items-start justify-between mb-2.5">
                    <Icon className="h-4 w-4 text-foreground/70" />
                    <span className="font-mono text-[9px] text-muted-foreground/60">{a.ref}</span>
                  </div>
                  <p className="text-xs font-medium text-foreground leading-tight">{a.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{a.description}</p>
                </>
              );
              const className =
                'border border-dashed border-border px-3.5 py-3.5 hover:border-primary/50 hover:bg-secondary/30 transition-colors text-left';
              return a.to ? (
                <Link key={a.label} to={a.to} className={className}>
                  {content}
                </Link>
              ) : (
                <a key={a.label} href={a.href} className={className}>
                  {content}
                </a>
              );
            })}
          </div>
        </motion.div> */}

        {/* Section index */}
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 mb-1 flex items-center gap-1.5">
            <FileText className="h-3 w-3" /> Full record — 10 clauses
          </p>
          <Accordion
            type="single"
            collapsible
            value={openId}
            onValueChange={setOpenId}
            className="border-t border-border"
          >
            {sections.map((s) => {
              const Icon = s.icon;
              const isOpen = openId === s.id;
              return (
                <AccordionItem
                  key={s.id}
                  value={s.id}
                  className={`border-b border-border transition-colors ${isOpen ? 'border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
                >
                  <AccordionTrigger className="hover:no-underline py-4 pl-4 sm:pl-5 pr-2">
                    <span className="flex items-center gap-3 sm:gap-4 text-left">
                      <span className="font-mono text-xs text-muted-foreground/50 w-6 shrink-0">{s.no}</span>
                      <Icon className="h-4 w-4 text-foreground/60 shrink-0" />
                      <span className="font-display font-semibold text-sm sm:text-base text-foreground">
                        {s.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none pl-[3.75rem] pr-4 sm:pl-[4.25rem] prose-p:text-muted-foreground prose-li:text-muted-foreground prose-p:leading-relaxed prose-li:leading-relaxed">
                      {s.body}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}