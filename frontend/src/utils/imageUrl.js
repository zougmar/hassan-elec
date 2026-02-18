// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return '';
  const trimmed = imagePath.trim().replace(/\\/g, '/');
  if (!trimmed) return '';

  // Already a full URL (e.g. Cloudinary)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Relative path: ensure leading slash (backend may return "uploads/xxx" or "/uploads/xxx")
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (typeof window !== 'undefined') {
    // Use current origin so: in dev /uploads is proxied to backend (vite.config), in prod same origin serves API & uploads
    const origin = window.location.origin.replace(/\/$/, '');
    return `${origin}${path}`;
  }

  // SSR / non-browser
  const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
  const baseUrl = apiBase.startsWith('http') ? apiBase.replace(/\/api\/?$/, '').replace(/\/$/, '') : '';
  return baseUrl ? `${baseUrl}${path}` : path;
};
