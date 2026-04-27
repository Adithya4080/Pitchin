import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Bookmark, Flame, MessageSquare, Check, CheckCheck, X, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export function NotificationList() {
  const navigate = useNavigate();
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: pendingContactRequests = [] } = useIncomingContactRequests();
  const { data: pendingFollowRequests = [] } = useIncomingFollowRequests();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const respondToContactRequest = useRespondToContactRequest();
  const respondToFollowRequest = useRespondToFollowRequest();

  const unreadNotifications = notifications.filter(n => !n.is_read);

  // Create maps for quick lookup
  const pendingContactRequestMap = new Map(
    pendingContactRequests.map(req => [req.requester_id, req])
  );
  const pendingFollowRequestMap = new Map(
    pendingFollowRequests.map(req => [req.sender, req])
  );

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-muted-foreground text-sm">No notifications yet</p>
      </div>
    );
  }

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
    <div>
      <div className="flex items-center justify-between p-3 border-b">
        <h4 className="font-semibold text-sm">Notifications</h4>
        {unreadNotifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => markAllAsRead.mutate()}
          >
            <CheckCheck className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="divide-y">
          {notifications.map((notification) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
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
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors",
                  !notification.is_read && "bg-primary/5",
                  (isContactApproved || isFollowApproved || (!isContactRequest && !isFollowRequest)) && "cursor-pointer"
                )}
                onClick={handleNotificationClick}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={notification.actor?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {actorInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>

                  {/* Show accept/decline buttons for pending contact requests */}
                  {hasPendingContactRequest && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptContact(notification);
                        }}
                        disabled={respondToContactRequest.isPending}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeclineContact(notification);
                        }}
                        disabled={respondToContactRequest.isPending}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {/* Show accept/decline buttons for pending follow requests */}
                  {hasPendingFollowRequest && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptFollow(notification);
                        }}
                        disabled={respondToFollowRequest.isPending}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeclineFollow(notification);
                        }}
                        disabled={respondToFollowRequest.isPending}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  )}
                </div>

                <Icon className={cn(
                  "h-4 w-4 flex-shrink-0 mt-0.5",
                  !notification.is_read ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
