import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (obj, lang) => {
    return obj?.[lang] || obj?.en || '';
  };

  const currentLang = localStorage.getItem('i18nextLng') || 'en';

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary-800 dark:text-white">{t('services.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">{t('services.subtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {service.image && (
                  <img
                    src={getImageUrl(service.image)}
                    alt={getLocalizedText(service.title, currentLang)}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">
                    {getLocalizedText(service.title, currentLang)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {getLocalizedText(service.description, currentLang)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('services.noServices')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
