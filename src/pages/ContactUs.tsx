import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/api/client';

export default function ContactUs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast({
        title: 'Missing info',
        description: 'Please fill in your email and a message.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/auth/contact/', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message }),
      });
      setSent(true);
    } catch (error: any) {
      toast({
        title: 'Something went wrong',
        description: error?.message || 'Could not send your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-sm"
        >
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            Message sent
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Thanks for reaching out — our team will get back to you at {email} soon.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="rounded-full px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 md:flex md:items-center md:justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-6 touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-2">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <h1 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
          Contact Us
        </h1>
        <p className="text-muted-foreground text-sm mb-6 text-center">
          Have a question, feedback, or ran into an issue? Send us a message and we'll reply directly to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

// import { useState, useMemo } from 'react';
// import {
//   ArrowLeft,
//   Mail,
//   Phone,
//   MapPin,
//   Clock,
//   CheckCircle2,
//   Send,
//   Loader2,
//   User,
//   MessageSquare,
//   Linkedin,
//   Twitter,
//   Instagram,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { useAuth } from '@/hooks/useAuth';
// import { useToast } from '@/hooks/use-toast';
// import { apiFetch } from '@/api/client';

// // ── Editable business details ────────────────────────────────────────────
// // Swap these for the real values whenever you have them.
// const CONTACT_INFO = [
//   { icon: Mail, label: 'Email us', value: 'hello@pitchin.co', href: 'mailto:hello@pitchin.co' },
//   { icon: Phone, label: 'Call us', value: '+91 98765 43210', href: 'tel:+919876543210' },
//   { icon: MapPin, label: 'Visit us', value: 'Kochi, Kerala, India', href: undefined },
// ];

// const BUSINESS_HOURS = [
//   { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM IST' },
//   { day: 'Saturday', hours: '10:00 AM – 2:00 PM IST' },
// ];

// const SOCIAL_LINKS = [
//   { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
//   { icon: Twitter, label: 'X (Twitter)', href: 'https://twitter.com' },
//   { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
// ];
// // ──────────────────────────────────────────────────────────────────────────

// const EASE = [0.16, 1, 0.3, 1] as const;

// const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// export default function ContactUs() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const shouldReduceMotion = useReducedMotion();

//   const [name, setName] = useState(user?.full_name ?? '');
//   const [email, setEmail] = useState(user?.email ?? '');
//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [sent, setSent] = useState(false);
//   const [touched, setTouched] = useState<{ email?: boolean; message?: boolean }>({});

//   const errors = useMemo(() => {
//     const next: { email?: string; message?: string } = {};
//     if (!email.trim()) next.email = 'Enter your email address.';
//     else if (!isValidEmail(email)) next.email = 'Enter a valid email address.';
//     if (!message.trim()) next.message = 'Add a short message.';
//     return next;
//   }, [email, message]);

//   const markTouched = (field: 'email' | 'message') =>
//     setTouched((prev) => ({ ...prev, [field]: true }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setTouched({ email: true, message: true });

//     if (errors.email || errors.message) {
//       toast({
//         title: 'Missing info',
//         description: 'Please fill in your email and a message.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       await apiFetch('/auth/contact/', {
//         method: 'POST',
//         body: JSON.stringify({ name, email, subject, message }),
//       });
//       setSent(true);
//     } catch (error: any) {
//       toast({
//         title: 'Something went wrong',
//         description: error?.message || 'Could not send your message. Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Background: faint ambient gradients + a matchmaking-themed node graphic ──
//   const AmbientBackdrop = () => (
//     <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
//       <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
//       <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-400/10 blur-3xl" />
//       <svg
//         className="absolute inset-0 h-full w-full opacity-[0.07]"
//         viewBox="0 0 800 600"
//         fill="none"
//         preserveAspectRatio="xMidYMid slice"
//       >
//         <g stroke="currentColor" className="text-primary" strokeWidth="1">
//           <line x1="80" y1="90" x2="240" y2="180" />
//           <line x1="240" y1="180" x2="180" y2="340" />
//           <line x1="240" y1="180" x2="420" y2="140" />
//           <line x1="420" y1="140" x2="600" y2="220" />
//           <line x1="600" y1="220" x2="720" y2="120" />
//           <line x1="180" y1="340" x2="360" y2="420" />
//           <line x1="360" y1="420" x2="560" y2="400" />
//           <line x1="560" y1="400" x2="700" y2="480" />
//         </g>
//         <g fill="currentColor" className="text-primary">
//           {[
//             [80, 90],
//             [240, 180],
//             [420, 140],
//             [600, 220],
//             [720, 120],
//             [180, 340],
//             [360, 420],
//             [560, 400],
//             [700, 480],
//           ].map(([cx, cy], i) => (
//             <circle key={i} cx={cx} cy={cy} r={4} />
//           ))}
//         </g>
//       </svg>
//     </div>
//   );

//   if (sent) {
//     return (
//       <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-hidden">
//         <AmbientBackdrop />
//         <motion.div
//           initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, ease: EASE }}
//           className="relative text-center max-w-sm"
//         >
//           <motion.div
//             initial={shouldReduceMotion ? false : { scale: 0.6, rotate: -8 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
//             className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 shadow-lg shadow-primary/30 flex items-center justify-center mb-6"
//           >
//             <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
//           </motion.div>
//           <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
//             Message sent
//           </h1>
//           <p className="text-muted-foreground text-sm leading-relaxed mb-8">
//             Thanks for reaching out — our team will get back to you at{' '}
//             <span className="text-foreground font-medium">{email}</span> soon.
//           </p>
//           <Button
//             variant="outline"
//             onClick={() => navigate(-1)}
//             className="rounded-full px-6"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Go back
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-background overflow-hidden">
//       <AmbientBackdrop />

//       <div className="relative px-4 sm:px-6 py-6 md:py-10 max-w-5xl mx-auto">
//         <button
//           onClick={() => navigate(-1)}
//           className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 md:mb-12 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 -ml-1 px-1 py-1"
//         >
//           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
//           Back
//         </button>

//         {/* Hero */}
//         <motion.div
//           initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: EASE }}
//           className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
//         >
//           <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-primary mb-4">
//             <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
//             Get in touch
//           </span>
//           <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4 text-balance">
//             Let's build the right connection
//           </h1>
//           <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-balance">
//             Question, feedback, or something not working right? Tell us about it
//             and we'll get back to you directly — no ticket queues.
//           </p>
//         </motion.div>

//         {/* Content grid */}
//         <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
//           {/* Form */}
//           <motion.div
//             initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
//             className="lg:col-span-7"
//           >
//             <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl shadow-xl shadow-black/[0.03] p-6 sm:p-8">
//               <form onSubmit={handleSubmit} noValidate className="space-y-5">
//                 <div className="grid sm:grid-cols-2 gap-5">
//                   <div className="space-y-1.5">
//                     <Label htmlFor="name">Name</Label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         placeholder="Your name"
//                         className="pl-9 rounded-xl h-11"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-1.5">
//                     <Label htmlFor="email">
//                       Email <span className="text-primary">*</span>
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="email"
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         onBlur={() => markTouched('email')}
//                         placeholder="you@example.com"
//                         required
//                         aria-invalid={touched.email && !!errors.email}
//                         aria-describedby={errors.email ? 'email-error' : undefined}
//                         className={`pl-9 rounded-xl h-11 transition-colors ${
//                           touched.email && errors.email
//                             ? 'border-destructive focus-visible:ring-destructive/40'
//                             : ''
//                         }`}
//                       />
//                     </div>
//                     <AnimatePresence>
//                       {touched.email && errors.email && (
//                         <motion.p
//                           id="email-error"
//                           role="alert"
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: 'auto' }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.2 }}
//                           className="text-xs text-destructive"
//                         >
//                           {errors.email}
//                         </motion.p>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label htmlFor="subject">Subject</Label>
//                   <div className="relative">
//                     <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="subject"
//                       value={subject}
//                       onChange={(e) => setSubject(e.target.value)}
//                       placeholder="What's this about?"
//                       className="pl-9 rounded-xl h-11"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label htmlFor="message">
//                     Message <span className="text-primary">*</span>
//                   </Label>
//                   <Textarea
//                     id="message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onBlur={() => markTouched('message')}
//                     placeholder="Tell us more..."
//                     rows={5}
//                     required
//                     aria-invalid={touched.message && !!errors.message}
//                     aria-describedby={errors.message ? 'message-error' : undefined}
//                     className={`rounded-xl resize-none transition-colors ${
//                       touched.message && errors.message
//                         ? 'border-destructive focus-visible:ring-destructive/40'
//                         : ''
//                     }`}
//                   />
//                   <AnimatePresence>
//                     {touched.message && errors.message && (
//                       <motion.p
//                         id="message-error"
//                         role="alert"
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.2 }}
//                         className="text-xs text-destructive"
//                       >
//                         {errors.message}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full rounded-full h-12 text-sm font-semibold bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       Send message
//                       <Send className="h-4 w-4 ml-2" />
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </div>
//           </motion.div>

//           {/* Contact info */}
//           <motion.div
//             initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
//             className="lg:col-span-5 flex flex-col gap-4"
//           >
//             {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => {
//               const content = (
//                 <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/[0.04] hover:border-primary/30">
//                   <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
//                     <Icon className="h-5 w-5 text-primary" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-xs text-muted-foreground">{label}</p>
//                     <p className="text-sm font-medium text-foreground truncate">{value}</p>
//                   </div>
//                 </div>
//               );
//               return href ? (
//                 <a
//                   key={label}
//                   href={href}
//                   className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
//                 >
//                   {content}
//                 </a>
//               ) : (
//                 <div key={label}>{content}</div>
//               );
//             })}

//             {/* Business hours */}
//             <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-4">
//               <div className="flex items-center gap-4 mb-3">
//                 <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-400/5 flex items-center justify-center">
//                   <Clock className="h-5 w-5 text-amber-500" />
//                 </div>
//                 <p className="text-sm font-medium text-foreground">Business hours</p>
//               </div>
//               <dl className="space-y-1.5 pl-[3.75rem]">
//                 {BUSINESS_HOURS.map(({ day, hours }) => (
//                   <div key={day} className="flex items-baseline justify-between gap-3 text-xs">
//                     <dt className="text-muted-foreground">{day}</dt>
//                     <dd className="text-foreground font-medium text-right">{hours}</dd>
//                   </div>
//                 ))}
//               </dl>
//             </div>

//             {/* Social links */}
//             <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-4">
//               <p className="text-xs text-muted-foreground mb-3">Follow along</p>
//               <div className="flex items-center gap-3">
//                 {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
//                   <a
//                     key={label}
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={label}
//                     className="group w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-primary hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
//                   >
//                     <Icon className="h-4 w-4" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }