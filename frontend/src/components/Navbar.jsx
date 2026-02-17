import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import logoDark2 from '../images/logo/dark2.webp';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contact', label: t('nav.contact') }
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md dark:shadow-slate-900/50 sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoDark2}
              alt="Hassan Elec"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-200 dark:ring-slate-600 shadow-sm"
            />
            <span className="text-xl font-bold text-primary-800 dark:text-white tracking-tight">Hassan Elec</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary-800 dark:text-white bg-electric-50 dark:bg-electric-900/30 border-b-2 border-electric-500'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-primary-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find(l => l.code === i18n.language)?.name}</span>
              </button>

              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 rtl:left-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 z-20">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 first:rounded-t-md last:rounded-b-md ${
                          i18n.language === lang.code ? 'bg-electric-50 dark:bg-electric-900/30 text-primary-800 dark:text-electric-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-electric-400"
              >
                <Globe className="w-5 h-5" />
              </button>
              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 rtl:left-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-gray-100 dark:border-slate-700 z-20">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left rtl:text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 first:rounded-t-md last:rounded-b-md ${
                          i18n.language === lang.code ? 'bg-electric-50 dark:bg-electric-900/30 text-primary-800 dark:text-electric-400' : 'text-gray-700 dark:text-slate-300'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-electric-400"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-primary-800 dark:text-white bg-electric-50 dark:bg-electric-900/30 border-r-4 border-electric-500'
                    : 'text-gray-700 dark:text-slate-300 hover:text-primary-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
