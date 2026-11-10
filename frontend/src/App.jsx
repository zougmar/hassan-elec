import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { ConfirmProvider } from './components/ui/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const toastOptions = {
  duration: 3500,
  style: {
    borderRadius: '16px',
    background: '#0f172a',
    color: '#f8fafc',
    padding: '14px 16px',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.35)',
    border: '1px solid rgba(148, 163, 184, 0.2)'
  },
  success: {
    iconTheme: { primary: '#eab308', secondary: '#0f172a' }
  },
  error: {
    iconTheme: { primary: '#f87171', secondary: '#0f172a' }
  }
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <ConfirmProvider>
              <Toaster position="top-center" toastOptions={toastOptions} />
              <Router>
                <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/login" element={<Login />} />
                    <Route path="/employee/login" element={<Login />} />
                    <Route
                      path="/admin/*"
                      element={
                        <ProtectedRoute role="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/employee/*"
                      element={
                        <ProtectedRoute role="employee">
                          <EmployeeDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/*"
                      element={
                        <>
                          <Navbar />
                          <main className="flex-grow">
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/services" element={<Services />} />
                              <Route path="/services/:id" element={<ServiceDetail />} />
                              <Route path="/projects" element={<Projects />} />
                              <Route path="/projects/:id" element={<ProjectDetail />} />
                              <Route path="/gallery" element={<Gallery />} />
                              <Route path="/contact" element={<Contact />} />
                            </Routes>
                          </main>
                          <Footer />
                          <WhatsAppButton />
                        </>
                      }
                    />
                  </Routes>
                </div>
              </Router>
            </ConfirmProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
