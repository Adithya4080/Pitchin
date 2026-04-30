import { apiFetch, setTokens, clearTokens } from './client';

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  is_profile_complete?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  access: string;
  refresh: string;
}

export async function register(params: {
  email: string;
  password: string;
  password2: string;
  full_name: string;
}): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  setTokens(data.access, data.refresh);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.access, data.refresh);
  return data;
}

export async function logout(refreshToken: string): Promise<void> {
  try {
    await apiFetch('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } finally {
    clearTokens();
  }
}

export async function getMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>('/auth/me/');
}

export async function updateMe(data: Partial<AuthUser>): Promise<AuthUser> {
  return apiFetch<AuthUser>('/auth/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  return apiFetch('/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
}