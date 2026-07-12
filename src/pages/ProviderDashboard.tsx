import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, X, Plus, Building2, ImageIcon, ArrowLeft, HelpCircle, Pencil, Trash2, Link2, Users, Tags, Wallet, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagInput } from '@/components/ui/tag-input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { isProviderRole } from '@/hooks/useRoleProfile';
import {
  useServiceCategories,
  useMyProvider,
  useCreateMyProvider,
  useUpdateMyProvider,
  useAddMyProviderMedia,
  useUpdateMyProviderMedia,
  useDeleteMyProviderMedia,
  useMyProviderFAQs,
  useAddMyProviderFAQ,
  useUpdateMyProviderFAQ,
  useDeleteMyProviderFAQ,
  useMyProviderCollaborators,
  useAddMyProviderCollaborator,
  useDeleteMyProviderCollaborator,
  useCreateServiceCategory,
  useCreateServiceSubCategory,
} from '@/hooks/useServices';
import type { MyProviderInput, ProviderMediaItem } from '@/api/services';

const STAGE_OPTIONS = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'mvp', label: 'MVP Stage' },
  { value: 'early', label: 'Early Stage' },
  { value: 'growth', label: 'Growth Stage' },
  { value: 'scale', label: 'Scale Stage' },
];

const PRICING_OPTIONS = [
  { value: 'hourly', label: 'Hourly rate' },
  { value: 'fixed', label: 'Fixed price' },
  { value: 'retainer', label: 'Monthly retainer' },
  { value: 'custom', label: 'Custom quote' },
];

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: categories } = useServiceCategories();
  const { data: myProvider, isLoading: providerLoading } = useMyProvider();
  const createProvider = useCreateMyProvider();
  const updateProvider = useUpdateMyProvider();
  const addMedia = useAddMyProviderMedia();
  const updateMedia = useUpdateMyProviderMedia();
  const deleteMedia = useDeleteMyProviderMedia();
  const { data: faqs } = useMyProviderFAQs();
  const addFaq = useAddMyProviderFAQ();
  const updateFaq = useUpdateMyProviderFAQ();
  const deleteFaq = useDeleteMyProviderFAQ();
  const { data: collaborators } = useMyProviderCollaborators();
  const addCollaborator = useAddMyProviderCollaborator();
  const deleteCollaborator = useDeleteMyProviderCollaborator();
  const createCategory = useCreateServiceCategory();
  const createSubCategory = useCreateServiceSubCategory();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<MyProviderInput>({});
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryDisclaimerOpen, setCategoryDisclaimerOpen] = useState(false);
  const [newSubCategoryOpen, setNewSubCategoryOpen] = useState(false);
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [disclaimerMode, setDisclaimerMode] = useState<'create' | 'multi'>('create');
  const prevSubCategoryCount = useRef(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [pendingProjectFile, setPendingProjectFile] = useState<File | null>(null);

  const [collabDialogOpen, setCollabDialogOpen] = useState(false);
  const [collabName, setCollabName] = useState('');
  const [collabWebsite, setCollabWebsite] = useState('');
  const [collabLogoFile, setCollabLogoFile] = useState<File | null>(null);

  const exists = myProvider && 'exists' in myProvider && myProvider.exists;

  // Gate: only provider-type accounts (consultant, ecosystem service
  // provider) belong here.
  useEffect(() => {
    if (!authLoading && user && !isProviderRole(user.role)) {
      navigate('/network');
    }
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  // Seed the form once we know whether a provider bio already exists.
  useEffect(() => {
    if (exists && myProvider) {
      setForm({
        category: myProvider.category,
        name: myProvider.name,
        tagline: myProvider.tagline,
        description: myProvider.description,
        website: myProvider.website,
        location: myProvider.location,
        pricing_type: myProvider.pricing_type,
        starting_price: myProvider.starting_price ?? undefined,
        tags: myProvider.tags,
        sub_categories: myProvider.sub_categories,
        stage_focus: myProvider.stage_focus,
      });
      prevSubCategoryCount.current = myProvider.sub_categories?.length || 0;
    }
  }, [exists, myProvider]);

  const selectedCategory = categories?.find((c) => c.id === form.category);

  const set = <K extends keyof MyProviderInput>(key: K, value: MyProviderInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.name || !form.category) {
      toast({ title: 'Company name and category are required', variant: 'destructive' });
      return;
    }
    try {
      if (exists) {
        await updateProvider.mutateAsync(form);
        toast({ title: 'Bio updated' });
      } else {
        await createProvider.mutateAsync(form);
        toast({ title: 'Bio created — you\u2019re now live on the Network page' });
      }
    } catch (e) {
      toast({ title: 'Something went wrong', description: (e as Error).message, variant: 'destructive' });
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    if (exists) {
      try {
        await updateProvider.mutateAsync({ logo: file });
        toast({ title: 'Logo updated' });
      } catch (err) {
        toast({ title: 'Logo upload failed', description: (err as Error).message, variant: 'destructive' });
      }
    } else {
      set('logo', file);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerPreview(URL.createObjectURL(file));
    if (exists) {
      try {
        await updateProvider.mutateAsync({ banner: file });
        toast({ title: 'Banner updated' });
      } catch (err) {
        toast({ title: 'Banner upload failed', description: (err as Error).message, variant: 'destructive' });
      }
    } else {
      set('banner', file);
    }
  };

  const handleProjectFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingProjectFile(file);
    if (mediaInputRef.current) mediaInputRef.current.value = '';
  };

  const openNewProjectDialog = () => {
    setEditingProjectId(null);
    setProjectTitle('');
    setProjectDescription('');
    setProjectLink('');
    setPendingProjectFile(null);
    setProjectDialogOpen(true);
  };

  const openEditProjectDialog = (m: ProviderMediaItem) => {
    setEditingProjectId(m.id);
    setProjectTitle(m.title || '');
    setProjectDescription(m.description || '');
    setProjectLink(m.link || '');
    setPendingProjectFile(null);
    setProjectDialogOpen(true);
  };

  const handleSaveProject = async () => {
    if (!editingProjectId && !pendingProjectFile) {
      toast({ title: 'Add a photo of the work', variant: 'destructive' });
      return;
    }
    try {
      if (editingProjectId) {
        await updateMedia.mutateAsync({
          id: editingProjectId,
          title: projectTitle,
          description: projectDescription,
          link: projectLink,
          ...(pendingProjectFile ? { image: pendingProjectFile } : {}),
        });
        toast({ title: 'Project updated' });
      } else {
        await addMedia.mutateAsync({
          image: pendingProjectFile as File,
          title: projectTitle,
          description: projectDescription,
          link: projectLink,
        });
        toast({ title: 'Project added to your bio' });
      }
      setProjectDialogOpen(false);
    } catch (err) {
      toast({ title: 'Could not save project', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteMedia.mutateAsync(id);
      toast({ title: 'Project removed' });
    } catch (err) {
      toast({ title: 'Could not remove project', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const openNewCollabDialog = () => {
    setCollabName('');
    setCollabWebsite('');
    setCollabLogoFile(null);
    setCollabDialogOpen(true);
  };

  const handleSaveCollaborator = async () => {
    if (!collabName.trim()) {
      toast({ title: 'Company / client name is required', variant: 'destructive' });
      return;
    }
    try {
      await addCollaborator.mutateAsync({
        name: collabName.trim(),
        website: collabWebsite.trim() || undefined,
        logo: collabLogoFile || undefined,
      });
      toast({ title: 'Added to "Trusted by"' });
      setCollabDialogOpen(false);
    } catch (err) {
      toast({ title: 'Could not add collaborator', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleDeleteCollaborator = async (id: number) => {
    try {
      await deleteCollaborator.mutateAsync(id);
      toast({ title: 'Removed' });
    } catch (err) {
      toast({ title: 'Could not remove', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const openNewFaqDialog = () => {
    setEditingFaqId(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqDialogOpen(true);
  };

  const openEditFaqDialog = (id: number, question: string, answer: string) => {
    setEditingFaqId(id);
    setFaqQuestion(question);
    setFaqAnswer(answer);
    setFaqDialogOpen(true);
  };

  const handleSaveFaq = async () => {
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      toast({ title: 'Both question and answer are required', variant: 'destructive' });
      return;
    }
    try {
      if (editingFaqId) {
        await updateFaq.mutateAsync({ id: editingFaqId, question: faqQuestion.trim(), answer: faqAnswer.trim() });
        toast({ title: 'FAQ updated' });
      } else {
        await addFaq.mutateAsync({ question: faqQuestion.trim(), answer: faqAnswer.trim() });
        toast({ title: 'FAQ added — live on your bio' });
      }
      setFaqDialogOpen(false);
    } catch (err) {
      toast({ title: 'Could not save FAQ', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleDeleteFaq = async (id: number) => {
    try {
      await deleteFaq.mutateAsync(id);
      toast({ title: 'FAQ removed' });
    } catch (err) {
      toast({ title: 'Could not remove FAQ', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const cat = await createCategory.mutateAsync({ name: newCategoryName.trim() });
      set('category', cat.id);
      set('sub_categories', []);
      setNewCategoryName('');
      setNewCategoryOpen(false);
      toast({ title: `"${cat.name}" category created and selected` });
    } catch (err) {
      toast({ title: 'Could not create category', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const handleCreateSubCategory = async () => {
    if (!newSubCategoryName.trim() || !form.category) return;
    try {
      const sub = await createSubCategory.mutateAsync({ category: form.category, name: newSubCategoryName.trim() });
      set('sub_categories', [...(form.sub_categories || []), sub.id]);
      setNewSubCategoryName('');
      setNewSubCategoryOpen(false);
      toast({ title: `"${sub.name}" added to your services` });
    } catch (err) {
      toast({ title: 'Could not create sub-category', description: (err as Error).message, variant: 'destructive' });
    }
  };

  const toggleSubCategory = (id: number) => {
    const current = form.sub_categories || [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    set('sub_categories', next);

    // Show the multi-listing disclaimer the moment a user crosses from a
    // single service into multiple services under this category — every
    // time it happens, not just once per session.
    if (next.length >= 2 && prevSubCategoryCount.current < 2) {
      setDisclaimerMode('multi');
      setCategoryDisclaimerOpen(true);
    }
    prevSubCategoryCount.current = next.length;
  };

  if (authLoading || providerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const saving = createProvider.isPending || updateProvider.isPending;
  const currentLogo = logoPreview || (exists ? myProvider.logo_url : null);
  const currentBanner = bannerPreview || (exists ? myProvider.banner_url : null);

  const completionChecks = [
    !!form.name,
    !!form.tagline,
    !!(form.description && form.description.length > 20),
    !!form.category,
    !!(form.sub_categories && form.sub_categories.length > 0),
    !!form.pricing_type,
    !!(exists && myProvider.media && myProvider.media.length > 0),
    !!(exists && faqs && faqs.length > 0),
  ];
  const completionPercent = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#EEF2F7 ] dark:bg-background pb-28">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full" onClick={() => navigate('/network')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="font-semibold leading-tight tracking-tight text-lg truncate">
                {exists ? 'Your provider bio' : 'Set up your provider bio'}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {exists ? 'Live on the Network page for founders to discover' : 'This is what founders will see on the Network page'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end gap-1 w-32">
              <span className="text-[11px] font-medium text-muted-foreground">
                {completionPercent}% complete
              </span>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="rounded-lg shadow-sm">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {exists ? 'Save changes' : 'Publish bio'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Banner & logo */}
        <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm">
          <div
            className="h-40 sm:h-48 bg-gradient-to-r from-primary/25 via-primary/10 to-transparent bg-cover bg-center relative flex items-end justify-end p-4"
            style={currentBanner ? { backgroundImage: `url(${currentBanner})` } : undefined}
          >
            <input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={handleBannerChange} />
            <Button size="sm" variant="secondary" className="rounded-lg shadow-sm" onClick={() => bannerInputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5 mr-1.5" /> {currentBanner ? 'Change banner' : 'Add banner'}
            </Button>
          </div>
          <CardContent className="pt-0 -mt-10 flex items-end gap-4 pb-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl border-4 border-background shadow-md overflow-hidden flex items-center justify-center bg-muted">
                {currentLogo ? (
                  <img src={currentLogo} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-9 w-9 text-muted-foreground" />
                )}
              </div>
              <input ref={logoInputRef} type="file" accept="image/*" hidden onChange={handleLogoChange} />
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-sm border border-background"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground pb-2">Logo shows on your listing card and bio page.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Basics */}
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Company basics</CardTitle>
                <CardDescription>Who you are and what you do</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Company / brand name</Label>
                <Input value={form.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Acme Legal Co." className="rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label>Tagline</Label>
                <Input
                  value={form.tagline || ''}
                  onChange={(e) => set('tagline', e.target.value)}
                  placeholder="One line that sells what you do"
                  maxLength={200}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label>About / bio</Label>
                <Textarea
                  value={form.description || ''}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Tell founders about your history, experience, and what you want to showcase"
                  rows={6}
                  className="rounded-lg resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input value={form.website || ''} onChange={(e) => set('website', e.target.value)} placeholder="https://" className="rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={form.location || ''} onChange={(e) => set('location', e.target.value)} placeholder="City, Country" className="rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category & services */}
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Tags className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Category & services</CardTitle>
                <CardDescription>Where you show up in the Network directory</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <div className="flex gap-2">
                  <Select value={form.category ? String(form.category) : undefined} onValueChange={(v) => { set('category', Number(v)); set('sub_categories', []); prevSubCategoryCount.current = 0; }}>
                    <SelectTrigger className="flex-1 rounded-lg">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0 rounded-lg border-border/70 hover:border-primary/40 hover:bg-primary/5"
                    onClick={() => { setDisclaimerMode('create'); setCategoryDisclaimerOpen(true); }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Don't see your category? Create a new one — it goes live immediately.</p>
              </div>

              {selectedCategory && (
                <div className="space-y-1.5">
                  <Label>Sub-categories / specific services</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.sub_categories.map((sc) => {
                      const selected = (form.sub_categories || []).includes(sc.id);
                      return (
                        <Badge
                          key={sc.id}
                          variant={selected ? 'default' : 'outline'}
                          className="cursor-pointer rounded-full px-3 py-1 font-normal transition-colors"
                          onClick={() => toggleSubCategory(sc.id)}
                        >
                          {sc.name}
                          {selected && <X className="h-3 w-3 ml-1" />}
                        </Badge>
                      );
                    })}
                    <Badge
                      variant="outline"
                      className="cursor-pointer border-dashed rounded-full px-3 py-1 font-normal hover:border-primary/50 hover:text-primary"
                      onClick={() => setNewSubCategoryOpen(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> New sub-category
                    </Badge>
                  </div>
                  {(form.sub_categories?.length || 0) >= 2 && (
                    <button
                      type="button"
                      onClick={() => { setDisclaimerMode('multi'); setCategoryDisclaimerOpen(true); }}
                      className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500 hover:underline pt-0.5"
                    >
                      <AlertTriangle className="h-3 w-3" /> Listing under multiple services — review guidance
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Tags (skills, specialities)</Label>
                <TagInput value={form.tags || []} onChange={(tags) => set('tags', tags)} placeholder="e.g. Trademark, SEO, GST filing..." />
              </div>

              <div className="space-y-1.5">
                <Label>Which startup stage do you focus on?</Label>
                <Select value={form.stage_focus || undefined} onValueChange={(v) => set('stage_focus', v)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Pricing */}
          <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-1">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Pricing model</Label>
                <Select value={form.pricing_type || undefined} onValueChange={(v) => set('pricing_type', v as MyProviderInput['pricing_type'])}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICING_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Starting price (₹)</Label>
                <Input
                  type="number"
                  value={form.starting_price ?? ''}
                  onChange={(e) => set('starting_price', e.target.value)}
                  placeholder="e.g. 5000"
                  className="rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Trusted by — companies / brands / clients the provider has worked with */}
          <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Trusted by</CardTitle>
                  <CardDescription>
                    {exists ? 'Well-known companies or clients you\u2019ve collaborated with' : 'Save your bio first, then add collaborators here'}
                  </CardDescription>
                </div>
              </div>
              {exists && (
                <Button size="sm" variant="outline" className="rounded-lg shrink-0" onClick={openNewCollabDialog}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!exists ? (
                <div className="text-sm text-muted-foreground border border-dashed rounded-xl p-5 text-center bg-muted/30">
                  Publish your bio above to unlock this section.
                </div>
              ) : !collaborators || collaborators.length === 0 ? (
                <div className="text-sm text-muted-foreground border border-dashed rounded-xl p-5 text-center bg-muted/30 flex flex-col items-center gap-2">
                  <Users className="h-5 w-5" />
                  No collaborators added yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {collaborators.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 border rounded-full pl-2 pr-1 py-1.5 bg-card">
                      {c.logo_url ? (
                        <img src={c.logo_url} alt={c.name} className="h-5 w-5 rounded-full object-cover" />
                      ) : (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs font-medium">{c.name}</span>
                      <button
                        onClick={() => handleDeleteCollaborator(c.id)}
                        className="h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Portfolio / past work — real projects with title, description, and a live link */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Past work & collaborations</CardTitle>
                <CardDescription>
                  {exists ? 'Showcase real projects — with a link founders can click through to' : 'Save your bio first, then add projects here'}
                </CardDescription>
              </div>
            </div>
            {exists && (
              <Button size="sm" variant="outline" className="rounded-lg shrink-0" onClick={openNewProjectDialog}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add project
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!exists ? (
              <div className="text-sm text-muted-foreground border border-dashed rounded-xl p-5 text-center bg-muted/30">
                Publish your bio above to unlock portfolio uploads.
              </div>
            ) : !myProvider.media || myProvider.media.length === 0 ? (
              <div className="text-sm text-muted-foreground border border-dashed rounded-xl p-5 text-center bg-muted/30 flex flex-col items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                No projects yet — add your first one to show founders real proof of work.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myProvider.media.map((m) => (
                  <div key={m.id} className="group rounded-xl overflow-hidden border border-border/60">
                    <div className="relative aspect-video bg-muted">
                      <img src={m.image_url} alt={m.title || 'Work sample'} className="h-full w-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditProjectDialog(m)}
                          className="h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(m.id)}
                          className="h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {(m.title || m.link) && (
                      <div className="p-3">
                        {m.title && <p className="text-xs font-semibold truncate">{m.title}</p>}
                        {m.link && (
                          <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                            <Link2 className="h-3 w-3 shrink-0" /> {m.link}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <input ref={mediaInputRef} type="file" accept="image/*" hidden onChange={handleProjectFileSelect} />
          </CardContent>
        </Card>

        {/* FAQs — shown on the public bio, replaces generic auto-written questions */}
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <HelpCircle className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Frequently asked questions</CardTitle>
                <CardDescription>
                  {exists ? 'Answer what founders usually ask you' : 'Save your bio first, then add FAQs here'}
                </CardDescription>
              </div>
            </div>
            {exists && (
              <Button size="sm" variant="outline" className="rounded-lg shrink-0" onClick={openNewFaqDialog}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!exists ? (
              <div className="text-sm text-muted-foreground border border-dashed rounded-xl p-5 text-center bg-muted/30">
                Publish your bio above to unlock FAQs.
              </div>
            ) : !faqs || faqs.length === 0 ? (
              <div className="text-sm text-muted-foreground border border-dashed rounded-xl p-5 text-center bg-muted/30 flex flex-col items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                No FAQs yet — founders will see generic default questions until you add your own.
              </div>
            ) : (
              <div className="space-y-2.5">
                {faqs.map((f) => (
                  <div key={f.id} className="border border-border/60 rounded-xl p-3.5 flex items-start justify-between gap-3 hover:bg-muted/30 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{f.question}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{f.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => openEditFaqDialog(f.id, f.question, f.answer)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => handleDeleteFaq(f.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category disclaimer dialog — shown before creating a brand-new
          category, and automatically whenever multiple services are
          selected under the current category. */}
      <Dialog open={categoryDisclaimerOpen} onOpenChange={setCategoryDisclaimerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <DialogTitle className="text-center">
              {disclaimerMode === 'create' ? 'Before you add a category' : 'Listing under multiple services'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground text-center px-1">
            <p>
              Your company can be listed in multiple sectors if it provides all of these services
              under the same legal business.
            </p>
            <p>
              If your organisation operates multiple specialised companies or subsidiaries, we
              recommend creating separate company profiles for each company instead of combining
              them into one profile. This improves discoverability, branding, and networking
              across the platform.
            </p>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            {disclaimerMode === 'create' ? (
              <>
                <Button variant="outline" onClick={() => setCategoryDisclaimerOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setCategoryDisclaimerOpen(false);
                    setNewCategoryOpen(true);
                  }}
                >
                  I understand, continue
                </Button>
              </>
            ) : (
              <Button onClick={() => setCategoryDisclaimerOpen(false)}>
                <CheckCircle2 className="h-4 w-4 mr-1.5" /> Got it
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New category dialog */}
      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new category</DialogTitle>
          </DialogHeader>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="e.g. Bookkeeping & Accounting"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCategoryOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCategory} disabled={createCategory.isPending}>
              {createCategory.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New sub-category dialog */}
      <Dialog open={newSubCategoryOpen} onOpenChange={setNewSubCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new sub-category</DialogTitle>
          </DialogHeader>
          <Input
            value={newSubCategoryName}
            onChange={(e) => setNewSubCategoryName(e.target.value)}
            placeholder="e.g. Trademark Registration"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSubCategoryOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSubCategory} disabled={createSubCategory.isPending}>
              {createSubCategory.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / edit FAQ dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={setFaqDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaqId ? 'Edit FAQ' : 'Add an FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} placeholder="e.g. Do you offer fixed pricing?" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Answer</Label>
              <Textarea value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} placeholder="Write your answer..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveFaq} disabled={addFaq.isPending || updateFaq.isPending}>
              {(addFaq.isPending || updateFaq.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingFaqId ? 'Save changes' : 'Add FAQ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / edit project dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProjectId ? 'Edit project' : 'Add a project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Photo</Label>
              <button
                type="button"
                onClick={() => mediaInputRef.current?.click()}
                className="w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors overflow-hidden"
              >
                {pendingProjectFile ? (
                  <img src={URL.createObjectURL(pendingProjectFile)} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-xs">{editingProjectId ? 'Replace photo (optional)' : 'Upload a photo'}</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-1.5">
              <Label>Project title</Label>
              <Input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Fintech app redesign for Acme Corp" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>What did you do?</Label>
              <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Briefly describe the project and outcome" rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Live link (optional)</Label>
              <Input value={projectLink} onChange={(e) => setProjectLink(e.target.value)} placeholder="https://... — the live project or case study" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveProject} disabled={addMedia.isPending || updateMedia.isPending}>
              {(addMedia.isPending || updateMedia.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProjectId ? 'Save changes' : 'Add project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add collaborator dialog */}
      <Dialog open={collabDialogOpen} onOpenChange={setCollabDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a collaborator</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Logo (optional)</Label>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {collabLogoFile ? (
                    <img src={URL.createObjectURL(collabLogoFile)} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCollabLogoFile(e.target.files?.[0] || null)}
                  className="text-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Company / client name</Label>
              <Input value={collabName} onChange={(e) => setCollabName(e.target.value)} placeholder="e.g. Acme Corp" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Website (optional)</Label>
              <Input value={collabWebsite} onChange={(e) => setCollabWebsite(e.target.value)} placeholder="https://" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCollabDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCollaborator} disabled={addCollaborator.isPending}>
              {addCollaborator.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}