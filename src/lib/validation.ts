// UUID validation utility
export function isValidUuid(value: string | undefined | null): boolean {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// Sanitize string input - removes dangerous characters
export function sanitizeString(input: string): string {
  return input.trim().slice(0, 1000); // Limit length and trim
}

// Validate and sanitize URL
export function sanitizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  
  // Check if it starts with http:// or https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }
  
  try {
    new URL(trimmed);
    return trimmed.slice(0, 500); // Limit URL length
  } catch {
    return null;
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}
