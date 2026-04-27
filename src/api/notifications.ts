import { apiFetch } from './client';

export interface Notification {
  id: number;
  recipient: number;
  sender: number | null;
  sender_name: string | null;
  sender_avatar: string | null;
  notif_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications(): Promise<Notification[]> {
  return apiFetch<Notification[]>('/notifications/');
}

export async function getUnreadCount(): Promise<{ unread_count: number }> {
  return apiFetch('/notifications/unread-count/');
}

export async function markAsRead(notifId: number): Promise<void> {
  return apiFetch(`/notifications/${notifId}/read/`, { method: 'POST' });
}

export async function markAllAsRead(): Promise<void> {
  return apiFetch('/notifications/mark-all-read/', { method: 'POST' });
}
