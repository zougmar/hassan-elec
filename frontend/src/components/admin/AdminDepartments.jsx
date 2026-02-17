import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminDepartments = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ dept_name: '', dept_contact: '', dept_email: '', organization: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptsRes, orgsRes] = await Promise.all([api.get('/departments'), api.get('/organizations')]);
      setDepartments(deptsRes.data);
      setOrganizations(orgsRes.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || t('admin.error');
      toast.error(msg);
      setDepartments([]);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/departments/${editing._id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      toast.success(t('admin.saved'));
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success(t('admin.deleted'));
      fetchData();
    } catch (err) {
      toast.error(t('admin.error'));
    }
  };

  const resetForm = () => {
    setFormData({ dept_name: '', dept_contact: '', dept_email: '', organization: '' });
    setEditing(null);
  };

  const filtered = departments.filter(d =>
    d.dept_name?.toLowerCase().includes(search.toLowerCase()) ||
    d.organization?.org_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.departments')}</h1>
          <p className="text-slate-500 mt-1">Manage departments</p>
        </div>
        <button
          onClick={() => { resetForm(); setFormData({ ...formData, organization: organizations[0]?._id }); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-primary-700 hover:bg-primary-600"
        >
          <Plus className="w-5 h-5" />
          {t('admin.addDepartment')}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('admin.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 rounded-xl border-2 border-primary-200 border-t-primary-600 animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.name')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.email')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.contact')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.organization')}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((dept) => (
                <tr key={dept._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{dept.dept_name}</td>
                  <td className="px-6 py-4 text-slate-600">{dept.dept_email}</td>
                  <td className="px-6 py-4 text-slate-600">{dept.dept_contact}</td>
                  <td className="px-6 py-4 text-slate-600">{dept.organization?.org_name}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditing(dept); setFormData({ dept_name: dept.dept_name, dept_contact: dept.dept_contact, dept_email: dept.dept_email, organization: dept.organization?._id }); setShowModal(true); }} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 mr-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(dept._id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center text-slate-500">{t('admin.noData')}</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editing ? t('admin.edit') : t('admin.add')} {t('admin.departments')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.name')}</label>
                <input required value={formData.dept_name} onChange={e => setFormData({ ...formData, dept_name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.organization')}</label>
                <select required value={formData.organization} onChange={e => setFormData({ ...formData, organization: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200">
                  <option value="">Select</option>
                  {organizations.map(org => <option key={org._id} value={org._id}>{org.org_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.email')}</label>
                <input type="email" value={formData.dept_email} onChange={e => setFormData({ ...formData, dept_email: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.contact')}</label>
                <input value={formData.dept_contact} onChange={e => setFormData({ ...formData, dept_contact: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary-700">{t('admin.save')}</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100">{t('admin.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
