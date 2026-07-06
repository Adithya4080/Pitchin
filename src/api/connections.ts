import { apiFetch } from './client';

export interface FollowRequest {
  id: number;
  sender: number;
  sender_name: string;
  sender_avatar: string | null;
  receiver: number;
  receiver_name: string;
  receiver_avatar: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface InterestMessage {
  id: number;
  sender: number | { id: number; full_name: string; email: string; role: string };
  sender_name: string;
  receiver: number | { id: number; full_name: string; email: string; role: string };
  receiver_name: string;
  subject: string;
  message: string;
  tag: string;
  email_sent: boolean;
  created_at: string;
}

export async function sendFollowRequest(receiverId: number): Promise<FollowRequest> {
  return apiFetch<FollowRequest>('/connections/follow/', {
    method: 'POST',
    body: JSON.stringify({ receiver_id: receiverId }),
  });
}

export async function respondToFollowRequest(
  requestId: number,
  action: 'accept' | 'reject'
): Promise<FollowRequest> {
  return apiFetch<FollowRequest>(`/connections/follow/${requestId}/respond/`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  });
}

export async function unfollow(userId: number): Promise<void> {
  return apiFetch(`/connections/unfollow/${userId}/`, { method: 'DELETE' });
}

export async function getFollowRequests(): Promise<FollowRequest[]> {
  return apiFetch<FollowRequest[]>('/connections/requests/');
}

export async function getFollowers(): Promise<FollowRequest[]> {
  return apiFetch<FollowRequest[]>('/connections/followers/');
}

export async function getFollowing(): Promise<FollowRequest[]> {
  return apiFetch<FollowRequest[]>('/connections/following/');
}

export async function sendInterest(data: {
  receiver_id: number;  // ← must be receiver_id to match backend serializer
  subject: string;
  message: string;
  tag?: string;
}): Promise<InterestMessage> {
  return apiFetch<InterestMessage>('/connections/interest/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getInterestsSent(): Promise<InterestMessage[]> {
  return apiFetch<InterestMessage[]>('/connections/interest/sent/');
}

export async function getInterestsReceived(): Promise<InterestMessage[]> {
  return apiFetch<InterestMessage[]>('/connections/interest/received/');
}