import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({ open: false, title: '', message: '', confirmLabel: 'Confirm', cancelLabel: 'Cancel' });
  const resolverRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    const opts = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setState({
        open: true,
        title: opts.title || 'Are you sure?',
        message: opts.message || 'This action cannot be undone.',
        confirmLabel: opts.confirmLabel || 'Confirm',
        cancelLabel: opts.cancelLabel || 'Cancel'
      });
    });
  }, []);

  const close = (result) => {
    setState((s) => ({ ...s, open: false }));
    resolverRef.current?.(result);
    resolverRef.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={() => close(false)} />
          <div
            role="alertdialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-pop-in"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{state.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{state.message}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => close(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {state.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20 transition-colors"
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    return async (options) => {
      const message = typeof options === 'string' ? options : options?.message || 'Are you sure?';
      return window.confirm(message);
    };
  }
  return ctx;
}
