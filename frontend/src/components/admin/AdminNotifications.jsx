import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, MessageSquare, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';
import { playNotificationSound } from '../../utils/notifySound';

const STORAGE_KEY = 'hassan-admin-notifications';
const MAX_ITEMS = 30;

function loadNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotifications(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // ignore quota errors
  }
}

function formatTime(iso, locale) {
  try {
    return new Date(iso).toLocaleString(locale || undefined, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
}

const AdminNotifications = ({ dark = false }) => {
  const { t, i18n } = useTranslation();
  const { on, connected } = useSocket();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() => loadNotifications());
  const panelRef = useRef(null);

  const unreadCount = items.filter((n) => !n.read).length;

  useEffect(() => {
    saveNotifications(items);
  }, [items]);

  useEffect(() => {
    const offNew = on('request:new', (request) => {
      const notification = {
        id: `req-${request._id || Date.now()}`,
        type: 'request',
        title: t('admin.notifNewRequest'),
        message: request.name
          ? `${request.name}${request.serviceType ? ` · ${request.serviceType}` : ''}`
          : t('admin.notifNewRequestBody'),
        href: '/admin/requests',
        createdAt: request.createdAt || new Date().toISOString(),
        read: false
      };

      setItems((prev) => [notification, ...prev.filter((n) => n.id !== notification.id)].slice(0, MAX_ITEMS));
      playNotificationSound();
      toast.success(t('admin.notifNewRequest'), { icon: '🔔' });
    });

    return () => offNew();
  }, [on, t]);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAll = () => {
    setItems([]);
    setOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative p-2.5 rounded-xl transition-colors ${
          dark
            ? 'text-white/85 hover:bg-white/10 hover:text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        aria-label={t('admin.notifications')}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse ${dark ? 'ring-2 ring-slate-950' : 'ring-2 ring-white'}`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        <span
          className={`absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
            connected ? 'bg-emerald-400' : dark ? 'bg-slate-500' : 'bg-slate-300'
          }`}
          title={connected ? t('admin.liveOn') : t('admin.liveOff')}
        />
      </button>

      {open && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <div>
              <p className="font-semibold text-slate-900 text-sm">{t('admin.notifications')}</p>
              <p className="text-xs text-slate-500">
                {connected ? t('admin.liveOn') : t('admin.liveOff')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-800"
                  title={t('admin.markAllRead')}
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                {t('admin.noNotifications')}
              </div>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id}
                  to={item.href || '/admin/requests'}
                  onClick={() => {
                    markOneRead(item.id);
                    setOpen(false);
                  }}
                  className={`flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    item.read ? 'opacity-70' : 'bg-amber-50/40'
                  }`}
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-electric-500/15 text-electric-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      {!item.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{item.message}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {formatTime(item.createdAt, i18n.language)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-100 bg-slate-50/80">
              <Link
                to="/admin/requests"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-primary-700 hover:text-primary-900 px-2 py-1.5"
              >
                {t('admin.viewRequests')}
              </Link>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-slate-500 hover:text-red-600 px-2 py-1.5"
              >
                {t('admin.clearNotifications')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
