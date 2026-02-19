import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/imageUrl';
import toast from 'react-hot-toast';
import { ImageUploadSingle } from '../ui/ImageUpload';

const AdminProfile = () => {
  const { t } = useTranslation();
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', photo: null, photoUrl: '' });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        photo: null,
        photoUrl: user.photo && (user.photo.startsWith('http') ? user.photo : '') ? user.photo : ''
      });
      setPreview(user.photo ? getImageUrl(user.photo) : null);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      const photoUrlTrim = formData.photoUrl?.trim();
      if (photoUrlTrim && (photoUrlTrim.startsWith('http://') || photoUrlTrim.startsWith('https://'))) {
        data.append('photoUrl', photoUrlTrim);
      }
      if (formData.photo) {
        data.append('photo', formData.photo);
      }
      const res = await api.put('/profile', data);
      if (res.data?.user) {
        await fetchUser();
        setPreview(res.data.user.photo ? getImageUrl(res.data.user.photo) : null);
        toast.success(t('admin.saved'));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || t('admin.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.profile')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Update your name and profile photo</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{t('admin.name')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={user?.email}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          />
        </div>

        <div>
          <ImageUploadSingle
            label={t('admin.profilePhoto')}
            value={formData.photo}
            onChange={(file) => {
              setFormData({ ...formData, photo: file, photoUrl: '' });
              setPreview(file ? null : (user?.photo ? getImageUrl(user.photo) : null));
            }}
            previewUrl={formData.photo ? null : (preview || formData.photoUrl?.trim() || (user?.photo ? getImageUrl(user.photo) : null))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">{t('admin.imageUrl')}</label>
          <input
            type="url"
            value={formData.photoUrl}
            onChange={(e) => {
              setFormData({ ...formData, photoUrl: e.target.value });
              setPreview(e.target.value?.trim() || (user?.photo ? getImageUrl(user.photo) : null));
            }}
            placeholder="https://example.com/photo.jpg"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500/30 disabled:opacity-50"
          >
            {saving ? '...' : t('admin.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
