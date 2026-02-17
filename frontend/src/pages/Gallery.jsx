import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import { X, ZoomIn, ImageIcon } from 'lucide-react';

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const allImages = (Array.isArray(projects) ? projects : []).flatMap(project =>
    project.images?.map(img => ({
      url: img,
      projectTitle: project.title?.[i18n.language] || project.title?.en
    })) || []
  );

  const openLightbox = (url, index) => {
    setSelectedImage(url);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(allImages[selectedIndex - 1].url);
    }
  };

  const goToNext = (e) => {
    e.stopPropagation();
    if (selectedIndex < allImages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(allImages[selectedIndex + 1].url);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700/50 animate-pulse"
              />
            ))}
          </div>
        ) : allImages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allImages.map((item, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/60 dark:border-slate-700/50"
                  onClick={() => openLightbox(item.url, index)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(item.url)}
                      alt={item.projectTitle || 'Gallery'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 text-white">
                      <ZoomIn className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.projectTitle}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <ZoomIn className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
              <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
                onClick={closeLightbox}
                role="dialog"
                aria-modal="true"
              >
                <div
                  className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Navigation - Previous */}
                  {selectedIndex > 0 && (
                    <button
                      onClick={goToPrev}
                      className="absolute left-0 -translate-x-full md:left-4 md:translate-x-0 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                      aria-label="Previous image"
                    >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    </button>
                  )}

                  {/* Image */}
                  <img
                    src={getImageUrl(selectedImage)}
                    alt="Gallery"
                    className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  />

                  {/* Navigation - Next */}
                  {selectedIndex < allImages.length - 1 && (
                    <button
                      onClick={goToNext}
                      className="absolute right-0 translate-x-full md:right-4 md:translate-x-0 z-10 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                      aria-label="Next image"
                    >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    </button>
                  )}

                  {/* Close button */}
                  <button
                    onClick={closeLightbox}
                    className="absolute -top-12 right-0 md:top-4 md:right-4 w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-800 dark:text-white shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm font-medium">
                    {selectedIndex + 1} / {allImages.length}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              {t('gallery.noImages')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
              Add projects with images in the admin dashboard to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
