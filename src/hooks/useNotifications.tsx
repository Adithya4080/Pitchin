import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  getNotifications,
  getUnreadCount,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  Notification,
} from '@/api/notifications';

export type { Notification };
export interface NotificationWithActor extends Notification {
  actor: { full_name: string | null; avatar_url: string | null } | null;
  type: string;
  actor_id: number;
}

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<NotificationWithActor[]> => {
      if (!user) return [];
      const notifs = await getNotifications();
      return notifs.map((n) => ({
        ...n,
        type: n.notif_type,
        actor_id: n.sender, 
        actor: n.sender_name
          ? { full_name: n.sender_name, avatar_url: n.sender_avatar }
          : null,
      }));
    },
    enabled: !!user,
    refetchInterval: 30_000,
  });
}

export function useUnreadCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['unread-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const data = await getUnreadCount();
      return data.unread_count;
    },
    enabled: !!user,
    refetchInterval: 30_000,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiMarkAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiMarkAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });
}
