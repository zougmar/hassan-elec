import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import { Clock, ShieldCheck, BadgeDollarSign, Wrench } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes] = await Promise.all([
        api.get('/services'),
        api.get('/projects')
      ]);
      setServices(servicesRes.data.slice(0, 3));
      setProjects(projectsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (obj, lang) => {
    return obj?.[lang] || obj?.en || '';
  };

  const currentLang = localStorage.getItem('i18nextLng') || 'en';

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-200">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-electric-500 text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-electric-600 transition-colors shadow-lg"
              >
                {t('home.getStarted')}
              </Link>
              <Link
                to="/services"
                className="bg-transparent border-2 border-electric-500 text-electric-500 px-8 py-3 rounded-lg font-semibold hover:bg-electric-500 hover:text-primary-900 transition-colors"
              >
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('home.whyChooseUs')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home.whyChooseUsSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/60 dark:border-slate-700/50 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-[100px] dark:bg-amber-400/10" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t('home.why1')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('home.why1Desc')}
                </p>
              </div>
            </div>
            <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/60 dark:border-slate-700/50 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-[100px] dark:bg-emerald-400/10" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t('home.why2')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('home.why2Desc')}
                </p>
              </div>
            </div>
            <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/60 dark:border-slate-700/50 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-[100px] dark:bg-blue-400/10" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BadgeDollarSign className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t('home.why3')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('home.why3Desc')}
                </p>
              </div>
            </div>
            <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/60 dark:border-slate-700/50 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-bl-[100px] dark:bg-violet-400/10" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-7 h-7 text-violet-600 dark:text-violet-400" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t('home.why4')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('home.why4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-800 dark:text-white">{t('home.ourServices')}</h2>
            <p className="text-gray-600 dark:text-slate-300">{t('services.subtitle')}</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {services.map((service) => (
                <div key={service._id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {service.image && (
                    <img
                      src={getImageUrl(service.image)}
                      alt={getLocalizedText(service.title, currentLang)}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {getLocalizedText(service.title, currentLang)}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {getLocalizedText(service.description, currentLang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('services.noServices')}</p>
          )}

          <div className="text-center">
            <Link
              to="/services"
              className="inline-block bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors shadow-md"
            >
              {t('home.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-800 dark:text-white">{t('home.recentProjects')}</h2>
            <p className="text-gray-600 dark:text-slate-300">{t('projects.subtitle')}</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {projects.map((project) => (
                <div key={project._id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {project.images && project.images.length > 0 && (
                    <img
                      src={getImageUrl(project.images[0])}
                      alt={getLocalizedText(project.title, currentLang)}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {getLocalizedText(project.title, currentLang)}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {getLocalizedText(project.description, currentLang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('projects.noProjects')}</p>
          )}

          <div className="text-center">
            <Link
              to="/projects"
              className="inline-block bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors shadow-md"
            >
              {t('home.viewGallery')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
