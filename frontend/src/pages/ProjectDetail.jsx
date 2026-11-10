import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import { ArrowLeft, ArrowRight, Phone, Zap, X } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);

  const lang = i18n.language || 'en';
  const text = (obj) => obj?.[lang] || obj?.en || '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    setError('');
    try {
      const [projectRes, listRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get('/projects')
      ]);
      setProject(projectRes.data);
      const others = (Array.isArray(listRes.data) ? listRes.data : [])
        .filter((p) => p._id !== id)
        .slice(0, 3);
      setRelated(others);
    } catch (err) {
      setError(err.response?.data?.message || t('detail.notFound'));
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-electric-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-slate-600 dark:text-slate-300 mb-6">{error || t('detail.notFound')}</p>
        <Link to="/projects" className="inline-flex items-center gap-2 text-electric-600 font-semibold">
          <ArrowLeft className="w-4 h-4" />
          {t('detail.backToProjects')}
        </Link>
      </div>
    );
  }

  const images = Array.isArray(project.images) ? project.images : [];
  const cover = images[0];

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative min-h-[50svh] sm:min-h-[60svh] flex items-end overflow-hidden">
        {cover ? (
          <img src={getImageUrl(cover)} alt={text(project.title)} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <Zap className="w-16 h-16 text-electric-400/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 pt-28">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('detail.backToProjects')}
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="text-electric-400 font-semibold tracking-[0.18em] uppercase text-xs">
              {t('nav.projects')}
            </p>
            {project.category && (
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-medium capitalize">
                {project.category}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">
            {text(project.title)}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-10 lg:gap-16">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {t('detail.overview')}
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {text(project.description)}
              </p>

              {images.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    {t('detail.projectGallery')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {images.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => setLightbox(index)}
                        className="aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                      >
                        <img
                          src={getImageUrl(img)}
                          alt=""
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-7">
                <p className="text-electric-500 font-semibold tracking-[0.16em] uppercase text-xs mb-3">
                  Hassan Elec
                </p>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('detail.similarProject')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {t('detail.similarHint')}
                </p>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 bg-electric-500 text-slate-950 px-5 py-3.5 rounded-xl font-semibold hover:bg-electric-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t('detail.contactUs')}
                </Link>
                <Link
                  to="/projects"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-xl font-medium hover:border-electric-400 transition-colors"
                >
                  {t('detail.viewAllProjects')}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {t('detail.relatedProjects')}
              </h2>
              <Link to="/projects" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600">
                {t('home.viewGallery')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/projects/${item._id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {item.images?.[0] ? (
                      <img
                        src={getImageUrl(item.images[0])}
                        alt={text(item.title)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{text(item.title)}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{text(item.description)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox !== null && images[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={getImageUrl(images[lightbox])}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
