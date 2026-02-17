import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { MessageSquare, Clock, CheckCircle, FileText, Wrench, FolderKanban, ChevronRight } from 'lucide-react';

const AdminStats = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    done: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/requests/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: t('admin.totalRequests'),
      value: stats.total,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-600'
    },
    {
      label: t('admin.pending'),
      value: stats.pending,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-600'
    },
    {
      label: t('admin.inProgress'),
      value: stats.inProgress,
      icon: MessageSquare,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-600'
    },
    {
      label: t('admin.done'),
      value: stats.done,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600'
    }
  ];

  const quickLinks = [
    {
      to: '/admin/services',
      icon: Wrench,
      title: t('admin.services'),
      description: 'Manage your services',
      color: 'text-primary-600'
    },
    {
      to: '/admin/projects',
      icon: FolderKanban,
      title: t('admin.projects'),
      description: 'Manage your projects',
      color: 'text-primary-600'
    },
    {
      to: '/admin/requests',
      icon: MessageSquare,
      title: t('admin.requests'),
      description: 'View client requests',
      color: 'text-primary-600'
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('admin.statistics')}</h1>
        <p className="text-slate-500 mt-1">Overview of your requests and quick actions</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl border-2 border-primary-200 border-t-primary-600 animate-spin" />
            <p className="text-slate-500 text-sm">Loading statistics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-500 text-sm font-medium mb-1">{card.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-xl`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200/60 hover:border-primary-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-primary-50 flex items-center justify-center transition-colors">
                      <Icon className={`w-6 h-6 ${link.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-slate-500">{link.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStats;
