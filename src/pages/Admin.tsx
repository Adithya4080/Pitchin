import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, ShieldCheck, Users, MessageSquare, Settings, Camera, TrendingUp, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ADMIN_EMAIL = 'pitchin.admn@gmail.com';

interface SharedProfile {
  share_id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_email: string;
  access_token: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface SharedFeedback {
  feedback_id: string;
  source_profile_id: string;
  profile_name: string | null;
  profile_avatar: string | null;
  visitor_role: string | null;
  usefulness_response: string | null;
  feedback_text: string | null;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      navigate('/feed');
    } else if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const { data: profile } = useQuery({
    queryKey: ['admin-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const data = await (await import('@/api/profiles')).getUserProfile(user.id);
      return data;
    },
    enabled: !!user?.id && user?.email === ADMIN_EMAIL,
  });

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['admin-shared-profiles'],
    queryFn: async () => {
      // Admin shared profiles list - requires backend admin endpoint
      return [] as SharedProfile[];
    },
    enabled: user?.email === ADMIN_EMAIL,
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ['admin-shared-feedback'],
    queryFn: async () => {
      // Admin feedback list - requires backend admin endpoint
      return [] as SharedFeedback[];
    },
    enabled: user?.email === ADMIN_EMAIL,
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const reader = new FileReader();
      const avatarUrl: string = await new Promise(res => { reader.onloadend = () => res(reader.result as string); reader.readAsDataURL(file); });
      const { updateMyProfile } = await import('@/api/profiles');
      await updateMyProfile({ avatar_url: avatarUrl } as any);

      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      queryClient.invalidateQueries({ queryKey: ['header-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile picture updated!');
    } catch (err: any) {
      toast.error('Failed to upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A';
  const activeProfiles = profiles?.filter(p => p.is_enabled).length ?? 0;
  const positiveCount = feedback?.filter(f => f.usefulness_response === 'yes').length ?? 0;

  return (
    <AppLayout showMobileHeader showDesktopHeader title="Admin">
      <div className="container max-w-4xl py-6 px-4 md:px-6 space-y-6">

        {/* Hero Header Card */}
        <Card className="border-border/40 bg-card shadow-card overflow-hidden">
          <div className="h-1.5 w-full bg-primary" />
          <CardContent className="p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Admin Avatar */}
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Avatar className="h-14 w-14 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
                    <span className="inline-flex items-center gap-1 rounded-md font-medium text-primary-foreground bg-primary text-[11px] px-2 py-0.5">
                      <ShieldCheck className="h-3 w-3" />
                      Admin
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile?.full_name || 'Administrator'}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{user.email}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/settings')}
                className="text-muted-foreground hover:text-foreground"
                title="Settings"
              >
                <Settings className="h-4.5 w-4.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Shared Profiles"
            value={profilesLoading ? null : profiles?.length ?? 0}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            label="Active Links"
            value={profilesLoading ? null : activeProfiles}
            icon={<TrendingUp className="h-4 w-4" />}
            accent
          />
          <StatCard
            label="Positive Feedback"
            value={feedbackLoading ? null : positiveCount}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profiles" className="w-full">
          <TabsList className="w-full bg-muted/60 p-1 h-auto rounded-lg mb-5">
            <TabsTrigger
              value="profiles"
              className="flex-1 gap-1.5 text-sm py-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-foreground text-muted-foreground"
            >
              <Users className="h-3.5 w-3.5" />
              Shared Profiles
              {!profilesLoading && profiles && profiles.length > 0 && (
                <span className="ml-1 bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {profiles.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="flex-1 gap-1.5 text-sm py-2 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-soft data-[state=active]:text-foreground text-muted-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Feedback
              {!feedbackLoading && feedback && feedback.length > 0 && (
                <span className="ml-1 bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                  {feedback.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Shared Profiles Tab */}
          <TabsContent value="profiles" className="space-y-3 mt-0">
            {profilesLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border/40 shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {!profilesLoading && profiles && (
              <>
                {profiles.length === 0 ? (
                  <EmptyState
                    icon={<Users className="h-8 w-8 text-muted-foreground/40" />}
                    title="No shared profiles yet"
                    description="Shared profiles will appear here once users share their profiles."
                  />
                ) : (
                  profiles.map((p) => (
                    <Card key={p.share_id} className="border-border/40 shadow-card hover:shadow-soft transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0 ring-1 ring-border/50">
                            <AvatarImage src={p.avatar_url ?? undefined} />
                            <AvatarFallback className="text-xs bg-muted font-medium">
                              {p.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="font-medium text-sm text-foreground truncate">
                                {p.full_name ?? 'Unnamed'}
                              </span>
                              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                p.is_enabled
                                  ? 'bg-success/10 text-success'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${p.is_enabled ? 'bg-success' : 'bg-muted-foreground'}`} />
                                {p.is_enabled ? 'Active' : 'Disabled'}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{p.user_email}</p>
                            <p className="text-xs text-muted-foreground/60 mt-0.5">
                              Shared {format(new Date(p.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 shrink-0 border-border/50"
                            onClick={() =>
                              window.open(`/shared/${p.user_id}?token=${p.access_token}`, '_blank')
                            }
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-3 mt-0">
            {feedbackLoading && (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border/40 shadow-card">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-12 w-full rounded-md" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {!feedbackLoading && feedback && (
              <>
                {feedback.length === 0 ? (
                  <EmptyState
                    icon={<MessageSquare className="h-8 w-8 text-muted-foreground/40" />}
                    title="No feedback yet"
                    description="Visitor feedback from shared profiles will appear here."
                  />
                ) : (
                  feedback.map((item) => (
                    <Card key={item.feedback_id} className="border-border/40 shadow-card">
                      <CardContent className="p-4 space-y-3">
                        {/* Row 1: Avatar + Name + Useful badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={item.profile_avatar ?? undefined} />
                              <AvatarFallback className="text-[10px] bg-muted font-medium">
                                {item.profile_name?.charAt(0)?.toUpperCase() ?? '?'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-foreground">
                              {item.profile_name ?? 'Unknown'}
                            </span>
                          </div>
                          {item.usefulness_response && (
                            <UsefulBadge response={item.usefulness_response} />
                          )}
                        </div>

                        {/* Row 2: Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.visitor_role && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                              {item.visitor_role}
                            </span>
                          )}
                        </div>

                        {/* Row 3: Feedback text */}
                        {item.feedback_text && (
                          <p className="text-sm text-foreground leading-relaxed bg-muted/40 border border-border/30 rounded-lg px-3 py-2.5">
                            "{item.feedback_text}"
                          </p>
                        )}

                        {/* Row 4: Timestamp */}
                        <p className="text-xs text-muted-foreground/60">
                          {format(new Date(item.created_at), 'MMM d, yyyy · h:mm a')}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

/* ── Sub-components ── */

function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: number | null;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className={`border-border/40 shadow-card ${accent ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
      <CardContent className="p-3 md:p-4">
        <div className={`mb-2 ${accent ? 'text-primary' : 'text-muted-foreground'}`}>{icon}</div>
        <div className={`text-2xl font-bold ${accent ? 'text-primary' : 'text-foreground'}`}>
          {value === null ? <Skeleton className="h-7 w-10" /> : value}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
      </CardContent>
    </Card>
  );
}

function UsefulBadge({ response }: { response: string }) {
  if (response === 'yes') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
        <CheckCircle2 className="h-3 w-3" />
        Useful
      </span>
    );
  }
  if (response === 'no') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
        <XCircle className="h-3 w-3" />
        Not useful
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
      <MinusCircle className="h-3 w-3" />
      {response}
    </span>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/40 border-dashed bg-card/50">
      <CardContent className="py-12 flex flex-col items-center text-center gap-2">
        {icon}
        <p className="text-sm font-medium text-foreground mt-1">{title}</p>
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
