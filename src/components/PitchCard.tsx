import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Send, Trash2, MoreHorizontal, Share2, Repeat2, ExternalLink, Link2, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { RoleBadge } from './RoleBadge';
import { PitchWithProfile, useReactToPitch, useDeletePitch } from '@/hooks/usePitches';
import { useSendInterest } from '@/hooks/useSendInterest';
import { useHasSentInterest } from '@/hooks/useHasSentInterest';
import { usePitchReactionCounts } from '@/hooks/usePitchReactionCounts';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';

const ADMIN_EMAIL = 'pitchin.admn@gmail.com';

type ReactionType = Database['public']['Enums']['reaction_type'];

interface PitchCardProps {
  pitch: PitchWithProfile;
  hideBorder?: boolean;
}

// ─── Link Preview Card ────────────────────────────────────────────────────────
function LinkPreviewCard({
  url,
  title,
  description,
}: {
  url: string;
  title: string;
  description?: string | null;
}) {
  let domain = '';
  try { domain = new URL(url).hostname.replace('www.', ''); } catch {}

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
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

// ─── CTA Button ───────────────────────────────────────────────────────────────
function CtaButton({
  label,
  url,
  openNewTab,
}: {
  label: string;
  url: string;
  openNewTab: boolean;
}) {
  return (
    <a
      href={url}
      target={openNewTab ? '_blank' : '_self'}
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center justify-center w-full md:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:bg-primary/80 transition-colors"
    >
      {label}
    </a>
  );
}

export function PitchCard({ pitch, hideBorder = false }: PitchCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const reactMutation = useReactToPitch();
  const deleteMutation = useDeletePitch();
  const sendInterestMutation = useSendInterest();

  const { data: existingInterest } = useHasSentInterest(pitch.id);
  const { data: reactionCounts } = usePitchReactionCounts(String(pitch.id));
  const { data: userRole } = useUserRole(pitch.user_id);

  const isAdminAuthor = pitch.user_id === '006e4a3d-b4d7-4eff-a033-b795ea7b7326';
  const hasPendingOrApproved = existingInterest?.status === 'pending' || existingInterest?.status === 'approved';

  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [expanded, setExpanded] = useState(false);

  const isOwner = user?.id === pitch.user_id;

  // Parse new structured fields
  const p = pitch as any;
  const postTitle = p.post_title as string | null;
  const externalLinkUrl = p.external_link_url as string | null;
  const externalLinkTitle = p.external_link_title as string | null;
  const externalLinkDescription = p.external_link_description as string | null;
  const ctaLabel = p.cta_label as string | null;
  const ctaUrl = p.cta_url as string | null;
  const ctaOpenNewTab = p.cta_open_new_tab !== false; // default true

  // Validate URLs before rendering
  const isValidUrl = (url: string | null): url is string => {
    if (!url) return false;
    try { new URL(url); return true; } catch { return false; }
  };

  const showLinkCard = isValidUrl(externalLinkUrl);
  const showCta = !!(ctaLabel && isValidUrl(ctaUrl));
  const resolvedLinkTitle = externalLinkTitle || (() => {
    try { return new URL(externalLinkUrl!).hostname.replace('www.', ''); } catch { return externalLinkUrl || ''; }
  })();

  const initials = pitch.profiles?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  const handleProfileClick = () => {
    if (isAdminAuthor) navigate('/admin');
    else navigate(`/profile/${(pitch as any).author_id ?? pitch.user_id}`);
  };

  const handleReaction = (reactionType: ReactionType) => {
    if (!user) return;
    reactMutation.mutate({
      pitchId: pitch.id,
      reactionType,
      currentReaction: pitch.user_reaction || null,
    });
  };

  const submitInterest = () => {
  sendInterestMutation.mutate(
    {
      receiverId: Number(pitch.user_id),
      subject: 'Interest in your post',
      message: interestMessage || `I'm interested in your post: "${pitch.pitch_statement?.slice(0, 60)}"`,
      tag: 'pitch',
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['interest-status', pitch.id] });
      },
    }
  );
  setShowInterestDialog(false);
  setInterestMessage('');
};

  // const submitInterest = () => {
  //   sendInterestMutation.mutate(
  //     { pitchId:pitch.id, message: interestMessage || undefined },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries({ queryKey: ['interest-status', pitch.id] });
  //       },
  //     }
  //   );
  //   setShowInterestDialog(false);
  //   setInterestMessage('');
  // };

  const handleDelete = () => {
    deleteMutation.mutate(pitch.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        queryClient.invalidateQueries({ queryKey: ['my-pitches'] });
      },
    });
  };

  const shouldTruncate = (pitch.pitch_statement?.length ?? 0) > 200 && !expanded;
  const displayText = shouldTruncate
    ? (pitch.pitch_statement ?? '').slice(0, 200) + '…'
    : (pitch.pitch_statement ?? '');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn("py-4 px-4", !hideBorder && "rounded-lg border border-border bg-card")}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center justify-center gap-3">
            <Avatar
              className={cn(
                "h-11 w-11 shrink-0 cursor-pointer hover:opacity-80 transition-opacity",
                userRole?.role === 'ecosystem_partner' ? 'rounded-lg' : ''
              )}
              onClick={handleProfileClick}
            >
              <AvatarImage src={pitch.profiles?.avatar_url || undefined} />
              <AvatarFallback className={cn(
                "bg-muted text-muted-foreground font-semibold",
                userRole?.role === 'ecosystem_partner' ? 'rounded-lg' : ''
              )}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <span
                  className="font-semibold text-foreground text-[15px] cursor-pointer hover:text-primary hover:underline transition-colors"
                  onClick={handleProfileClick}
                >
                  {pitch.profiles?.full_name || 'Anonymous'}
                </span>
                {isAdminAuthor ? (
                  <RoleBadge role="admin" size="sm" showIcon={true} />
                ) : userRole?.role ? (
                  <RoleBadge role={userRole.role} size="sm" showIcon={true} />
                ) : null}
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">{getTimeAgo(pitch.created_at)}</span>
              </div>
              {/* Platform Update label for admin posts */}
              {isAdminAuthor && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Megaphone className="h-3 w-3 text-primary/70" />
                  <span className="text-xs text-primary/80 font-medium">Platform Update</span>
                </div>
              )}
            </div>
          </div>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-transparent">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              )}
              {!isOwner && (
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Post Title ───────────────────────────────────────── */}
        {postTitle && (
          <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
            {postTitle}
          </h3>
        )}

        {/* ── Description ──────────────────────────────────────── */}
        <div className="mb-3">
          <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap">
            {displayText}
            {shouldTruncate && (
              <button
                onClick={() => setExpanded(true)}
                className="text-primary hover:underline ml-1 font-medium"
              >
                Read more
              </button>
            )}
          </p>
          {pitch.supporting_line && (
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              {pitch.supporting_line}
            </p>
          )}
        </div>

        {/* ── Media ────────────────────────────────────────────── */}
        {(p.image || pitch.image) && (
          <div className="w-[calc(100%+2rem)] -mx-4 mb-3 overflow-hidden bg-muted/30">
            <img
              src={p.image || pitch.image}
              alt="Post attachment"
              className="w-full h-auto object-cover max-h-[70vh]"
            />
          </div>
        )}

        {/* ── Link Preview Card ─────────────────────────────────── */}
        {showLinkCard && (
          <div className="mb-3">
            <LinkPreviewCard
              url={externalLinkUrl!}
              title={resolvedLinkTitle}
              description={externalLinkDescription}
            />
          </div>
        )}

        {/* ── CTA Button ───────────────────────────────────────── */}
        {showCta && (
          <div className="mb-3">
            <CtaButton label={ctaLabel!} url={ctaUrl!} openNewTab={ctaOpenNewTab} />
          </div>
        )}

        {/* ── Engagement Stats ──────────────────────────────────── */}
        <div className="flex items-center justify-between text-sm text-muted-foreground py-2 border-b border-border/50">
          <div className="flex items-center gap-4">
            {(reactionCounts?.fire || 0) > 0 && (
              <div className="flex items-center gap-1">
                <Flame className={cn("h-4 w-4", pitch.user_reaction === 'fire' ? "text-orange-500" : "text-muted-foreground")} />
                <span>{reactionCounts?.fire}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {pitch.save_count > 0 && <span>{pitch.save_count} saves</span>}
          </div>
        </div>

        {/* ── Action Bar ───────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-10 px-4 gap-2 text-muted-foreground hover:bg-muted/50 rounded-lg",
              pitch.user_reaction === 'fire' && "text-orange-500"
            )}
            onClick={() => handleReaction('fire')}
            disabled={!user || isOwner}
          >
            <Flame className={cn("h-5 w-5", pitch.user_reaction === 'fire' && "fill-current")} />
            <span className="text-sm">{(reactionCounts?.fire || 0) > 0 ? reactionCounts?.fire : ''}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-4 gap-2 text-muted-foreground hover:bg-muted/50 rounded-lg"
            disabled
          >
            <Repeat2 className="h-5 w-5" />
          </Button>

          {!isOwner && !hasPendingOrApproved ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 px-4 gap-2 text-muted-foreground hover:bg-muted/50 rounded-lg"
              onClick={() => setShowInterestDialog(true)}
              disabled={!user}
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : hasPendingOrApproved ? (
            <Button variant="ghost" size="sm" className="h-10 px-4 gap-2 text-primary rounded-lg" disabled>
              <Send className="h-5 w-5 fill-current" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="h-10 px-4 gap-2 opacity-0 pointer-events-none">
              <Send className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-4 gap-2 text-muted-foreground hover:bg-muted/50 rounded-lg"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Interest Dialog */}
      <Dialog open={showInterestDialog} onOpenChange={setShowInterestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Interest</DialogTitle>
            <DialogDescription>
              Let {pitch.profiles?.full_name || 'the creator'} know you're interested in their post.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Add a message (optional)..."
            value={interestMessage}
            onChange={(e) => setInterestMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterestDialog(false)}>Cancel</Button>
            <Button onClick={submitInterest} disabled={sendInterestMutation.isPending}>
              {sendInterestMutation.isPending ? 'Sending…' : 'Send Interest'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
