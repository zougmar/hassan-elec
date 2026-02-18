import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Contact = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    serviceType: '',
    message: '',
    image: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setServices([]);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && formData[key]) {
          data.append(key, formData[key]);
        }
      });
      if (formData.image) {
        data.append('image', formData.image);
      }

      await api.post('/requests', data);

      toast.success(t('contact.success'));
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        serviceType: '',
        message: '',
        image: null
      });
      setPreview(null);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (obj, lang) => {
    return obj?.[lang] || obj?.en || '';
  };

  const currentLang = localStorage.getItem('i18nextLng') || 'en';

  return (
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-slate-800/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary-800 dark:text-white">{t('contact.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">{t('contact.subtitle')}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 md:p-8 border border-gray-100 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('contact.name')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:border-electric-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('contact.phone')} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:border-electric-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('contact.email')} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:border-electric-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('contact.address')} *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:border-electric-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('contact.serviceType')} *
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:border-electric-500"
              >
                <option value="">{t('common.select')}</option>
                {services.map((service) => (
                  <option key={service._id} value={getLocalizedText(service.title, currentLang)}>
                    {getLocalizedText(service.title, currentLang)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('contact.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:border-electric-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('contact.image')}
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-electric-500 focus:border-electric-500"
              />
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-w-xs h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-800 text-white py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? t('contact.submitting') : t('contact.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
