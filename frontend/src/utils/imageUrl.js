// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, construct the full URL (same origin in prod, localhost in dev)
  const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
  const baseUrl = apiBase.startsWith('http') ? apiBase.replace(/\/api\/?$/, '') : window.location.origin;
  
  return `${baseUrl}${imagePath}`;
};
