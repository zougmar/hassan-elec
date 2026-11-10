import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList
} from 'recharts';
import api from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { useSocket } from '../../context/SocketContext';
import ChartCard from './charts/ChartCard';
import {
  getChartTheme,
  PERIODS,
  ACTIVITY_PERIODS,
  FilterPill,
  ChartEmpty,
  ChartLoading
} from './charts/chartTheme';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const AdminAnalytics = () => {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();
  const { on } = useSocket();
  const theme = useMemo(() => getChartTheme(isDark), [isDark]);
  const isRtl = i18n.language === 'ar' || i18n.dir?.() === 'rtl';

  const [overviewPeriod, setOverviewPeriod] = useState('monthly');
  const [activityPeriod, setActivityPeriod] = useState('weekly');
  const [barView, setBarView] = useState('monthly');
  const [barYear, setBarYear] = useState(new Date().getFullYear());
  const [topLimit, setTopLimit] = useState(5);

  const [overview, setOverview] = useState({ current: [], previous: [] });
  const [monthly, setMonthly] = useState({ months: [], years: [], availableYears: [], year: barYear, view: 'monthly' });
  const [statusData, setStatusData] = useState({ total: 0, items: [] });
  const [activity, setActivity] = useState({ series: [] });
  const [topServices, setTopServices] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [loading, setLoading] = useState({
    overview: true,
    monthly: true,
    status: true,
    activity: true,
    top: true,
    performance: true
  });
  const [errors, setErrors] = useState({});

  const setBusy = (key, value) => setLoading((prev) => ({ ...prev, [key]: value }));
  const setErr = (key, value) => setErrors((prev) => ({ ...prev, [key]: value }));

  const fetchOverview = useCallback(async () => {
    setBusy('overview', true);
    setErr('overview', '');
    try {
      const { data } = await api.get('/analytics/overview', {
        params: { period: overviewPeriod, compare: 1 }
      });
      setOverview(data);
    } catch {
      setErr('overview', t('charts.error'));
    } finally {
      setBusy('overview', false);
    }
  }, [overviewPeriod, t]);

  const fetchMonthly = useCallback(async () => {
    setBusy('monthly', true);
    setErr('monthly', '');
    try {
      const { data } = await api.get('/analytics/monthly', {
        params: { year: barYear, view: barView }
      });
      setMonthly(data);
      if (data.view === 'monthly' && data.year) setBarYear(data.year);
    } catch {
      setErr('monthly', t('charts.error'));
    } finally {
      setBusy('monthly', false);
    }
  }, [barYear, barView, t]);

  const fetchStatus = useCallback(async () => {
    setBusy('status', true);
    setErr('status', '');
    try {
      const { data } = await api.get('/analytics/status');
      setStatusData(data);
    } catch {
      setErr('status', t('charts.error'));
    } finally {
      setBusy('status', false);
    }
  }, [t]);

  const fetchActivity = useCallback(async () => {
    setBusy('activity', true);
    setErr('activity', '');
    try {
      const { data } = await api.get('/analytics/activity', { params: { period: activityPeriod } });
      setActivity(data);
    } catch {
      setErr('activity', t('charts.error'));
    } finally {
      setBusy('activity', false);
    }
  }, [activityPeriod, t]);

  const fetchTop = useCallback(async () => {
    setBusy('top', true);
    setErr('top', '');
    try {
      const { data } = await api.get('/analytics/top-services', { params: { limit: topLimit } });
      setTopServices(data.items || []);
    } catch {
      setErr('top', t('charts.error'));
    } finally {
      setBusy('top', false);
    }
  }, [topLimit, t]);

  const fetchPerformance = useCallback(async () => {
    setBusy('performance', true);
    setErr('performance', '');
    try {
      const { data } = await api.get('/analytics/performance');
      setPerformance(data.indicators || []);
    } catch {
      setErr('performance', t('charts.error'));
    } finally {
      setBusy('performance', false);
    }
  }, [t]);

  const refreshAll = useCallback(() => {
    fetchOverview();
    fetchMonthly();
    fetchStatus();
    fetchActivity();
    fetchTop();
    fetchPerformance();
  }, [fetchOverview, fetchMonthly, fetchStatus, fetchActivity, fetchTop, fetchPerformance]);

  useEffect(() => { fetchOverview(); }, [fetchOverview]);
  useEffect(() => { fetchMonthly(); }, [fetchMonthly]);
  useEffect(() => { fetchStatus(); }, [fetchStatus]);
  useEffect(() => { fetchActivity(); }, [fetchActivity]);
  useEffect(() => { fetchTop(); }, [fetchTop]);
  useEffect(() => { fetchPerformance(); }, [fetchPerformance]);

  useEffect(() => {
    const offNew = on('request:new', () => refreshAll());
    const offUpdated = on('request:updated', () => refreshAll());
    return () => {
      offNew();
      offUpdated();
    };
  }, [on, refreshAll]);

  const tooltipStyle = {
    backgroundColor: theme.tooltipBg,
    border: `1px solid ${theme.tooltipBorder}`,
    borderRadius: 12,
    color: theme.tooltipText,
    fontSize: 12
  };

  const overviewChartData = useMemo(() => {
    const curr = overview.current || [];
    const prev = overview.previous || [];
    const len = Math.max(curr.length, prev.length);
    return Array.from({ length: len }, (_, i) => ({
      label: curr[i]?.label || prev[i]?.label || `${i + 1}`,
      current: curr[i]?.total || 0,
      previous: prev[i]?.total || 0
    }));
  }, [overview]);

  const monthlyChartData = useMemo(() => {
    if (monthly.view === 'yearly') {
      return (monthly.years || []).map((y) => ({
        ...y,
        name: String(y.year)
      }));
    }
    return (monthly.months || []).map((m) => ({
      ...m,
      name: t(`charts.months.${MONTH_KEYS[m.month - 1]}`)
    }));
  }, [monthly.months, monthly.years, monthly.view, t]);

  const statusChartData = useMemo(
    () =>
      (statusData.items || []).map((item) => ({
        ...item,
        name: t(`charts.status.${item.key}`),
        color:
          item.key === 'pending'
            ? theme.pending
            : item.key === 'inProgress'
              ? theme.inProgress
              : theme.done
      })),
    [statusData.items, t, theme]
  );

  const activityChartData = useMemo(
    () => (activity.series || []).map((s) => ({ label: s.label, total: s.total })),
    [activity.series]
  );

  const topChartData = useMemo(() => {
    const items = [...(topServices || [])].reverse();
    return items.map((s) => ({
      name: s.service?.length > 22 ? `${s.service.slice(0, 22)}…` : s.service,
      fullName: s.service,
      count: s.count
    }));
  }, [topServices]);

  const radarData = useMemo(
    () =>
      (performance || []).map((p) => ({
        subject: t(`charts.radar.${p.key}`),
        value: p.value,
        fullMark: Math.max(...(performance.map((x) => x.value) || [1]), 1)
      })),
    [performance, t]
  );

  const yearOptions = useMemo(() => {
    const years = monthly.availableYears?.length
      ? monthly.availableYears
      : [new Date().getFullYear()];
    return years;
  }, [monthly.availableYears]);

  return (
    <section className="space-y-4 sm:space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t('charts.sectionTitle')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('charts.sectionSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* 1. Line Chart */}
        <ChartCard
          title={t('charts.overviewTitle')}
          subtitle={t('charts.overviewSubtitle')}
          actions={PERIODS.map((p) => (
            <FilterPill key={p} active={overviewPeriod === p} onClick={() => setOverviewPeriod(p)}>
              {t(`charts.periods.${p}`)}
            </FilterPill>
          ))}
        >
          {loading.overview ? (
            <ChartLoading />
          ) : errors.overview ? (
            <ChartEmpty message={errors.overview} />
          ) : overviewChartData.length === 0 ? (
            <ChartEmpty message={t('charts.empty')} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={overviewChartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 11 }} minTickGap={18} />
                <YAxis allowDecimals={false} tick={{ fill: theme.axis, fontSize: 11 }} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current"
                  name={t('charts.currentPeriod')}
                  stroke={theme.total}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  name={t('charts.previousPeriod')}
                  stroke={theme.previous}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 2. Bar Chart */}
        <ChartCard
          title={t('charts.monthlyTitle')}
          subtitle={t('charts.monthlySubtitle')}
          actions={
            <>
              {['monthly', 'yearly'].map((v) => (
                <FilterPill key={v} active={barView === v} onClick={() => setBarView(v)}>
                  {t(`charts.periods.${v}`)}
                </FilterPill>
              ))}
              {barView === 'monthly' ? (
                <select
                  value={barYear}
                  onChange={(e) => setBarYear(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-0"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              ) : null}
            </>
          }
        >
          {loading.monthly ? (
            <ChartLoading />
          ) : errors.monthly ? (
            <ChartEmpty message={errors.monthly} />
          ) : monthlyChartData.length === 0 || monthlyChartData.every((m) => m.total === 0) ? (
            <ChartEmpty message={t('charts.empty')} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyChartData} margin={{ top: 18, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: theme.axis, fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: theme.axis, fontSize: 11 }} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="pending" name={t('charts.status.pending')} fill={theme.pending} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="pending" position="top" fill={theme.axis} fontSize={10} formatter={(v) => (v > 0 ? v : '')} />
                </Bar>
                <Bar dataKey="inProgress" name={t('charts.status.inProgress')} fill={theme.inProgress} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="inProgress" position="top" fill={theme.axis} fontSize={10} formatter={(v) => (v > 0 ? v : '')} />
                </Bar>
                <Bar dataKey="done" name={t('charts.status.done')} fill={theme.done} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey="done" position="top" fill={theme.axis} fontSize={10} formatter={(v) => (v > 0 ? v : '')} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 3. Doughnut */}
        <ChartCard title={t('charts.statusTitle')} subtitle={t('charts.statusSubtitle')}>
          {loading.status ? (
            <ChartLoading />
          ) : errors.status ? (
            <ChartEmpty message={errors.status} />
          ) : statusData.total === 0 ? (
            <ChartEmpty message={t('charts.empty')} />
          ) : (
            <div className="relative h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="46%"
                    innerRadius={68}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                    isAnimationActive
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [
                      `${value} (${statusData.total ? Math.round((value / statusData.total) * 100) : 0}%)`,
                      name
                    ]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{t('charts.total')}</p>
                <p className="font-display text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {statusData.total}
                </p>
              </div>
            </div>
          )}
        </ChartCard>

        {/* 4. Area Chart */}
        <ChartCard
          title={t('charts.activityTitle')}
          subtitle={t('charts.activitySubtitle')}
          actions={ACTIVITY_PERIODS.map((p) => (
            <FilterPill key={p} active={activityPeriod === p} onClick={() => setActivityPeriod(p)}>
              {t(`charts.periods.${p}`)}
            </FilterPill>
          ))}
        >
          {loading.activity ? (
            <ChartLoading />
          ) : errors.activity ? (
            <ChartEmpty message={errors.activity} />
          ) : activityChartData.length === 0 ? (
            <ChartEmpty message={t('charts.empty')} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={activityChartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.total} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={theme.total} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 11 }} minTickGap={18} />
                <YAxis allowDecimals={false} tick={{ fill: theme.axis, fontSize: 11 }} width={36} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name={t('charts.activity')}
                  stroke={theme.total}
                  strokeWidth={2.5}
                  fill="url(#activityFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 5. Horizontal Bar */}
        <ChartCard
          title={t('charts.topServicesTitle')}
          subtitle={t('charts.topServicesSubtitle')}
          actions={[5, 10].map((n) => (
            <FilterPill key={n} active={topLimit === n} onClick={() => setTopLimit(n)}>
              Top {n}
            </FilterPill>
          ))}
        >
          {loading.top ? (
            <ChartLoading />
          ) : errors.top ? (
            <ChartEmpty message={errors.top} />
          ) : topChartData.length === 0 ? (
            <ChartEmpty message={t('charts.empty')} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                layout="vertical"
                data={topChartData}
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: theme.axis, fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isRtl ? 90 : 110}
                  tick={{ fill: theme.axis, fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, _n, props) => [value, props?.payload?.fullName || t('charts.requests')]}
                />
                <Bar dataKey="count" name={t('charts.requests')} fill={theme.inProgress} radius={[0, 6, 6, 0]}>
                  <LabelList dataKey="count" position={isRtl ? 'left' : 'right'} fill={theme.axis} fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* 6. Radar */}
        <ChartCard title={t('charts.radarTitle')} subtitle={t('charts.radarSubtitle')}>
          {loading.performance ? (
            <ChartLoading />
          ) : errors.performance ? (
            <ChartEmpty message={errors.performance} />
          ) : radarData.every((d) => d.value === 0) ? (
            <ChartEmpty message={t('charts.empty')} />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke={theme.grid} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: theme.axis, fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: theme.axis, fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Radar
                  name={t('charts.performance')}
                  dataKey="value"
                  stroke={theme.radarStroke}
                  fill={theme.radarFill}
                  fillOpacity={1}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </section>
  );
};

export default AdminAnalytics;
