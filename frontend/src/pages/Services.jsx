import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import { Zap } from 'lucide-react';

const Services = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (obj, lang) => obj?.[lang] || obj?.en || '';
  const currentLang = i18n.language || 'en';

  return (
    <div className="min-h-screen py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 dark:text-white">
            {t('services.title')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-1">
            {t('services.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-500 mx-auto" />
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service) => (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl border border-slate-200/60 dark:border-slate-700 transition-all duration-300 sm:hover:-translate-y-1 block"
              >
                <div className="relative aspect-[16/11] sm:aspect-[4/3] bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  {service.image ? (
                    <img
                      src={getImageUrl(service.image)}
                      alt={getLocalizedText(service.title, currentLang)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Zap className="w-10 h-10 opacity-40" />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {getLocalizedText(service.title, currentLang)}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-4">
                    {getLocalizedText(service.description, currentLang)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-slate-500 text-base sm:text-lg">{t('services.noServices')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
