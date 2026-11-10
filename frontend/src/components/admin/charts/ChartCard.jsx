const ChartCard = ({ title, subtitle, actions, children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        {subtitle ? <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div> : null}
    </div>
    <div className="w-full min-h-[260px]">{children}</div>
  </div>
);

export default ChartCard;
