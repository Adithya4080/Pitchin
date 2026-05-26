const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export const getMediaUrl = (path?: string | null) => {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};