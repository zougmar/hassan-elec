import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminEmployees = () => {
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    emp_name: { en: '', fr: '', ar: '' },
    emp_email: '',
    emp_contact: '',
    emp_dob: '',
    department: '',
    manager: '',
    password: ''
  });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [empRes, deptRes, mngRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
        api.get('/managers')
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setManagers(mngRes.data);
    } catch (err) {
      toast.error(t('admin.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, lang = null) => {
    if (lang) {
      setFormData({ ...formData, emp_name: { ...formData.emp_name, [lang]: e.target.value } });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { emp_name: formData.emp_name, emp_email: formData.emp_email, emp_contact: formData.emp_contact, emp_dob: formData.emp_dob || undefined, department: formData.department, manager: formData.manager };
      if (formData.password) payload.password = formData.password;
      if (editing) await api.put(`/employees/${editing._id}`, payload);
      else await api.post('/employees', payload);
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
      await api.delete(`/employees/${id}`);
      toast.success(t('admin.deleted'));
      fetchData();
    } catch (err) {
      toast.error(t('admin.error'));
    }
  };

  const resetForm = () => {
    setFormData({ emp_name: { en: '', fr: '', ar: '' }, emp_email: '', emp_contact: '', emp_dob: '', department: '', manager: '', password: '' });
    setEditing(null);
  };

  const getName = (emp) => typeof emp?.emp_name === 'object' ? (emp.emp_name?.[i18n.language] || emp.emp_name?.en) : emp?.emp_name;
  const filtered = employees.filter(emp => getName(emp)?.toLowerCase().includes(search.toLowerCase()) || emp.emp_email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.employees')}</h1>
          <p className="text-slate-500 mt-1">Manage employees</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-primary-700 hover:bg-primary-600">
          <Plus className="w-5 h-5" />
          {t('admin.addEmployee')}
        </button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder={t('admin.search')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64 px-4 py-2 rounded-xl border border-slate-200" />
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 rounded-xl border-2 border-primary-200 border-t-primary-600 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.name')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.email')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.department')}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.manager')}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{getName(emp)}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.emp_email}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.department?.dept_name}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.manager?.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditing(emp); setFormData({ emp_name: emp.emp_name || { en: '', fr: '', ar: '' }, emp_email: emp.emp_email, emp_contact: emp.emp_contact || '', emp_dob: emp.emp_dob ? emp.emp_dob.split('T')[0] : '', department: emp.department?._id, manager: emp.manager?._id, password: '' }); setShowModal(true); }} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 mr-2"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(emp._id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editing ? t('admin.edit') : t('admin.add')} {t('admin.employees')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['en', 'fr', 'ar'].map(lang => (
                <div key={lang}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.name')} ({lang})</label>
                  <input required value={formData.emp_name[lang] || ''} onChange={(e) => handleChange(e, lang)} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                </div>
              ))}
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.email')}</label><input required type="email" name="emp_email" value={formData.emp_email} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.phone')}</label><input name="emp_contact" value={formData.emp_contact} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">DOB</label><input type="date" name="emp_dob" value={formData.emp_dob} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.department')}</label><select required name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200"><option value="">Select</option>{departments.map(d => <option key={d._id} value={d._id}>{d.dept_name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.manager')}</label><select required name="manager" value={formData.manager} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200"><option value="">Select</option>{managers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.password')}</label><input type="password" name="password" placeholder={editing ? 'Leave blank to keep' : 'Auto-generated if empty'} value={formData.password} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200" /></div>
              <div className="flex gap-3 pt-2"><button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary-700">{t('admin.save')}</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100">{t('admin.cancel')}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
