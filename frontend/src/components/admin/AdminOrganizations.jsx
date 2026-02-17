import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X, Building2 } from 'lucide-react';

const AdminOrganizations = () => {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ org_name: '', org_address: '', org_email: '', org_contact: '' });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchOrgs(); }, []);

  const fetchOrgs = async () => {
    try {
      const res = await api.get('/organizations');
      setOrganizations(res.data);
    } catch (err) {
      toast.error(t('admin.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/organizations/${editing._id}`, formData);
      } else {
        await api.post('/organizations', formData);
      }
      toast.success(t('admin.saved'));
      setShowModal(false);
      resetForm();
      fetchOrgs();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const resetForm = () => {
    setFormData({ org_name: '', org_address: '', org_email: '', org_contact: '' });
    setEditing(null);
  };

  const filtered = organizations.filter(o =>
    o.org_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.org_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.organizations')}</h1>
          <p className="text-slate-500 mt-1">Manage organizations</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-primary-700 hover:bg-primary-600"
        >
          <Plus className="w-5 h-5" />
          {t('admin.addOrganization')}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('admin.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-xl border-2 border-primary-200 border-t-primary-600 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.name')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.email')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.address')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.contact')}</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{org.org_name}</td>
                    <td className="px-6 py-4 text-slate-600">{org.org_email}</td>
                    <td className="px-6 py-4 text-slate-600">{org.org_address}</td>
                    <td className="px-6 py-4 text-slate-600">{org.org_contact}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditing(org); setFormData(org); setShowModal(true); }} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 mr-2">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center text-slate-500">
          {t('admin.noData')}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editing ? t('admin.edit') : t('admin.add')} {t('admin.organizations')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.name')}</label>
                <input required value={formData.org_name} onChange={e => setFormData({ ...formData, org_name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.email')}</label>
                <input type="email" value={formData.org_email} onChange={e => setFormData({ ...formData, org_email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.address')}</label>
                <input value={formData.org_address} onChange={e => setFormData({ ...formData, org_address: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.contact')}</label>
                <input value={formData.org_contact} onChange={e => setFormData({ ...formData, org_contact: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary-700 hover:bg-primary-600">{t('admin.save')}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100">{t('admin.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrganizations;
