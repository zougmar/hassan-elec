import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const AdminTasks = () => {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
    status: 'pending',
    dueDate: '',
    employee: '',
    manager: ''
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const [taskRes, empRes, mngRes] = await Promise.all([
        api.get(`/tasks${params}`),
        api.get('/employees'),
        api.get('/managers')
      ]);
      setTasks(taskRes.data);
      setEmployees(empRes.data);
      setManagers(mngRes.data);
    } catch (err) {
      toast.error(t('admin.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, lang, field = 'title') => {
    if (lang !== undefined && lang !== null) {
      setFormData({ ...formData, [field]: { ...formData[field], [lang]: e.target.value } });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate,
        employee: formData.employee,
        manager: formData.manager
      };
      if (editing) {
        await api.put(`/tasks/${editing._id}`, payload);
      } else {
        await api.post('/tasks', payload);
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
      await api.delete(`/tasks/${id}`);
      toast.success(t('admin.deleted'));
      fetchData();
    } catch (err) {
      toast.error(t('admin.error'));
    }
  };

  const resetForm = () => {
    setFormData({ title: { en: '', fr: '', ar: '' }, description: { en: '', fr: '', ar: '' }, status: 'pending', dueDate: '', employee: '', manager: '' });
    setEditing(null);
  };

  const getStatusBadge = (status) => {
    const classes = { pending: 'bg-amber-100 text-amber-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-emerald-100 text-emerald-800' };
    const labels = { pending: t('admin.pending'), in_progress: t('admin.inProgress'), completed: t('admin.completed') };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-slate-100'}`}>{labels[status] || status}</span>;
  };

  const getTitle = (task) => typeof task?.title === 'object' ? task.title?.[i18n.language] || task.title?.en : task?.title;

  const filtered = tasks.filter(task =>
    getTitle(task)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('admin.tasks')}</h1>
          <p className="text-slate-500 mt-1">Manage and assign tasks</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-primary-700 hover:bg-primary-600">
          <Plus className="w-5 h-5" />
          {t('admin.addTask')}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <input type="text" placeholder={t('admin.search')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64 px-4 py-2 rounded-xl border border-slate-200" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200">
          <option value="">All statuses</option>
          <option value="pending">{t('admin.pending')}</option>
          <option value="in_progress">{t('admin.inProgress')}</option>
          <option value="completed">{t('admin.completed')}</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 rounded-xl border-2 border-primary-200 border-t-primary-600 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.title')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.status')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.dueDate')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.assignee')}</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">{t('admin.manager')}</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{getTitle(task)}</td>
                    <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                    <td className="px-6 py-4 text-slate-600">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 text-slate-600">{typeof task.employee?.emp_name === 'object' ? task.employee.emp_name?.en : task.employee?.emp_name}</td>
                    <td className="px-6 py-4 text-slate-600">{task.manager?.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditing(task); setFormData({ title: task.title || { en: '', fr: '', ar: '' }, description: task.description || { en: '', fr: '', ar: '' }, status: task.status, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', employee: task.employee?._id, manager: task.manager?._id }); setShowModal(true); }} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 mr-2"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(task._id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center text-slate-500">{t('admin.noData')}</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editing ? t('admin.edit') : t('admin.add')} {t('admin.tasks')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['en', 'fr', 'ar'].map(lang => (
                <div key={lang}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.title')} ({lang})</label>
                  <input required value={formData.title[lang] || ''} onChange={(e) => handleChange(e, lang)} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                </div>
              ))}
              {['en', 'fr', 'ar'].map(lang => (
                <div key={`desc-${lang}`}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.description')} ({lang})</label>
                  <textarea value={formData.description[lang] || ''} onChange={(e) => handleChange(e, lang, 'description')} rows={2} className="w-full px-4 py-2 rounded-xl border border-slate-200" />
                </div>
              ))}
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.status')}</label><select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200"><option value="pending">{t('admin.pending')}</option><option value="in_progress">{t('admin.inProgress')}</option><option value="completed">{t('admin.completed')}</option></select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.dueDate')}</label><input required type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.assignTo')}</label><select required name="employee" value={formData.employee} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200"><option value="">Select</option>{employees.map(emp => <option key={emp._id} value={emp._id}>{typeof emp.emp_name === 'object' ? emp.emp_name?.en : emp.emp_name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">{t('admin.manager')}</label><select required name="manager" value={formData.manager} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-slate-200"><option value="">Select</option>{managers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
              <div className="flex gap-3 pt-2"><button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary-700">{t('admin.save')}</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100">{t('admin.cancel')}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
