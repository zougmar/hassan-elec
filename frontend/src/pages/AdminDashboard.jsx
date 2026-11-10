import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Building2,
  Layers,
  Users,
  ListTodo,
  UserCog,
  User,
  Zap
} from 'lucide-react';
import logoLight from '../images/logo/light2.webp';

import AdminServices from '../components/admin/AdminServices';
import AdminProjects from '../components/admin/AdminProjects';
import AdminRequests from '../components/admin/AdminRequests';
import AdminStats from '../components/admin/AdminStats';
import AdminOrganizations from '../components/admin/AdminOrganizations';
import AdminDepartments from '../components/admin/AdminDepartments';
import AdminEmployees from '../components/admin/AdminEmployees';
import AdminManagers from '../components/admin/AdminManagers';
import AdminTasks from '../components/admin/AdminTasks';
import AdminProfile from '../components/admin/AdminProfile';
import AdminNotifications from '../components/admin/AdminNotifications';
import { getImageUrl } from '../utils/imageUrl';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.type === 'user' || user?.role === 'admin';

  const menuGroups = useMemo(
    () => [
      {
        title: 'Overview',
        items: [
          { path: '/admin', icon: LayoutDashboard, label: t('admin.dashboard'), exact: true }
        ]
      },
      {
        title: 'Content',
        items: [
          ...(isAdmin ? [{ path: '/admin/services', icon: Wrench, label: t('admin.services') }] : []),
          ...(isAdmin ? [{ path: '/admin/projects', icon: FolderKanban, label: t('admin.projects') }] : []),
          ...(isAdmin ? [{ path: '/admin/requests', icon: MessageSquare, label: t('admin.requests') }] : [])
        ]
      },
      {
        title: 'Organization',
        items: [
          ...(isAdmin ? [{ path: '/admin/organizations', icon: Building2, label: t('admin.organizations') }] : []),
          ...(isAdmin ? [{ path: '/admin/departments', icon: Layers, label: t('admin.departments') }] : []),
          { path: '/admin/employees', icon: Users, label: t('admin.employees') },
          { path: '/admin/tasks', icon: ListTodo, label: t('admin.tasks') },
          ...(isAdmin ? [{ path: '/admin/managers', icon: UserCog, label: t('admin.managers') }] : [])
        ]
      },
      {
        title: 'Account',
        items: [{ path: '/admin/profile', icon: User, label: t('admin.profile') }]
      }
    ],
    [isAdmin, t]
  );

  const pageTitle = useMemo(() => {
    const all = menuGroups.flatMap((g) => g.items);
    const match = all.find((item) =>
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    );
    return match?.label || t('admin.dashboard');
  }, [location.pathname, menuGroups, t]);

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-slate-800">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-slate-950/95 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={logoLight}
              alt="Hassan Elec"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-electric-400/40 shrink-0"
            />
            <div className="min-w-0">
              <p className="font-display font-semibold text-white text-sm truncate">Hassan Elec</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-electric-400/90">Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <AdminNotifications dark />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl text-white/80 hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex pt-16 md:pt-0">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:sticky top-0 z-30 w-[17.5rem] h-svh flex flex-col transition-transform duration-300 ease-out bg-slate-950 border-r border-white/5`}
        >
          <div className="hidden md:flex items-center gap-3 px-5 h-[4.25rem] border-b border-white/5">
            <img
              src={logoLight}
              alt="Hassan Elec"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-electric-400/40 shadow-lg shadow-electric-500/10"
            />
            <div className="min-w-0">
              <h1 className="font-display font-bold text-white tracking-tight truncate">Hassan Elec</h1>
              <p className="text-[10px] uppercase tracking-[0.18em] text-electric-400/90 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Control center
              </p>
            </div>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
            {menuGroups.map((group) =>
              group.items.length === 0 ? null : (
                <div key={group.title}>
                  <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                            active
                              ? 'bg-electric-500 text-slate-950 shadow-lg shadow-electric-500/20'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-[1.15rem] h-[1.15rem] shrink-0 ${active ? 'text-slate-950' : 'text-slate-500 group-hover:text-electric-400'}`} />
                          <span className="text-sm font-medium truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </nav>

          <div className="p-3 border-t border-white/5 space-y-2">
            <Link
              to="/admin/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-slate-800 overflow-hidden ring-1 ring-white/10">
                {user?.photo ? (
                  <img src={getImageUrl(user.photo)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user?.name || user?.email || 'Profile'}</p>
                <p className="text-[11px] text-slate-500 truncate capitalize">{user?.role || 'admin'}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">{t('admin.logout')}</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-h-screen min-w-0">
          <div className="hidden md:flex sticky top-0 z-20 items-center justify-between gap-4 px-6 lg:px-8 h-[4.25rem] bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Admin</p>
              <h2 className="font-display text-lg font-bold text-slate-900 truncate">{pageTitle}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </div>
              <AdminNotifications />
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<AdminStats />} />
              <Route path="/services" element={<AdminServices />} />
              <Route path="/projects" element={<AdminProjects />} />
              <Route path="/requests" element={<AdminRequests />} />
              <Route path="/organizations" element={<AdminOrganizations />} />
              <Route path="/departments" element={<AdminDepartments />} />
              <Route path="/employees" element={<AdminEmployees />} />
              <Route path="/tasks" element={<AdminTasks />} />
              <Route path="/managers" element={<AdminManagers />} />
              <Route path="profile" element={<AdminProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
