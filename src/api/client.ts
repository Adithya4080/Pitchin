/**
 * Django REST API Client for PitchIn
 * Replaces all Supabase calls with Django backend API calls
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api' ;

// ─── Token Management ──────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// ─── Core Fetch Helper ────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) return apiFetch<T>(path, options, false);
    clearTokens();
    window.dispatchEvent(new CustomEvent('auth:logout'));
    throw new Error('Session expired. Please sign in again.');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body?.detail || body?.error || JSON.stringify(body) || message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}
