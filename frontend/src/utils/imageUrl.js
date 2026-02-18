// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Relative path (e.g. /uploads/xxx): always use current origin so preview and production
  // each load images from their own deployment (avoids CORS and wrong origin).
  if (typeof window !== 'undefined' && imagePath.startsWith('/')) {
    const origin = window.location.origin.replace(/\/$/, '');
    return `${origin}${imagePath}`;
  }
  
  // SSR or non-browser: fallback
  const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
  const baseUrl = apiBase.startsWith('http') ? apiBase.replace(/\/api\/?$/, '') : '';
  return baseUrl ? `${baseUrl.replace(/\/$/, '')}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}` : imagePath;
};
