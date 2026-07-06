// Media files (avatars, uploads) are served from the Django domain root
// via MEDIA_URL, not under /api — so we derive the media base by
// stripping a trailing "/api" from the API base URL rather than reading
// a separate (previously misnamed, and never actually set) env var.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://api.pichin.in/api"
).replace(/\/api\/?$/, "");

export const getMediaUrl = (
  path?: string | null
) => {

  if (!path) return "";

  // Already full backend URL
  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  // Relative media path — ensure exactly one slash between base and path,
  // since stored paths (e.g. "avatars/logo.png") don't have a leading
  // slash, and naive concatenation produced URLs like
  // "http://127.0.0.1:8000avatars/logo.png".
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};