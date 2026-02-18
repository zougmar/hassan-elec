// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL (e.g. Cloudinary), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Relative path (e.g. /uploads/xxx)
  if (typeof window !== 'undefined' && imagePath.startsWith('/')) {
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // In local dev, uploads are served by the backend (e.g. :5000), not Vite (:5173). Use backend origin.
    const origin = isLocalDev
      ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')
      : window.location.origin.replace(/\/$/, '');
    return `${origin}${imagePath}`;
  }
  
  // SSR or non-browser: fallback
  const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
  const baseUrl = apiBase.startsWith('http') ? apiBase.replace(/\/api\/?$/, '') : '';
  return baseUrl ? `${baseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}` : imagePath;
};
