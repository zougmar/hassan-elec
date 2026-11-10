function getUploadsOrigin() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    // Dev: Vite proxies /uploads → backend. Prod (same project): same origin.
    return window.location.origin.replace(/\/$/, '');
  }
  return '';
}

// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return '';
  const trimmed = imagePath.trim().replace(/\\/g, '/');
  if (!trimmed) return '';

  // Already a full URL (e.g. Cloudinary / Blob)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Relative path: ensure leading slash (backend may return "uploads/xxx" or "/uploads/xxx")
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const origin = getUploadsOrigin();
  return origin ? `${origin}${path}` : path;
};
