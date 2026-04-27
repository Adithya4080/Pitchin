import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Bookmark, Flame, MessageSquare, Check, CheckCheck, X, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';
import { useIncomingContactRequests, useRespondToContactRequest } from '@/hooks/useContactRequests';
import { useIncomingFollowRequests, useRespondToFollowRequest } from '@/hooks/useFollow';
import { cn } from '@/lib/utils';

const NOTIFICATION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  save: Bookmark,
  reaction: Flame,
  contact_request: MessageSquare,
  contact_approved: UserCheck,
  follow_request: UserPlus,
  follow_approved: UserCheck,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  save: 'bg-blue-500/10 text-blue-500',
  reaction: 'bg-orange-500/10 text-orange-500',
  contact_request: 'bg-purple-500/10 text-purple-500',
  contact_approved: 'bg-green-500/10 text-green-500',
  follow_request: 'bg-pink-500/10 text-pink-500',
  follow_approved: 'bg-green-500/10 text-green-500',
};

export function MobileNotificationsPage() {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: pendingContactRequests = [] } = useIncomingContactRequests();
  const { data: pendingFollowRequests = [] } = useIncomingFollowRequests();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const respondToContactRequest = useRespondToContactRequest();
  const respondToFollowRequest = useRespondToFollowRequest();

  const unreadNotifications = notifications.filter(n => !n.is_read);

  const pendingContactRequestMap = new Map(
    pendingContactRequests.map(req => [req.requester_id, req])
  );
  const pendingFollowRequestMap = new Map(
    pendingFollowRequests.map(req => [req.receiver, req])
  );

  const handleAcceptContact = (notification: any) => {
    const request = pendingContactRequestMap.get(notification.actor_id);
    if (request) {
      respondToContactRequest.mutate({
        requestId: request.id,
        approved: true,
        requesterId: notification.actor_id,
      });
      markAsRead.mutate(notification.id);
    }
  };

  const handleDeclineContact = (notification: any) => {
    const request = pendingContactRequestMap.get(notification.actor_id);
    if (request) {
      respondToContactRequest.mutate({
        requestId: request.id,
        approved: false,
        requesterId: notification.actor_id,
      });
      markAsRead.mutate(notification.id);
    }
  };

  const handleAcceptFollow = (notification: any) => {
    const request = pendingFollowRequestMap.get(notification.actor_id);
    if (request) {
      respondToFollowRequest.mutate({
        followId: request.id,
        approved: true,
        followerId: notification.actor_id,
      });
      markAsRead.mutate(notification.id);
    }
  };

  const handleDeclineFollow = (notification: any) => {
    const request = pendingFollowRequestMap.get(notification.actor_id);
    if (request) {
      respondToFollowRequest.mutate({
        followId: request.id,
        approved: false,
        followerId: notification.actor_id,
      });
      markAsRead.mutate(notification.id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Mark All Read */}
      <div className="sticky top-0 z-40 bg-card backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-foreground">Activity</span>
            {unreadNotifications.length > 0 && (
              <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {unreadNotifications.length}
              </span>
            )}
          </div>
          {unreadNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-primary"
              onClick={() => markAllAsRead.mutate()}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="divide-y divide-border/50">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-4"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 px-6"
        >
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Bell className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
            No activity yet
          </h3>
          <p className="text-muted-foreground text-sm text-center max-w-xs">
            When someone interacts with your pitches, you'll see it here
          </p>
        </motion.div>
      ) : (
        <div className="divide-y divide-border/50 bg-card">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, index) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
              const iconColors = NOTIFICATION_COLORS[notification.type] || 'bg-muted text-muted-foreground';
              const actorInitials = notification.actor?.full_name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase() || '?';

              const isContactRequest = notification.type === 'contact_request';
              const isContactApproved = notification.type === 'contact_approved';
              const isFollowRequest = notification.type === 'follow_request';
              const isFollowApproved = notification.type === 'follow_approved';
              const hasPendingContactRequest = isContactRequest && pendingContactRequestMap.has(notification.actor_id);
              const hasPendingFollowRequest = isFollowRequest && pendingFollowRequestMap.has(notification.actor_id);

              const handleNotificationClick = () => {
                if ((isContactApproved || isFollowApproved) && notification.actor_id) {
                  navigate(`/profile/${notification.actor_id}`);
                  markAsRead.mutate(notification.id);
                } else if (!notification.is_read && !isContactRequest && !isFollowRequest) {
                  markAsRead.mutate(notification.id);
                }
              };

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "flex items-start gap-3 p-4 transition-colors active:bg-muted/50",
                    !notification.is_read && "bg-primary/5",
                    (isContactApproved || isFollowApproved || (!isContactRequest && !isFollowRequest)) && "cursor-pointer"
                  )}
                  onClick={handleNotificationClick}
                >
                  {/* Avatar with icon overlay */}
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={notification.actor?.avatar_url || undefined} />
                      <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                        {actorInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center",
                      iconColors
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>

                    {/* Accept/Decline for contact requests */}
                    {hasPendingContactRequest && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="h-8 flex-1 text-xs rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptContact(notification);
                          }}
                          disabled={respondToContactRequest.isPending}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 flex-1 text-xs rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclineContact(notification);
                          }}
                          disabled={respondToContactRequest.isPending}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}

                    {/* Accept/Decline for follow requests */}
                    {hasPendingFollowRequest && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="h-8 flex-1 text-xs rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptFollow(notification);
                          }}
                          disabled={respondToFollowRequest.isPending}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 flex-1 text-xs rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclineFollow(notification);
                          }}
                          disabled={respondToFollowRequest.isPending}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
