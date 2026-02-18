import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { ImageUploadSingle } from '../ui/ImageUpload';

const AdminServices = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
    order: 0,
    image: null
  });
  const [preview, setPreview] = useState(null);

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

  const handleChange = (e, lang = null) => {
    if (lang) {
      setFormData({
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          [lang]: e.target.value
        }
      });
    } else if (e.target.name !== 'image') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', JSON.stringify(formData.title));
      data.append('description', JSON.stringify(formData.description));
      data.append('order', formData.order);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingService) {
        await api.put(`/services/${editingService._id}`, data);
        toast.success(t('admin.saved'));
      } else {
        await api.post('/services', data);
        toast.success(t('admin.saved'));
      }

      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      const message = error.response?.data?.message || error.message || t('admin.error');
      toast.error(message);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      order: service.order || 0,
      image: null
    });
    setPreview(service.image ? getImageUrl(service.image) : null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;

    try {
      await api.delete(`/services/${id}`);
      toast.success(t('admin.deleted'));
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(t('admin.error'));
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', fr: '', ar: '' },
      description: { en: '', fr: '', ar: '' },
      order: 0,
      image: null
    });
    setPreview(null);
    setEditingService(null);
  };

  const languages = ['en', 'fr', 'ar'];

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.services')}</h1>
          <p className="text-slate-500 mt-1">Manage your service offerings</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-primary-700 hover:bg-primary-600 transition-colors shadow-lg shadow-primary-900/20"
        >
          <Plus className="w-5 h-5" />
          <span>{t('admin.add')}</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-xl border-2 border-primary-200 border-t-primary-600 animate-spin" />
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
              <div className="aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
                {service.image ? (
                  <img src={getImageUrl(service.image)} alt="Service" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400"><span className="text-4xl">📷</span></div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {service.title?.[i18n.language] || service.title?.en}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                  {service.description?.[i18n.language] || service.description?.en}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(service)} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>{t('admin.edit')}</span>
                  </button>
                  <button onClick={() => handleDelete(service._id)} className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    <span>{t('admin.delete')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 border-dashed p-16 text-center">
          <p className="text-slate-500">{t('admin.noData')}</p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            {t('admin.add')} {t('admin.services')}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingService ? t('admin.edit') : t('admin.add')} {t('admin.services')}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {languages.map((lang) => (
                <div key={lang} className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-4">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 uppercase text-xs tracking-wider">{lang}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('admin.title')}</label>
                      <input
                        type="text"
                        value={formData.title[lang] || ''}
                        onChange={(e) => handleChange(e, lang)}
                        name="title"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t('admin.description')}</label>
                      <textarea
                        value={formData.description[lang] || ''}
                        onChange={(e) => handleChange(e, lang)}
                        name="description"
                        required
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <ImageUploadSingle
                  label={t('admin.image')}
                  value={formData.image}
                  onChange={(file) => setFormData({ ...formData, image: file })}
                  previewUrl={editingService?.image ? getImageUrl(editingService.image) : null}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min={0}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500/30 transition-colors"
                >
                  {t('admin.save')}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
