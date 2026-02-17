import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
          <h1 className="text-4xl font-bold mb-4 text-primary-800 dark:text-white">{t('projects.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">{t('projects.subtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {project.images && project.images.length > 0 && (
                  <img
                    src={getImageUrl(project.images[0])}
                    alt={getLocalizedText(project.title, currentLang)}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">
                    {getLocalizedText(project.title, currentLang)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {getLocalizedText(project.description, currentLang)}
                  </p>
                  {project.images && project.images.length > 1 && (
                    <p className="text-sm text-electric-600">
                      {project.images.length} {t('admin.images')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('projects.noProjects')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
