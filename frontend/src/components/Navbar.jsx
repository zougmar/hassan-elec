import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import logoLight from '../images/logo/light2.webp';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const languages = [
    { code: 'en', name: 'English', short: 'EN' },
    { code: 'fr', name: 'Français', short: 'FR' },
    { code: 'ar', name: 'العربية', short: 'AR' }
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isOpen]);

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 border-b border-white/10 shadow-lg shadow-black/20 backdrop-blur-xl'
          : 'bg-slate-950/70 border-b border-transparent backdrop-blur-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[4.25rem]">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 max-w-[70%]">
            <img
              src={logoLight}
              alt="Hassan Elec"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-electric-400/50 group-hover:ring-electric-400 shadow-md shadow-electric-500/10 transition-all shrink-0"
            />
            <div className="min-w-0 leading-tight">
              <span className="block font-display text-base sm:text-xl font-bold text-white tracking-tight truncate">
                Hassan Elec
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.22em] text-electric-400/90 font-semibold">
                Electrical services
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full bg-electric-400" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <ThemeToggle />
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <Globe className="w-4 h-4 text-electric-400" />
                <span>{currentLang.short}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 rtl:left-0 mt-2 w-44 rounded-xl bg-slate-900 border border-white/10 shadow-2xl z-20 overflow-hidden">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm transition-colors ${
                          i18n.language === lang.code
                            ? 'bg-electric-500/15 text-electric-400'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
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

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2.5 rounded-lg text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/98 backdrop-blur-xl max-h-[calc(100svh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? 'bg-electric-500/15 text-electric-400'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-white/10">
              <p className="px-4 pb-2 text-xs uppercase tracking-wider text-slate-500 font-semibold">Language</p>
              <div className="grid grid-cols-3 gap-2 px-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-electric-500 text-slate-950'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {lang.short}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
