import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  LogOut,
  ListTodo,
  Calendar,
  User,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import logoDark2 from '../images/logo/dark2.webp';

const EmployeeDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`/tasks${params}`);
      setTasks(res.data);
    } catch (err) {
      toast.error(t('admin.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success(t('admin.saved'));
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        class: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/50',
        icon: Clock,
        label: t('admin.pending')
      },
      in_progress: {
        class: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/50',
        icon: AlertCircle,
        label: t('admin.inProgress')
      },
      completed: {
        class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/50',
        icon: CheckCircle2,
        label: t('admin.completed')
      }
    };
    const { class: cls, icon: Icon, label } = config[status] || config.pending;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cls}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  const getTitle = (task) =>
    typeof task?.title === 'object'
      ? task.title?.[i18n.language] || task.title?.en
      : task?.title;
  const getDesc = (task) =>
    typeof task?.description === 'object'
      ? task.description?.[i18n.language] || task.description?.en || ''
      : task?.description || '';

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(i18n.language, {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : '—';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-900 dark:to-slate-900/95 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={logoDark2}
                alt="Hassan Elec"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200/80 dark:ring-slate-600 shadow-sm"
              />
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Employee Portal
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px] sm:max-w-none">
                  {user?.name || user?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Employee</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200 font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Welcome & Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('admin.tasks')}
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mb-6">
            Track and update your assigned tasks
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              {
                label: 'Total',
                value: stats.total,
                icon: ListTodo,
                class: 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/50'
              },
              {
                label: t('admin.pending'),
                value: stats.pending,
                icon: Clock,
                class: 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-800/30'
              },
              {
                label: t('admin.inProgress'),
                value: stats.in_progress,
                icon: AlertCircle,
                class: 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-800/30'
              },
              {
                label: t('admin.completed'),
                value: stats.completed,
                icon: CheckCircle2,
                class: 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800/30'
              }
            ].map(({ label, value, icon: Icon, class: cls }) => (
              <div
                key={label}
                className={`rounded-2xl border p-4 ${cls} shadow-sm transition-shadow hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {label}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all"
            >
              <option value="">All statuses</option>
              <option value="pending">{t('admin.pending')}</option>
              <option value="in_progress">{t('admin.inProgress')}</option>
              <option value="completed">{t('admin.completed')}</option>
            </select>
          </div>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 rounded-2xl border-2 border-accent-200 dark:border-accent-800 border-t-accent-500 animate-spin" />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/50 p-16 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
              <ListTodo className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              {t('admin.noData')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => {
              const overdue =
                task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
              return (
                <div
                  key={task._id}
                  className={`group bg-white dark:bg-slate-800/80 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-lg hover:border-slate-300/80 dark:hover:border-slate-600/80 ${
                    overdue
                      ? 'border-amber-300/60 dark:border-amber-700/40'
                      : 'border-slate-200/80 dark:border-slate-700/50'
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center">
                            <ListTodo className="w-5 h-5 text-accent-500 dark:text-accent-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-snug">
                              {getTitle(task)}
                            </h3>
                            {getDesc(task) && (
                              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                                {getDesc(task)}
                              </p>
                            )}
                            <div
                              className={`mt-3 inline-flex items-center gap-2 text-sm ${
                                overdue
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>Due {formatDate(task.dueDate)}</span>
                              {overdue && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-3 sm:min-w-[140px]">
                        {getStatusBadge(task.status)}
                        {task.status !== 'completed' && (
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 appearance-none cursor-pointer pr-10 bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`
                            }}
                          >
                            <option value="pending">{t('admin.pending')}</option>
                            <option value="in_progress">{t('admin.inProgress')}</option>
                            <option value="completed">{t('admin.completed')}</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
