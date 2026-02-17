import { useState, useEffect } from 'react';
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
  ChevronRight,
  Building2,
  Layers,
  Users,
  ListTodo,
  UserCog
} from 'lucide-react';
import logoDark2 from '../images/logo/dark2.webp';

// Admin Components
import AdminServices from '../components/admin/AdminServices';
import AdminProjects from '../components/admin/AdminProjects';
import AdminRequests from '../components/admin/AdminRequests';
import AdminStats from '../components/admin/AdminStats';
import AdminOrganizations from '../components/admin/AdminOrganizations';
import AdminDepartments from '../components/admin/AdminDepartments';
import AdminEmployees from '../components/admin/AdminEmployees';
import AdminManagers from '../components/admin/AdminManagers';
import AdminTasks from '../components/admin/AdminTasks';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
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

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: t('admin.dashboard') },
    ...(isAdmin ? [{ path: '/admin/services', icon: Wrench, label: t('admin.services') }] : []),
    ...(isAdmin ? [{ path: '/admin/projects', icon: FolderKanban, label: t('admin.projects') }] : []),
    ...(isAdmin ? [{ path: '/admin/requests', icon: MessageSquare, label: t('admin.requests') }] : []),
    ...(isAdmin ? [{ path: '/admin/organizations', icon: Building2, label: t('admin.organizations') }] : []),
    ...(isAdmin ? [{ path: '/admin/departments', icon: Layers, label: t('admin.departments') }] : []),
    { path: '/admin/employees', icon: Users, label: t('admin.employees') },
    { path: '/admin/tasks', icon: ListTodo, label: t('admin.tasks') },
    ...(isAdmin ? [{ path: '/admin/managers', icon: UserCog, label: t('admin.managers') }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-white border-b border-slate-200/80 backdrop-blur-xl bg-white/95">
        <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-2">
              <img
                src={logoDark2}
                alt="Hassan Elec"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 shadow-sm"
              />
              <span className="font-semibold text-slate-800">Admin</span>
            </div>
            <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      <div className="flex pt-16 md:pt-0">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-72 flex flex-col transition-transform duration-300 ease-out bg-slate-900 border-r border-slate-800/50`}
        >
          {/* Logo & Brand */}
          <div className="hidden md:flex items-center gap-3 px-6 h-20 border-b border-slate-800/50">
            <img
              src={logoDark2}
              alt="Hassan Elec"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700 shadow-lg"
            />
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight">Hassan Elec</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-600/20 text-white border border-primary-500/30'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-60' : ''}`} />
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-800/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('admin.logout')}</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">
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
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
