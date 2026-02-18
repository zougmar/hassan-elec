import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminProjects = () => {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
    category: 'general',
    images: []
  });
  const [previews, setPreviews] = useState([]);

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

  const handleChange = (e, lang = null) => {
    if (lang) {
      setFormData({
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          [lang]: e.target.value
        }
      });
    } else if (e.target.name === 'images') {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, images: files });
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', JSON.stringify(formData.title));
      data.append('description', JSON.stringify(formData.description));
      data.append('category', formData.category);
      
      if (formData.images.length > 0) {
        formData.images.forEach(image => {
          data.append('images', image);
        });
      }

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('admin.saved'));
      } else {
        await api.post('/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('admin.saved'));
      }

      setShowModal(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(t('admin.error'));
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category || 'general',
      images: []
    });
    setPreviews(project.images?.map(img => getImageUrl(img)) || []);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success(t('admin.deleted'));
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(t('admin.error'));
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', fr: '', ar: '' },
      description: { en: '', fr: '', ar: '' },
      category: 'general',
      images: []
    });
    setPreviews([]);
    setEditingProject(null);
  };

  const languages = ['en', 'fr', 'ar'];

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.projects')}</h1>
          <p className="text-slate-500 mt-1">Manage your completed projects</p>
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
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              {project.images && project.images.length > 0 && (
                <img
                  src={getImageUrl(project.images[0])}
                  alt="Project"
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {project.title?.[i18n.language] || project.title?.en}
                </h3>
                <p className="text-slate-500 text-sm mb-2 line-clamp-2">
                  {project.description?.[i18n.language] || project.description?.en}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  {project.images?.length || 0} {t('admin.images')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{t('admin.edit')}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
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
            {t('admin.add')} {t('admin.projects')}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProject ? t('admin.edit') : t('admin.add')} {t('admin.projects')}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {languages.map((lang) => (
                  <div key={lang} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <h3 className="font-semibold text-slate-700 mb-3 uppercase text-sm tracking-wide">{lang}</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {t('admin.title')} ({lang})
                        </label>
                        <input
                          type="text"
                          value={formData.title[lang] || ''}
                          onChange={(e) => handleChange(e, lang)}
                          name="title"
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {t('admin.description')} ({lang})
                        </label>
                        <textarea
                          value={formData.description[lang] || ''}
                          onChange={(e) => handleChange(e, lang)}
                          name="description"
                          required
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('admin.category')}
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('admin.images')}
                  </label>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {previews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded-xl border border-slate-200"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary-700 hover:bg-primary-600 transition-colors"
                  >
                    {t('admin.save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    {t('admin.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
