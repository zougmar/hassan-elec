import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, Zap } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const lang = i18n.language || 'en';
  const text = (obj) => obj?.[lang] || obj?.en || '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchService();
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    setError('');
    try {
      const [serviceRes, listRes] = await Promise.all([
        api.get(`/services/${id}`),
        api.get('/services')
      ]);
      setService(serviceRes.data);
      const others = (Array.isArray(listRes.data) ? listRes.data : [])
        .filter((s) => s._id !== id)
        .slice(0, 3);
      setRelated(others);
    } catch (err) {
      setError(err.response?.data?.message || t('detail.notFound'));
      setService(null);
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

  if (error || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-slate-600 dark:text-slate-300 mb-6">{error || t('detail.notFound')}</p>
        <Link to="/services" className="inline-flex items-center gap-2 text-electric-600 font-semibold">
          <ArrowLeft className="w-4 h-4" />
          {t('detail.backToServices')}
        </Link>
      </div>
    );
  }

  const highlights = [
    t('detail.highlight1'),
    t('detail.highlight2'),
    t('detail.highlight3'),
    t('detail.highlight4')
  ];

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative min-h-[50svh] sm:min-h-[60svh] flex items-end overflow-hidden">
        {service.image ? (
          <img
            src={getImageUrl(service.image)}
            alt={text(service.title)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <Zap className="w-16 h-16 text-electric-400/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 pt-28">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('detail.backToServices')}
          </Link>
          <p className="text-electric-400 font-semibold tracking-[0.18em] uppercase text-xs mb-3">
            {t('nav.services')}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">
            {text(service.title)}
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
                {text(service.description)}
              </p>

              <div className="mt-10">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  {t('detail.whatsIncluded')}
                </h3>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-electric-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 h-fit">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-7">
                <p className="text-electric-500 font-semibold tracking-[0.16em] uppercase text-xs mb-3">
                  Hassan Elec
                </p>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('detail.requestThis')}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {t('detail.requestHint')}
                </p>
                <Link
                  to="/contact"
                  state={{ serviceType: text(service.title) }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-electric-500 text-slate-950 px-5 py-3.5 rounded-xl font-semibold hover:bg-electric-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t('detail.contactUs')}
                </Link>
                <Link
                  to="/services"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-xl font-medium hover:border-electric-400 transition-colors"
                >
                  {t('detail.viewAllServices')}
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
                {t('detail.relatedServices')}
              </h2>
              <Link to="/services" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600">
                {t('home.viewAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/services/${item._id}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
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
    </div>
  );
};

export default ServiceDetail;
