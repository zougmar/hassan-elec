export function getChartTheme(isDark) {
  return {
    grid: isDark ? '#334155' : '#e2e8f0',
    axis: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
    tooltipText: isDark ? '#f8fafc' : '#0f172a',
    cursor: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.06)',
    pending: '#f59e0b',
    inProgress: '#0ea5e9',
    done: '#10b981',
    total: '#eab308',
    previous: isDark ? '#64748b' : '#94a3b8',
    areaFill: isDark ? 'rgba(234,179,8,0.28)' : 'rgba(234,179,8,0.22)',
    radarFill: isDark ? 'rgba(14,165,233,0.25)' : 'rgba(14,165,233,0.18)',
    radarStroke: '#0ea5e9'
  };
}

export const PERIODS = ['daily', 'weekly', 'monthly', 'yearly'];
export const ACTIVITY_PERIODS = ['daily', 'weekly', 'monthly'];

export function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
        active
          ? 'bg-electric-500 text-slate-950'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

export function ChartEmpty({ message }) {
  return (
    <div className="h-[260px] flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
      {message}
    </div>
  );
}

export function ChartLoading() {
  return (
    <div className="h-[260px] flex items-center justify-center">
      <div className="w-9 h-9 rounded-xl border-2 border-electric-200 border-t-electric-500 animate-spin" />
    </div>
  );
}
