// import { useEffect, useMemo, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   ArrowLeft,
//   ScrollText,
//   UserCheck,
//   LayoutGrid,
//   PenSquare,
//   Handshake,
//   CreditCard,
//   Building2,
//   ShieldAlert,
//   LogOut,
//   AlertTriangle,
//   Scale3D,
//   RefreshCcw,
//   Gavel,
//   Mail,
//   type LucideIcon,
// } from 'lucide-react';

// const LAST_UPDATED = 'July 12, 2026';

// interface Section {
//   id: string;
//   icon: LucideIcon;
//   title: string;
//   body: React.ReactNode;
// }

// const sections: Section[] = [
//   {
//     id: 'who-can-use',
//     icon: UserCheck,
//     title: 'Who can use Pichin',
//     body: (
//       <p>
//         You must be at least 18 years old, or the age of legal majority in your jurisdiction, to
//         create an account. By registering, you confirm that the information you provide is
//         accurate and that you have the authority to represent any startup, organization, or
//         entity you list on your profile.
//       </p>
//     ),
//   },
//   {
//     id: 'your-account',
//     icon: ScrollText,
//     title: 'Your account',
//     body: (
//       <ul>
//         <li>You may sign up using Google Sign-In or another supported method. You're responsible for maintaining the confidentiality of your account and for all activity that occurs under it.</li>
//         <li>During onboarding you'll select a role — Startup, Investor, Innovator, or Ecosystem Partner/Consultant. Some features, profile fields, and visibility settings are role-specific.</li>
//         <li>You agree to notify us promptly of any unauthorized use of your account.</li>
//       </ul>
//     ),
//   },
//   {
//     id: 'using-Pichin',
//     icon: LayoutGrid,
//     title: 'What you can do on Pichin',
//     body: (
//       <p>
//         Pichin lets you build a profile, publish pitches, discover startups, investors, and
//         service providers, message other members, and share parts of your profile or pitch
//         publicly via a shareable link. Some of these features — including generating a public
//         shareable dashboard — are part of a paid Pro tier.
//       </p>
//     ),
//   },
//   {
//     id: 'your-content',
//     icon: PenSquare,
//     title: 'Content you submit',
//     body: (
//       <>
//         <p>
//           You retain ownership of the content you post — profile details, pitch decks, pitch
//           descriptions, media, and messages ("Your Content"). By posting Your Content, you grant
//           Pichin a worldwide, non-exclusive, royalty-free license to host, store, reproduce, and
//           display it solely to operate and improve the Platform, and, where you choose to make it
//           public (for example via a shared profile or pitch link), to make it viewable by anyone
//           with that link.
//         </p>
//         <p>You agree not to post content that:</p>
//         <ul>
//           <li>Is false, misleading, or misrepresents your identity, affiliation, or credentials;</li>
//           <li>Infringes someone else's intellectual property, privacy, or other rights;</li>
//           <li>Is unlawful, harassing, defamatory, or discriminatory; or</li>
//           <li>Contains malware or attempts to compromise the Platform's security.</li>
//         </ul>
//         <p>
//           We may remove content or suspend accounts that violate these Terms, though we're not
//           obligated to monitor all content on the Platform.
//         </p>
//       </>
//     ),
//   },
//   {
//     id: 'deals-introductions',
//     icon: Handshake,
//     title: 'Pitches, deals, and introductions',
//     body: (
//       <p>
//         Pichin is a discovery and networking tool that helps startups, investors, and service
//         providers find and message one another. We do not broker, underwrite, or guarantee any
//         investment, deal, partnership, or transaction between users, and we're not a party to any
//         agreement you reach with another member. Any due diligence, negotiation, or investment
//         decision is solely between the parties involved, at their own risk. Nothing on the
//         Platform constitutes financial, legal, or investment advice.
//       </p>
//     ),
//   },
//   {
//     id: 'paid-subscriptions',
//     icon: CreditCard,
//     title: 'Paid subscriptions',
//     body: (
//       <p>
//         Certain features (such as extended dashboard sharing) require a paid Pro subscription.
//         Payments are processed by our third-party payment processor, Razorpay; we do not store
//         your full payment card details. Subscription fees, billing cycles, and cancellation terms
//         are shown to you at the time of purchase. Fees are generally non-refundable except where
//         required by law.
//       </p>
//     ),
//   },
//   {
//     id: 'service-providers',
//     icon: Building2,
//     title: 'Service providers and directory listings',
//     body: (
//       <p>
//         Service providers listed in the Network directory are independent third parties. We don't
//         employ or supervise them, and we don't guarantee the quality, safety, or outcome of any
//         service you obtain through the Platform. Any engagement you enter into with a listed
//         provider is solely between you and that provider.
//       </p>
//     ),
//   },
//   {
//     id: 'acceptable-use',
//     icon: ShieldAlert,
//     title: 'Acceptable use',
//     body: (
//       <ul>
//         <li>Don't scrape, crawl, or use automated means to extract data from the Platform without our written permission.</li>
//         <li>Don't attempt to gain unauthorized access to other accounts, systems, or networks connected to the Platform.</li>
//         <li>Don't use the Platform to send spam or unsolicited commercial messages.</li>
//         <li>Don't reverse-engineer or interfere with the Platform's normal operation.</li>
//       </ul>
//     ),
//   },
//   {
//     id: 'suspension',
//     icon: LogOut,
//     title: 'Suspension and termination',
//     body: (
//       <p>
//         You may stop using Pichin and delete your account at any time from Settings. We may
//         suspend or terminate your access if you violate these Terms, misuse the Platform, or if
//         required by law, with notice where reasonably practicable.
//       </p>
//     ),
//   },
//   {
//     id: 'disclaimers',
//     icon: AlertTriangle,
//     title: 'Disclaimers',
//     body: (
//       <p>
//         The Platform is provided "as is" and "as available," without warranties of any kind,
//         express or implied. We don't warrant that the Platform will be uninterrupted, secure, or
//         error-free, or that any startup, investor, or provider information on it is accurate or
//         complete.
//       </p>
//     ),
//   },
//   {
//     id: 'liability',
//     icon: Scale3D,
//     title: 'Limitation of liability',
//     body: (
//       <p>
//         To the maximum extent permitted by law, Pichin and its team will not be liable for any
//         indirect, incidental, or consequential damages, or for any loss of profits, data, or
//         business opportunities, arising from your use of the Platform or any interaction with
//         another user.
//       </p>
//     ),
//   },
//   {
//     id: 'changes',
//     icon: RefreshCcw,
//     title: 'Changes to these Terms',
//     body: (
//       <p>
//         We may update these Terms from time to time. If we make material changes, we'll update
//         the "Last updated" date above and, where appropriate, notify you in-app. Continued use of
//         the Platform after changes take effect means you accept the updated Terms.
//       </p>
//     ),
//   },
//   {
//     id: 'governing-law',
//     icon: Gavel,
//     title: 'Governing law',
//     body: (
//       <p>
//         These Terms are governed by the laws of India, without regard to conflict-of-law
//         principles, and any disputes will be subject to the exclusive jurisdiction of the courts
//         of India.
//       </p>
//     ),
//   },
//   {
//     id: 'contact',
//     icon: Mail,
//     title: 'Contact us',
//     body: (
//       <p>
//         Questions about these Terms? Reach us at{' '}
//         <a href="mailto:pitche.saas@gmail.com" className="text-primary underline underline-offset-2 hover:text-primary/80">pitche.saas@gmail.com</a>{' '}
//         or through our <Link to="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">Contact page</Link>.
//       </p>
//     ),
//   },
// ];

// const highlights = [
//   "You keep ownership of everything you post — pitches, media, and profile content.",
//   "Pichin only helps you connect; we're never a party to a deal you make with another member.",
//   "Pro features are billed through Razorpay and are generally non-refundable.",
//   'You can delete your account and data from Settings whenever you like.',
// ];

// export default function Terms() {
//   const navigate = useNavigate();
//   const [activeId, setActiveId] = useState<string>(sections[0].id);
//   const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
//         if (visible[0]?.target.id) setActiveId(visible[0].target.id);
//       },
//       { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
//     );

//     Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));

//     // Safety net: force the last section active once the user hits the bottom
//     // of the page, in case its top never enters the IntersectionObserver band.
//     const onScroll = () => {
//       const atBottom =
//         window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
//       if (atBottom) setActiveId(sections[sections.length - 1].id);
//     };
//     window.addEventListener('scroll', onScroll, { passive: true });

//     return () => {
//       observer.disconnect();
//       window.removeEventListener('scroll', onScroll);
//     };
//   }, []);

//   const jumpTo = (id: string) => {
//     sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const activeIndex = useMemo(() => sections.findIndex((s) => s.id === activeId), [activeId]);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero */}
//       <div className="relative overflow-hidden border-b border-border">
//         <div
//           className="absolute inset-0 -z-10 opacity-[0.35]"
//           style={{
//             backgroundImage:
//               'radial-gradient(circle at 15% 20%, hsl(var(--primary) / 0.18), transparent 45%), radial-gradient(circle at 85% 0%, hsl(var(--primary) / 0.12), transparent 40%)',
//           }}
//         />
//         <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pt-8 sm:pb-14">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-1 text-sm text-muted-foreground mb-8 touch-manipulation hover:text-foreground transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back
//           </button>

//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 mb-5">
//               <ScrollText className="h-3.5 w-3.5" />
//               Legal · Terms of Service
//             </span>
//             <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
//               The agreement between<br className="hidden sm:block" /> you and Pichin
//             </h1>
//             <p className="text-muted-foreground text-sm sm:text-base max-w-xl mb-1">
//               Plain-language terms for using our startup–investor matchmaking platform.
//             </p>
//             <p className="text-xs text-muted-foreground/70">Last updated {LAST_UPDATED}</p>
//           </motion.div>

//           {/* Quick summary */}
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: 0.1 }}
//             className="mt-8 grid sm:grid-cols-2 gap-2.5"
//           >
//             {highlights.map((h, i) => (
//               <div
//                 key={i}
//                 className="flex items-center gap-2.5 rounded-xl bg-card border border-border px-3.5 py-3 shadow-card"
//               >
//                 <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
//                 <span className="text-xs sm:text-[13px] text-foreground/80 leading-relaxed">{h}</span>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr] gap-6 md:gap-8 lg:gap-10">
//         {/* Sticky nav — tablet & desktop */}
//         <nav className="hidden md:block">
//           <div className="sticky top-8">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-3 px-1">
//               On this page
//             </p>
//             <ol className="space-y-0.5 border-l border-border">
//               {sections.map((s, i) => {
//                 const active = s.id === activeId;
//                 return (
//                   <li key={s.id}>
//                     <button
//                       onClick={() => jumpTo(s.id)}
//                       className={`w-full text-left text-[13px] leading-snug py-1.5 pl-4 -ml-px border-l transition-colors ${
//                         active
//                           ? 'border-primary text-primary font-medium'
//                           : 'border-transparent text-muted-foreground hover:text-foreground'
//                       }`}
//                     >
//                       <span className="tabular-nums text-[11px] mr-1.5 opacity-60">
//                         {String(i + 1).padStart(2, '0')}
//                       </span>
//                       {s.title}
//                     </button>
//                   </li>
//                 );
//               })}
//             </ol>
//             <div className="mt-6 pl-4">
//               <div className="h-1 rounded-full bg-muted overflow-hidden w-32">
//                 <div
//                   className="h-full bg-primary rounded-full transition-all duration-300"
//                   style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
//                 />
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Mobile jump menu */}
//         <div className="md:hidden -mt-2 mb-2">
//           <div className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none]">
//             {sections.map((s) => (
//               <button
//                 key={s.id}
//                 onClick={() => jumpTo(s.id)}
//                 className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
//                   s.id === activeId
//                     ? 'bg-primary text-primary-foreground border-primary'
//                     : 'bg-card text-muted-foreground border-border'
//                 }`}
//               >
//                 {s.title}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Sections */}
//         <div className="space-y-3">
//           <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
//             Welcome to Pichin. These Terms of Service ("Terms") govern your access to and use of
//             the Pichin website, mobile experience, and related services (together, the
//             "Platform"), operated by the Pichin team ("Pichin", "we", "us", or "our"). By
//             creating an account or otherwise using the Platform, you agree to these Terms. If you
//             don't agree, please don't use the Platform.
//           </p>

//           {sections.map((s, i) => {
//             const Icon = s.icon;
//             return (
//               <motion.section
//                 key={s.id}
//                 id={s.id}
//                 ref={(el) => (sectionRefs.current[s.id] = el)}
//                 initial={{ opacity: 0, y: 16 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: '-80px' }}
//                 transition={{ duration: 0.35 }}
//                 className="scroll-mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card"
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//                     <Icon className="h-[18px] w-[18px] text-primary" />
//                   </div>
//                   <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
//                     <span className="text-muted-foreground/50 font-sans font-medium text-sm mr-2 tabular-nums">
//                       {String(i + 1).padStart(2, '0')}
//                     </span>
//                     {s.title}
//                   </h2>
//                 </div>
//                 <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-p:leading-relaxed prose-li:leading-relaxed">
//                   {s.body}
//                 </div>
//               </motion.section>
//             );
//           })}
//           {/* Trailing space so the last sections can pass through the scroll-spy band */}
//           <div aria-hidden className="h-[25vh] sm:h-[35vh] md:h-[45vh]" />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ScrollText,
  UserCheck,
  LayoutGrid,
  PenSquare,
  Handshake,
  CreditCard,
  Building2,
  ShieldAlert,
  LogOut,
  AlertTriangle,
  Scale3D,
  RefreshCcw,
  Gavel,
  Mail,
  type LucideIcon,
} from 'lucide-react';

const LAST_UPDATED = 'July 12, 2026';

interface Section {
  id: string;
  icon: LucideIcon;
  title: string;
  body: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'who-can-use',
    icon: UserCheck,
    title: 'Who can use Pitchin',
    body: (
      <p>
        You must be at least 18 years old, or the age of legal majority in your jurisdiction, to
        create an account. By registering, you confirm that the information you provide is
        accurate and that you have the authority to represent any startup, organization, or
        entity you list on your profile.
      </p>
    ),
  },
  {
    id: 'your-account',
    icon: ScrollText,
    title: 'Your account',
    body: (
      <ul>
        <li>You may sign up using Google Sign-In or another supported method. You're responsible for maintaining the confidentiality of your account and for all activity that occurs under it.</li>
        <li>During onboarding you'll select a role — Startup, Investor, Innovator, or Ecosystem Partner/Consultant. Some features, profile fields, and visibility settings are role-specific.</li>
        <li>You agree to notify us promptly of any unauthorized use of your account.</li>
      </ul>
    ),
  },
  {
    id: 'using-pitchin',
    icon: LayoutGrid,
    title: 'What you can do on Pitchin',
    body: (
      <p>
        Pitchin lets you build a profile, publish pitches, discover startups, investors, and
        service providers, message other members, and share parts of your profile or pitch
        publicly via a shareable link. Some of these features — including generating a public
        shareable dashboard — are part of a paid Pro tier.
      </p>
    ),
  },
  {
    id: 'your-content',
    icon: PenSquare,
    title: 'Content you submit',
    body: (
      <>
        <p>
          You retain ownership of the content you post — profile details, pitch decks, pitch
          descriptions, media, and messages ("Your Content"). By posting Your Content, you grant
          Pitchin a worldwide, non-exclusive, royalty-free license to host, store, reproduce, and
          display it solely to operate and improve the Platform, and, where you choose to make it
          public (for example via a shared profile or pitch link), to make it viewable by anyone
          with that link.
        </p>
        <p>You agree not to post content that:</p>
        <ul>
          <li>Is false, misleading, or misrepresents your identity, affiliation, or credentials;</li>
          <li>Infringes someone else's intellectual property, privacy, or other rights;</li>
          <li>Is unlawful, harassing, defamatory, or discriminatory; or</li>
          <li>Contains malware or attempts to compromise the Platform's security.</li>
        </ul>
        <p>
          We may remove content or suspend accounts that violate these Terms, though we're not
          obligated to monitor all content on the Platform.
        </p>
      </>
    ),
  },
  {
    id: 'deals-introductions',
    icon: Handshake,
    title: 'Pitches, deals, and introductions',
    body: (
      <p>
        Pitchin is a discovery and networking tool that helps startups, investors, and service
        providers find and message one another. We do not broker, underwrite, or guarantee any
        investment, deal, partnership, or transaction between users, and we're not a party to any
        agreement you reach with another member. Any due diligence, negotiation, or investment
        decision is solely between the parties involved, at their own risk. Nothing on the
        Platform constitutes financial, legal, or investment advice.
      </p>
    ),
  },
  {
    id: 'paid-subscriptions',
    icon: CreditCard,
    title: 'Paid subscriptions',
    body: (
      <p>
        Certain features (such as extended dashboard sharing) require a paid Pro subscription.
        Payments are processed by our third-party payment processor, Razorpay; we do not store
        your full payment card details. Subscription fees, billing cycles, and cancellation terms
        are shown to you at the time of purchase. Fees are generally non-refundable except where
        required by law.
      </p>
    ),
  },
  {
    id: 'service-providers',
    icon: Building2,
    title: 'Service providers and directory listings',
    body: (
      <p>
        Service providers listed in the Network directory are independent third parties. We don't
        employ or supervise them, and we don't guarantee the quality, safety, or outcome of any
        service you obtain through the Platform. Any engagement you enter into with a listed
        provider is solely between you and that provider.
      </p>
    ),
  },
  {
    id: 'acceptable-use',
    icon: ShieldAlert,
    title: 'Acceptable use',
    body: (
      <ul>
        <li>Don't scrape, crawl, or use automated means to extract data from the Platform without our written permission.</li>
        <li>Don't attempt to gain unauthorized access to other accounts, systems, or networks connected to the Platform.</li>
        <li>Don't use the Platform to send spam or unsolicited commercial messages.</li>
        <li>Don't reverse-engineer or interfere with the Platform's normal operation.</li>
      </ul>
    ),
  },
  {
    id: 'suspension',
    icon: LogOut,
    title: 'Suspension and termination',
    body: (
      <p>
        You may stop using Pitchin and delete your account at any time from Settings. We may
        suspend or terminate your access if you violate these Terms, misuse the Platform, or if
        required by law, with notice where reasonably practicable.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    icon: AlertTriangle,
    title: 'Disclaimers',
    body: (
      <p>
        The Platform is provided "as is" and "as available," without warranties of any kind,
        express or implied. We don't warrant that the Platform will be uninterrupted, secure, or
        error-free, or that any startup, investor, or provider information on it is accurate or
        complete.
      </p>
    ),
  },
  {
    id: 'liability',
    icon: Scale3D,
    title: 'Limitation of liability',
    body: (
      <p>
        To the maximum extent permitted by law, Pitchin and its team will not be liable for any
        indirect, incidental, or consequential damages, or for any loss of profits, data, or
        business opportunities, arising from your use of the Platform or any interaction with
        another user.
      </p>
    ),
  },
  {
    id: 'changes',
    icon: RefreshCcw,
    title: 'Changes to these Terms',
    body: (
      <p>
        We may update these Terms from time to time. If we make material changes, we'll update
        the "Last updated" date above and, where appropriate, notify you in-app. Continued use of
        the Platform after changes take effect means you accept the updated Terms.
      </p>
    ),
  },
  {
    id: 'governing-law',
    icon: Gavel,
    title: 'Governing law',
    body: (
      <p>
        These Terms are governed by the laws of India, without regard to conflict-of-law
        principles, and any disputes will be subject to the exclusive jurisdiction of the courts
        of India.
      </p>
    ),
  },
  {
    id: 'contact',
    icon: Mail,
    title: 'Contact us',
    body: (
      <p>
        Questions about these Terms? Reach us at{' '}
        <a
          href="mailto:pitche.saas@gmail.com"
          className="text-primary underline underline-offset-2 hover:text-primary/80 break-all sm:break-normal"
        >
          pitche.saas@gmail.com
        </a>{' '}
        or through our <Link to="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">Contact page</Link>.
      </p>
    ),
  },
];

const highlights = [
  "You keep ownership of everything you post — pitches, media, and profile content.",
  "Pitchin only helps you connect; we're never a party to a deal you make with another member.",
  "Pro features are billed through Razorpay and are generally non-refundable.",
  'You can delete your account and data from Settings whenever you like.',
];

export default function Terms() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));

    // Safety net: force the last section active once the user hits the bottom
    // of the page, in case its top never enters the IntersectionObserver band.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActiveId(sections[sections.length - 1].id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Keep the active chip in the mobile jump menu scrolled into view as the
  // user scrolls the page, so the horizontally-scrolling strip tracks progress.
  // IMPORTANT: this must only adjust the strip's own horizontal scroll — never
  // scrollIntoView() on the button, since the strip scrolls away with the page
  // (it isn't sticky) and scrollIntoView would drag the whole window back up
  // to make it visible again, fighting the user's scroll.
  useEffect(() => {
    const container = mobileNavRef.current;
    if (!container) return;
    const activeButton = container.querySelector<HTMLButtonElement>(
      `[data-section-id="${activeId}"]`
    );
    if (!activeButton) return;
    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    const delta =
      buttonRect.left - containerRect.left - (containerRect.width - buttonRect.width) / 2;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  }, [activeId]);

  const jumpTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeIndex = useMemo(() => sections.findIndex((s) => s.id === activeId), [activeId]);

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, hsl(var(--primary) / 0.18), transparent 45%), radial-gradient(circle at 85% 0%, hsl(var(--primary) / 0.12), transparent 40%)',
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-8 sm:pt-8 sm:pb-14">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground mb-6 sm:mb-8 touch-manipulation hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1 mb-4 sm:mb-5">
              <ScrollText className="h-3.5 w-3.5 shrink-0" />
              Legal · Terms of Service
            </span>
            <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              The agreement between<br className="hidden sm:block" /> you and Pitchin
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mb-1">
              Plain-language terms for using our startup–investor matchmaking platform.
            </p>
            <p className="text-xs text-muted-foreground/70">Last updated {LAST_UPDATED}</p>
          </motion.div>

          {/* Quick summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-7 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
          >
            {highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl bg-card border border-border px-3.5 py-3 shadow-card"
              >
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-xs sm:text-[13px] text-foreground/80 leading-relaxed">{h}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr] gap-6 md:gap-8 lg:gap-10">
        {/* Sticky nav — tablet & desktop */}
        <nav className="hidden md:block">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 mb-3 px-1">
              On this page
            </p>
            <ol className="space-y-0.5 border-l border-border">
              {sections.map((s, i) => {
                const active = s.id === activeId;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => jumpTo(s.id)}
                      className={`w-full text-left text-[13px] leading-snug py-1.5 pl-4 -ml-px border-l transition-colors ${
                        active
                          ? 'border-primary text-primary font-medium'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="tabular-nums text-[11px] mr-1.5 opacity-60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.title}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 pl-4">
              <div className="h-1 rounded-full bg-muted overflow-hidden w-full max-w-32">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile jump menu */}
        <div className="md:hidden -mt-2 mb-2 relative">
          <div
            ref={mobileNavRef}
            className="flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                data-section-id={s.id}
                onClick={() => jumpTo(s.id)}
                className={`shrink-0 whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors touch-manipulation ${
                  s.id === activeId
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
          {/* Edge fade to hint there's more to scroll */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Sections */}
        <div className="space-y-3 min-w-0">
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Welcome to Pitchin. These Terms of Service ("Terms") govern your access to and use of
            the Pitchin website, mobile experience, and related services (together, the
            "Platform"), operated by the Pitchin team ("Pitchin", "we", "us", or "our"). By
            creating an account or otherwise using the Platform, you agree to these Terms. If you
            don't agree, please don't use the Platform.
          </p>

          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.section
                key={s.id}
                id={s.id}
                ref={(el) => (sectionRefs.current[s.id] = el)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35 }}
                className="scroll-mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5 lg:p-6 shadow-card"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-[18px] w-[18px] text-primary" />
                  </div>
                  <h2 className="font-display text-base sm:text-lg lg:text-xl font-bold text-foreground">
                    <span className="text-muted-foreground/50 font-sans font-medium text-sm mr-2 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.title}
                  </h2>
                </div>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-p:leading-relaxed prose-li:leading-relaxed break-words">
                  {s.body}
                </div>
              </motion.section>
            );
          })}
          {/* Trailing space so the last sections can pass through the scroll-spy band */}
          <div aria-hidden className="h-[25vh] sm:h-[35vh] md:h-[45vh]" />
        </div>
      </div>
    </div>
  );
}