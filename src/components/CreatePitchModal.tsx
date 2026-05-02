// import { useState, useRef } from 'react';
// import { ImagePlus, X, Tag, Check, Link2, MousePointerClick, ChevronDown, ExternalLink } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
// } from '@/components/ui/dialog';
// import {
//   Drawer,
//   DrawerContent,
// } from '@/components/ui/drawer';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { useCreatePitch } from '@/hooks/usePitches';
// import { useAuth } from '@/hooks/useAuth';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useQuery } from '@tanstack/react-query';
// import { cn } from '@/lib/utils';
// import { sanitizeUrl } from '@/lib/validation';
// import type { Database } from "@/integrations/supabase/types";
// import { supabase } from '@/integrations/supabase/client'; 

// type PitchCategory = Database['public']['Enums']['pitch_category'];

// interface CreatePitchModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const CATEGORIES: { value: PitchCategory; label: string; emoji: string }[] = [
//   { value: 'tech', label: 'Tech', emoji: '💻' },
//   { value: 'consumer', label: 'Consumer', emoji: '🛍️' },
//   { value: 'b2b', label: 'B2B', emoji: '🏢' },
//   { value: 'creative', label: 'Creative', emoji: '🎨' },
//   { value: 'social_impact', label: 'Social Impact', emoji: '🌍' },
//   { value: 'other', label: 'Other', emoji: '📦' },
// ];

// const CTA_PRESETS = ['Apply Now', 'Learn More', 'Register', 'Explore', 'Join Now', 'View Details'];

// function SectionToggle({
//   label,
//   icon,
//   enabled,
//   onToggle,
//   children,
// }: {
//   label: string;
//   icon: React.ReactNode;
//   enabled: boolean;
//   onToggle: (val: boolean) => void;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-xl border border-border bg-card overflow-hidden">
//       <div className="flex items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-2">
//           <span className="text-primary">{icon}</span>
//           <span className="text-sm font-medium text-foreground">{label}</span>
//           <span className="text-xs text-muted-foreground">(optional)</span>
//         </div>
//         <Switch checked={enabled} onCheckedChange={onToggle} />
//       </div>
//       {enabled && (
//         <>
//           <Separator />
//           <div className="px-4 py-4 space-y-3">{children}</div>
//         </>
//       )}
//     </div>
//   );
// }

// function PitchComposer({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
//   const { user } = useAuth();
//   const createPitch = useCreatePitch();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const isMobile = useIsMobile();

//   // Core fields
//   const [postTitle, setPostTitle] = useState('');
//   const [pitchStatement, setPitchStatement] = useState('');
//   const [category, setCategory] = useState<PitchCategory>('other');
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [showCategoryPicker, setShowCategoryPicker] = useState(false);

//   // External link section
//   const [linkEnabled, setLinkEnabled] = useState(false);
//   const [linkUrl, setLinkUrl] = useState('');
//   const [linkTitle, setLinkTitle] = useState('');
//   const [linkDescription, setLinkDescription] = useState('');
//   const [linkUrlError, setLinkUrlError] = useState('');

//   // CTA section
//   const [ctaEnabled, setCtaEnabled] = useState(false);
//   const [ctaLabel, setCtaLabel] = useState('');
//   const [ctaUrl, setCtaUrl] = useState('');
//   const [ctaOpenNewTab, setCtaOpenNewTab] = useState(true);
//   const [ctaUrlError, setCtaUrlError] = useState('');
//   const [showCtaPresets, setShowCtaPresets] = useState(false);

//   const { data: profile } = useQuery({
//     queryKey: ['profile', user?.id],
//     queryFn: async () => {
//       if (!user?.id) return null;
//       // TODO: connect to backend API
//       // return data;
//     },
//     enabled: !!user?.id,
//   });

//   const charCount = pitchStatement.length;
//   const isDescriptionValid = charCount >= 10 && charCount <= 1000;

//   const userInitials = profile?.full_name
//     ?.split(' ')
//     .map((n) => n[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2) || 'U';

//   const validateLinkUrl = (url: string) => {
//     if (!url.trim()) {
//       setLinkUrlError('URL is required when external link is enabled');
//       return false;
//     }
//     const sanitized = sanitizeUrl(url);
//     if (!sanitized) {
//       setLinkUrlError('Please enter a valid URL starting with https://');
//       return false;
//     }
//     setLinkUrlError('');
//     return true;
//   };

//   const validateCtaUrl = (url: string) => {
//     if (!url.trim()) {
//       setCtaUrlError('URL is required for CTA button');
//       return false;
//     }
//     const sanitized = sanitizeUrl(url);
//     if (!sanitized) {
//       setCtaUrlError('Please enter a valid URL starting with https://');
//       return false;
//     }
//     setCtaUrlError('');
//     return true;
//   };

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image must be less than 5MB');
//         return;
//       }
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const isFormValid = () => {
//     if (!isDescriptionValid) return false;
//     if (linkEnabled && !sanitizeUrl(linkUrl)) return false;
//     if (ctaEnabled && (!ctaLabel.trim() || !sanitizeUrl(ctaUrl))) return false;
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!isFormValid() || !user) return;

//     // Final validation
//     if (linkEnabled && !validateLinkUrl(linkUrl)) return;
//     if (ctaEnabled && !validateCtaUrl(ctaUrl)) return;

//     let imageUrl: string | undefined;

//     if (imageFile) {
//       setUploading(true);
//       const fileExt = imageFile.name.split('.').pop();
//       const filePath = `${user.id}/${Date.now()}.${fileExt}`;
//       const { error: uploadError } = await (supabase as any).storage
//         .from('pitch-images')
//         .upload(filePath, imageFile);

//       if (uploadError) {
//         setUploading(false);
//         return;
//       }
//       const { data: { publicUrl } } = (supabase as any).storage
//         .from('pitch-images')
//         .getPublicUrl(filePath);
//       imageUrl = publicUrl;
//           }

//     const sanitizedLinkUrl = linkEnabled ? sanitizeUrl(linkUrl) : null;
//     const sanitizedCtaUrl = ctaEnabled ? sanitizeUrl(ctaUrl) : null;

//     await createPitch.mutateAsync({
//       pitch_statement: pitchStatement.trim(),
//       category,
//       image_url: imageUrl,
//       post_title: postTitle.trim() || undefined,
//       external_link_url: sanitizedLinkUrl || undefined,
//       external_link_title: linkEnabled ? (linkTitle.trim() || undefined) : undefined,
//       external_link_description: linkEnabled ? (linkDescription.trim() || undefined) : undefined,
//       cta_label: ctaEnabled ? (ctaLabel.trim() || undefined) : undefined,
//       cta_url: sanitizedCtaUrl || undefined,
//       cta_open_new_tab: ctaEnabled ? ctaOpenNewTab : undefined,
//     } as any);

//     onOpenChange(false);
//   };

//   const getCategoryInfo = (value: PitchCategory) => CATEGORIES.find(c => c.value === value) || CATEGORIES[5];

//   const getLinkDomain = (url: string) => {
//     try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 shrink-0">
//         <button
//           onClick={() => onOpenChange(false)}
//           className="text-muted-foreground hover:text-foreground text-sm font-medium"
//         >
//           Cancel
//         </button>
//         <span className="text-sm font-semibold text-foreground">Create Post</span>
//         <Button
//           onClick={handleSubmit}
//           disabled={!isFormValid() || createPitch.isPending || uploading}
//           size="sm"
//           className="rounded-full px-5 h-9 font-semibold flash-gradient text-primary-foreground"
//         >
//           {uploading ? 'Uploading…' : createPitch.isPending ? 'Posting…' : 'Publish'}
//         </Button>
//       </div>

//       {/* Scrollable form */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-4 space-y-5">
//           {/* Author row */}
//           <div className="flex items-center gap-3">
//             <Avatar className="h-10 w-10 border border-border/50">
//               <AvatarImage src={profile?.avatar_url || undefined} />
//               <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
//                 {userInitials}
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="font-semibold text-foreground text-sm">
//                 {profile?.full_name || 'Admin'}
//               </span>
//               <Badge variant="secondary" className="text-xs px-1.5 py-0 rounded font-medium bg-primary/10 text-primary border-0">
//                 Platform Update
//               </Badge>
//               {/* Category selector */}
//               <button
//                 onClick={() => setShowCategoryPicker(!showCategoryPicker)}
//                 className={cn(
//                   "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors",
//                   category !== 'other'
//                     ? "bg-primary/10 text-primary border-primary/30"
//                     : "text-muted-foreground border-border hover:bg-muted"
//                 )}
//               >
//                 <Tag className="h-3 w-3" />
//                 {getCategoryInfo(category).label}
//                 <ChevronDown className="h-3 w-3" />
//               </button>
//             </div>
//           </div>

//           {/* Category picker */}
//           {showCategoryPicker && (
//             <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-xl border border-border/30">
//               {CATEGORIES.map(cat => (
//                 <button
//                   key={cat.value}
//                   onClick={() => { setCategory(cat.value); setShowCategoryPicker(false); }}
//                   className={cn(
//                     "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
//                     category === cat.value
//                       ? "bg-primary text-primary-foreground border-primary"
//                       : "bg-card text-foreground border-border hover:bg-muted"
//                   )}
//                 >
//                   {cat.emoji} {cat.label}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* ─── Post Title (optional) ─── */}
//           <div className="space-y-1.5">
//             <Label htmlFor="post-title" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//               Post Title <span className="normal-case text-muted-foreground/60">(optional)</span>
//             </Label>
//             <Input
//               id="post-title"
//               placeholder="e.g. Applications Now Open — Spring Cohort 2025"
//               value={postTitle}
//               onChange={(e) => setPostTitle(e.target.value)}
//               maxLength={120}
//               className="text-base font-semibold placeholder:font-normal placeholder:text-muted-foreground/50 border-border/60"
//             />
//           </div>

//           {/* ─── Description (required) ─── */}
//           <div className="space-y-1.5">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                 Description <span className="text-destructive">*</span>
//               </Label>
//               <span className={cn(
//                 "text-xs",
//                 charCount < 10 ? "text-destructive" : charCount > 900 ? "text-amber-500" : "text-muted-foreground"
//               )}>
//                 {charCount}/1000
//               </span>
//             </div>
//             <Textarea
//               id="description"
//               placeholder="Describe the announcement, program, or opportunity clearly and professionally…"
//               value={pitchStatement}
//               onChange={(e) => setPitchStatement(e.target.value)}
//               className="min-h-[140px] resize-none border-border/60 text-[15px] leading-relaxed"
//               maxLength={1000}
//             />
//             {charCount < 10 && charCount > 0 && (
//               <p className="text-xs text-destructive">{10 - charCount} more characters needed</p>
//             )}
//           </div>

//           {/* ─── Media Upload ─── */}
//           <div className="space-y-2">
//             <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//               Cover Image <span className="normal-case text-muted-foreground/60">(optional)</span>
//             </Label>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleImageSelect}
//               className="hidden"
//             />
//             {imagePreview ? (
//               <div className="relative rounded-xl overflow-hidden border border-border/50">
//                 <img src={imagePreview} alt="Preview" className="w-full max-h-[280px] object-cover" />
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   size="icon"
//                   className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
//                   onClick={removeImage}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full flex items-center justify-center gap-2 h-24 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors"
//               >
//                 <ImagePlus className="h-5 w-5" />
//                 <span className="text-sm font-medium">Upload cover image</span>
//               </button>
//             )}
//           </div>

//           {/* ─── External Link Section ─── */}
//           <SectionToggle
//             label="External Link"
//             icon={<Link2 className="h-4 w-4" />}
//             enabled={linkEnabled}
//             onToggle={(val) => {
//               setLinkEnabled(val);
//               if (!val) { setLinkUrl(''); setLinkTitle(''); setLinkDescription(''); setLinkUrlError(''); }
//             }}
//           >
//             <div className="space-y-3">
//               <div className="space-y-1.5">
//                 <Label className="text-xs font-medium text-foreground">
//                   Link URL <span className="text-destructive">*</span>
//                 </Label>
//                 <Input
//                   placeholder="https://example.com/apply"
//                   value={linkUrl}
//                   onChange={(e) => { setLinkUrl(e.target.value); if (linkUrlError) validateLinkUrl(e.target.value); }}
//                   onBlur={() => validateLinkUrl(linkUrl)}
//                   className={cn(linkUrlError && "border-destructive")}
//                 />
//                 {linkUrlError && <p className="text-xs text-destructive">{linkUrlError}</p>}
//               </div>
//               <div className="space-y-1.5">
//                 <Label className="text-xs font-medium text-foreground">
//                   Link Title <span className="text-muted-foreground font-normal">(auto-fills from domain if empty)</span>
//                 </Label>
//                 <Input
//                   placeholder={linkUrl ? getLinkDomain(linkUrl) : 'e.g. Apply for the Program'}
//                   value={linkTitle}
//                   onChange={(e) => setLinkTitle(e.target.value)}
//                   maxLength={80}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label className="text-xs font-medium text-foreground">
//                   Link Description <span className="text-muted-foreground font-normal">(optional)</span>
//                 </Label>
//                 <Input
//                   placeholder="Short preview text shown on the link card…"
//                   value={linkDescription}
//                   onChange={(e) => setLinkDescription(e.target.value)}
//                   maxLength={140}
//                 />
//               </div>

//               {/* Link preview */}
//               {linkUrl && sanitizeUrl(linkUrl) && (
//                 <div className="space-y-1">
//                   <p className="text-xs font-medium text-muted-foreground">Preview</p>
//                   <LinkPreviewCard
//                     url={linkUrl}
//                     title={linkTitle || getLinkDomain(linkUrl)}
//                     description={linkDescription}
//                     preview
//                   />
//                 </div>
//               )}
//             </div>
//           </SectionToggle>

//           {/* ─── CTA Button Section ─── */}
//           <SectionToggle
//             label="Call-to-Action Button"
//             icon={<MousePointerClick className="h-4 w-4" />}
//             enabled={ctaEnabled}
//             onToggle={(val) => {
//               setCtaEnabled(val);
//               if (!val) { setCtaLabel(''); setCtaUrl(''); setCtaUrlError(''); }
//             }}
//           >
//             <div className="space-y-3">
//               <div className="space-y-1.5">
//                 <Label className="text-xs font-medium text-foreground">Button Label</Label>
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {CTA_PRESETS.map(preset => (
//                     <button
//                       key={preset}
//                       type="button"
//                       onClick={() => setCtaLabel(preset)}
//                       className={cn(
//                         "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
//                         ctaLabel === preset
//                           ? "bg-primary text-primary-foreground border-primary"
//                           : "bg-card text-muted-foreground border-border hover:bg-muted"
//                       )}
//                     >
//                       {preset}
//                     </button>
//                   ))}
//                 </div>
//                 <Input
//                   placeholder="Custom label…"
//                   value={ctaLabel}
//                   onChange={(e) => setCtaLabel(e.target.value)}
//                   maxLength={40}
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <Label className="text-xs font-medium text-foreground">
//                   Button URL <span className="text-destructive">*</span>
//                 </Label>
//                 <Input
//                   placeholder="https://example.com/register"
//                   value={ctaUrl}
//                   onChange={(e) => { setCtaUrl(e.target.value); if (ctaUrlError) validateCtaUrl(e.target.value); }}
//                   onBlur={() => validateCtaUrl(ctaUrl)}
//                   className={cn(ctaUrlError && "border-destructive")}
//                 />
//                 {ctaUrlError && <p className="text-xs text-destructive">{ctaUrlError}</p>}
//               </div>
//               <div className="flex items-center justify-between py-1">
//                 <Label className="text-sm font-medium text-foreground cursor-pointer">Open in new tab</Label>
//                 <Switch checked={ctaOpenNewTab} onCheckedChange={setCtaOpenNewTab} />
//               </div>

//               {/* CTA preview */}
//               {ctaLabel && ctaUrl && (
//                 <div className="space-y-1">
//                   <p className="text-xs font-medium text-muted-foreground">Preview</p>
//                   <button
//                     type="button"
//                     className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
//                   >
//                     {ctaLabel}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </SectionToggle>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Reusable Link Preview Card ───────────────────────────────────────────────

// export function LinkPreviewCard({
//   url,
//   title,
//   description,
//   preview = false,
// }: {
//   url: string;
//   title: string;
//   description?: string | null;
//   preview?: boolean;
// }) {
//   let domain = '';
//   try { domain = new URL(url).hostname.replace('www.', ''); } catch {}

//   return (
//     <a
//       href={preview ? undefined : url}
//       target={preview ? undefined : '_blank'}
//       rel="noopener noreferrer"
//       onClick={preview ? (e) => e.preventDefault() : undefined}
//       className={cn(
//         "flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card group transition-colors",
//         !preview && "hover:bg-muted/60 cursor-pointer"
//       )}
//     >
//       {/* Domain icon */}
//       <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
//         <Link2 className="h-4 w-4 text-primary" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-foreground truncate leading-snug">
//           {title}
//         </p>
//         {description && (
//           <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
//             {description}
//           </p>
//         )}
//         <p className="text-xs text-muted-foreground/60 mt-1 truncate">{domain}</p>
//       </div>
//       <ExternalLink className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
//     </a>
//   );
// }

// export function CreatePitchModal({ open, onOpenChange }: CreatePitchModalProps) {
//   const isMobile = useIsMobile();

//   if (isMobile) {
//     return (
//       <Drawer open={open} onOpenChange={onOpenChange}>
//         <DrawerContent className="h-[95vh] flex flex-col">
//           <PitchComposer onOpenChange={onOpenChange} />
//         </DrawerContent>
//       </Drawer>
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
//         <PitchComposer onOpenChange={onOpenChange} />
//       </DialogContent>
//     </Dialog>
//   );
// }







import { useState, useRef } from 'react';
import { ImagePlus, X, Tag, Check, Link2, MousePointerClick, ChevronDown, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCreatePitch } from '@/hooks/usePitches';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { sanitizeUrl } from '@/lib/validation';
import type { Database } from "@/integrations/supabase/types";
import { supabase } from '@/integrations/supabase/client'; 

type PitchCategory = Database['public']['Enums']['pitch_category'];

interface CreatePitchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: { value: PitchCategory; label: string; emoji: string }[] = [
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'consumer', label: 'Consumer', emoji: '🛍️' },
  { value: 'b2b', label: 'B2B', emoji: '🏢' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'social_impact', label: 'Social Impact', emoji: '🌍' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

const CTA_PRESETS = ['Apply Now', 'Learn More', 'Register', 'Explore', 'Join Now', 'View Details'];

function SectionToggle({
  label,
  icon,
  enabled,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: (val: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">(optional)</span>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <>
          <Separator />
          <div className="px-4 py-4 space-y-3">{children}</div>
        </>
      )}
    </div>
  );
}

function PitchComposer({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const { user } = useAuth();
  const createPitch = useCreatePitch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  // Core fields
  const [postTitle, setPostTitle] = useState('');
  const [pitchStatement, setPitchStatement] = useState('');
  const [category, setCategory] = useState<PitchCategory>('other');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // External link section
  const [linkEnabled, setLinkEnabled] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [linkUrlError, setLinkUrlError] = useState('');

  // CTA section
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [ctaOpenNewTab, setCtaOpenNewTab] = useState(true);
  const [ctaUrlError, setCtaUrlError] = useState('');
  const [showCtaPresets, setShowCtaPresets] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      // TODO: connect to backend API
      // return data;
    },
    enabled: !!user?.id,
  });

  const charCount = pitchStatement.length;
  const isDescriptionValid = charCount >= 10 && charCount <= 1000;

  const userInitials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const validateLinkUrl = (url: string) => {
    if (!url.trim()) {
      setLinkUrlError('URL is required when external link is enabled');
      return false;
    }
    const sanitized = sanitizeUrl(url);
    if (!sanitized) {
      setLinkUrlError('Please enter a valid URL starting with https://');
      return false;
    }
    setLinkUrlError('');
    return true;
  };

  const validateCtaUrl = (url: string) => {
    if (!url.trim()) {
      setCtaUrlError('URL is required for CTA button');
      return false;
    }
    const sanitized = sanitizeUrl(url);
    if (!sanitized) {
      setCtaUrlError('Please enter a valid URL starting with https://');
      return false;
    }
    setCtaUrlError('');
    return true;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isFormValid = () => {
    if (!postTitle.trim()) return false;
    if (!isDescriptionValid) return false;
    if (linkEnabled && !sanitizeUrl(linkUrl)) return false;
    if (ctaEnabled && (!ctaLabel.trim() || !sanitizeUrl(ctaUrl))) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !user) return;

    // Final validation
    if (linkEnabled && !validateLinkUrl(linkUrl)) return;
    if (ctaEnabled && !validateCtaUrl(ctaUrl)) return;

    let imageUrl: string | undefined;

    if (imageFile) {
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await (supabase as any).storage
        .from('pitch-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        setUploading(false);
        return;
      }
      const { data: { publicUrl } } = (supabase as any).storage
        .from('pitch-images')
        .getPublicUrl(filePath);
      imageUrl = publicUrl;
          }

    const sanitizedLinkUrl = linkEnabled ? sanitizeUrl(linkUrl) : null;
    const sanitizedCtaUrl = ctaEnabled ? sanitizeUrl(ctaUrl) : null;

    await createPitch.mutateAsync({
      pitch_statement: pitchStatement.trim(),
      category,
      image_url: imageUrl,
      post_title: postTitle.trim() || undefined,
      external_link_url: sanitizedLinkUrl || undefined,
      external_link_title: linkEnabled ? (linkTitle.trim() || undefined) : undefined,
      external_link_description: linkEnabled ? (linkDescription.trim() || undefined) : undefined,
      cta_label: ctaEnabled ? (ctaLabel.trim() || undefined) : undefined,
      cta_url: sanitizedCtaUrl || undefined,
      cta_open_new_tab: ctaEnabled ? ctaOpenNewTab : undefined,
    } as any);

    onOpenChange(false);
  };

  const getCategoryInfo = (value: PitchCategory) => CATEGORIES.find(c => c.value === value) || CATEGORIES[5];

  const getLinkDomain = (url: string) => {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 shrink-0">
        <button
          onClick={() => onOpenChange(false)}
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          Cancel
        </button>
        <span className="text-sm font-semibold text-foreground">Create Post</span>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || createPitch.isPending || uploading}
          size="sm"
          className="rounded-full px-5 h-9 font-semibold flash-gradient text-primary-foreground"
        >
          {uploading ? 'Uploading…' : createPitch.isPending ? 'Posting…' : 'Publish'}
        </Button>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Author row */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-sm">
                {profile?.full_name || 'Admin'}
              </span>
              <Badge variant="secondary" className="text-xs px-1.5 py-0 rounded font-medium bg-primary/10 text-primary border-0">
                Platform Update
              </Badge>
              {/* Category selector */}
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors",
                  category !== 'other'
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "text-muted-foreground border-border hover:bg-muted"
                )}
              >
                <Tag className="h-3 w-3" />
                {getCategoryInfo(category).label}
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Category picker */}
          {showCategoryPicker && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-xl border border-border/30">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => { setCategory(cat.value); setShowCategoryPicker(false); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    category === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  )}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* ─── Post Title (optional) ─── */}
          <div className="space-y-1.5">
            <Label htmlFor="post-title" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Post Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="post-title"
              placeholder="e.g. Applications Now Open — Spring Cohort 2025"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              maxLength={120}
              className="text-base font-semibold placeholder:font-normal placeholder:text-muted-foreground/50 border-border/60"
            />
          </div>

          {/* ─── Description (required) ─── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description <span className="text-destructive">*</span>
              </Label>
              <span className={cn(
                "text-xs",
                charCount < 10 ? "text-destructive" : charCount > 900 ? "text-amber-500" : "text-muted-foreground"
              )}>
                {charCount}/1000
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Describe the announcement, program, or opportunity clearly and professionally…"
              value={pitchStatement}
              onChange={(e) => setPitchStatement(e.target.value)}
              className="min-h-[140px] resize-none border-border/60 text-[15px] leading-relaxed"
              maxLength={1000}
            />
            {charCount < 10 && charCount > 0 && (
              <p className="text-xs text-destructive">{10 - charCount} more characters needed</p>
            )}
          </div>

          {/* ─── Media Upload ─── */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Cover Image <span className="normal-case text-muted-foreground/60">(optional)</span>
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border/50">
                <img src={imagePreview} alt="Preview" className="w-full max-h-[280px] object-cover" />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 h-24 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-sm font-medium">Upload cover image</span>
              </button>
            )}
          </div>

          {/* ─── External Link Section ─── */}
          <SectionToggle
            label="External Link"
            icon={<Link2 className="h-4 w-4" />}
            enabled={linkEnabled}
            onToggle={(val) => {
              setLinkEnabled(val);
              if (!val) { setLinkUrl(''); setLinkTitle(''); setLinkDescription(''); setLinkUrlError(''); }
            }}
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Link URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="https://example.com/apply"
                  value={linkUrl}
                  onChange={(e) => { setLinkUrl(e.target.value); if (linkUrlError) validateLinkUrl(e.target.value); }}
                  onBlur={() => validateLinkUrl(linkUrl)}
                  className={cn(linkUrlError && "border-destructive")}
                />
                {linkUrlError && <p className="text-xs text-destructive">{linkUrlError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Link Title <span className="text-muted-foreground font-normal">(auto-fills from domain if empty)</span>
                </Label>
                <Input
                  placeholder={linkUrl ? getLinkDomain(linkUrl) : 'e.g. Apply for the Program'}
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  maxLength={80}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Link Description <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  placeholder="Short preview text shown on the link card…"
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  maxLength={140}
                />
              </div>

              {/* Link preview */}
              {linkUrl && sanitizeUrl(linkUrl) && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Preview</p>
                  <LinkPreviewCard
                    url={linkUrl}
                    title={linkTitle || getLinkDomain(linkUrl)}
                    description={linkDescription}
                    preview
                  />
                </div>
              )}
            </div>
          </SectionToggle>

          {/* ─── CTA Button Section ─── */}
          <SectionToggle
            label="Call-to-Action Button"
            icon={<MousePointerClick className="h-4 w-4" />}
            enabled={ctaEnabled}
            onToggle={(val) => {
              setCtaEnabled(val);
              if (!val) { setCtaLabel(''); setCtaUrl(''); setCtaUrlError(''); }
            }}
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">Button Label</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {CTA_PRESETS.map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCtaLabel(preset)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                        ctaLabel === preset
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:bg-muted"
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Custom label…"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  maxLength={40}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Button URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="https://example.com/register"
                  value={ctaUrl}
                  onChange={(e) => { setCtaUrl(e.target.value); if (ctaUrlError) validateCtaUrl(e.target.value); }}
                  onBlur={() => validateCtaUrl(ctaUrl)}
                  className={cn(ctaUrlError && "border-destructive")}
                />
                {ctaUrlError && <p className="text-xs text-destructive">{ctaUrlError}</p>}
              </div>
              <div className="flex items-center justify-between py-1">
                <Label className="text-sm font-medium text-foreground cursor-pointer">Open in new tab</Label>
                <Switch checked={ctaOpenNewTab} onCheckedChange={setCtaOpenNewTab} />
              </div>

              {/* CTA preview */}
              {ctaLabel && ctaUrl && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Preview</p>
                  <button
                    type="button"
                    className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    {ctaLabel}
                  </button>
                </div>
              )}
            </div>
          </SectionToggle>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Link Preview Card ───────────────────────────────────────────────

export function LinkPreviewCard({
  url,
  title,
  description,
  preview = false,
}: {
  url: string;
  title: string;
  description?: string | null;
  preview?: boolean;
}) {
  let domain = '';
  try { domain = new URL(url).hostname.replace('www.', ''); } catch {}

  return (
    <a
      href={preview ? undefined : url}
      target={preview ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={preview ? (e) => e.preventDefault() : undefined}
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card group transition-colors",
        !preview && "hover:bg-muted/60 cursor-pointer"
      )}
    >
      {/* Domain icon */}
      <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Link2 className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <p className="text-xs text-muted-foreground/60 mt-1 truncate">{domain}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
    </a>
  );
}

export function CreatePitchModal({ open, onOpenChange }: CreatePitchModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[95vh] flex flex-col">
          <PitchComposer onOpenChange={onOpenChange} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        <PitchComposer onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
