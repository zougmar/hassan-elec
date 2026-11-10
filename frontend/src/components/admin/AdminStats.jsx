import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  FileText,
  Wrench,
  FolderKanban,
  ChevronRight,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';

const AdminStats = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
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

  const percent = (part, total) => (total > 0 ? Math.round((part / total) * 100) : 0);

  const statCards = [
    {
      label: t('admin.totalRequests'),
      value: stats.total,
      icon: FileText,
      accent: 'bg-sky-500/10 text-sky-600',
      bar: 'bg-sky-500',
      pct: 100
    },
    {
      label: t('admin.pending'),
      value: stats.pending,
      icon: Clock,
      accent: 'bg-amber-500/10 text-amber-600',
      bar: 'bg-amber-500',
      pct: percent(stats.pending, stats.total)
    },
    {
      label: t('admin.inProgress'),
      value: stats.inProgress,
      icon: MessageSquare,
      accent: 'bg-orange-500/10 text-orange-600',
      bar: 'bg-orange-500',
      pct: percent(stats.inProgress, stats.total)
    },
    {
      label: t('admin.done'),
      value: stats.done,
      icon: CheckCircle,
      accent: 'bg-emerald-500/10 text-emerald-600',
      bar: 'bg-emerald-500',
      pct: percent(stats.done, stats.total)
    }
  ];

  const quickLinks = [
    {
      to: '/admin/services',
      icon: Wrench,
      title: t('admin.services'),
      description: 'Create and update service offerings'
    },
    {
      to: '/admin/projects',
      icon: FolderKanban,
      title: t('admin.projects'),
      description: 'Manage portfolio projects and images'
    },
    {
      to: '/admin/requests',
      icon: MessageSquare,
      title: t('admin.requests'),
      description: 'Review and update client requests'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 text-white p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.22),transparent_55%)]" />
        <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-electric-500/10 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <p className="inline-flex items-center gap-1.5 text-electric-400 text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              <Zap className="w-3.5 h-3.5" />
              Hassan Elec
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {t('admin.welcomeBack', { name: user?.name?.split?.(' ')?.[0] || 'Admin' })}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              {t('admin.dashboardHint')}
            </p>
          </div>
          <Link
            to="/admin/requests"
            className="inline-flex items-center justify-center gap-2 self-start sm:self-auto bg-electric-500 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-electric-400 transition-colors"
          >
            {t('admin.viewRequests')}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-xl border-2 border-electric-200 border-t-electric-500 animate-spin" />
            <p className="text-slate-500 text-sm">{t('common.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-1">
                        {card.label}
                      </p>
                      <p className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                        {card.value}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${card.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${card.bar} transition-all duration-700`}
                      style={{ width: `${card.pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400 font-medium">{card.pct}% of total</p>
                </div>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-slate-900">{t('admin.quickActions')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-electric-400/50 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-950 text-electric-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{link.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{link.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-electric-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          <AdminAnalytics />
        </>
      )}
    </div>
  );
};

export default AdminStats;
