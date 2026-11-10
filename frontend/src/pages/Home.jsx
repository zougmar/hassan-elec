import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import {
  Clock,
  ShieldCheck,
  BadgeDollarSign,
  Wrench,
  ArrowRight,
  Zap,
  Phone,
  MessageSquare,
  ClipboardList,
  HardHat,
  CheckCircle2,
  Home as HomeIcon,
  Building2,
  Camera,
  Settings2
} from 'lucide-react';
import heroImage from '../images/Complete Home Electrical Installation.jpg';

function CountUpStat({ target, suffix = '', label, duration = 900 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out for a snappy finish
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);

  return (
    <div ref={ref} className="text-center px-1">
      <p className="font-display text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2 tabular-nums">
        {value}
        {suffix}
      </p>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </div>
  );
}

const Home = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes] = await Promise.all([
        api.get('/services'),
        api.get('/projects')
      ]);
      setServices(Array.isArray(servicesRes?.data) ? servicesRes.data.slice(0, 5) : []);
      setProjects(Array.isArray(projectsRes?.data) ? projectsRes.data.slice(0, 5) : []);
    } catch (error) {
      setServices([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (obj, lang) => obj?.[lang] || obj?.en || '';
  const currentLang = i18n.language || 'en';

  const fallbackGallery = [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=600&q=80'
  ];

  const galleryImages = (() => {
    const fromProjects = projects.flatMap((p) => (Array.isArray(p.images) ? p.images : []));
    const fromServices = services.map((s) => s.image).filter(Boolean);
    const merged = [...fromProjects, ...fromServices, ...fallbackGallery];
    return [...new Set(merged)].slice(0, 16);
  })();

  const marqueeImages = [...galleryImages, ...galleryImages];
  const isRtl = currentLang === 'ar' || i18n.dir() === 'rtl';

  const reasons = [
    { icon: Clock, title: t('home.why1'), desc: t('home.why1Desc'), num: '01' },
    { icon: ShieldCheck, title: t('home.why2'), desc: t('home.why2Desc'), num: '02' },
    { icon: BadgeDollarSign, title: t('home.why3'), desc: t('home.why3Desc'), num: '03' },
    { icon: Wrench, title: t('home.why4'), desc: t('home.why4Desc'), num: '04' }
  ];

  const processSteps = [
    { icon: MessageSquare, title: t('home.process1'), desc: t('home.process1Desc'), num: '01' },
    { icon: ClipboardList, title: t('home.process2'), desc: t('home.process2Desc'), num: '02' },
    { icon: HardHat, title: t('home.process3'), desc: t('home.process3Desc'), num: '03' },
    { icon: CheckCircle2, title: t('home.process4'), desc: t('home.process4Desc'), num: '04' }
  ];

  const expertise = [
    { icon: HomeIcon, title: t('home.expertise1'), desc: t('home.expertise1Desc') },
    { icon: Building2, title: t('home.expertise2'), desc: t('home.expertise2Desc') },
    { icon: Camera, title: t('home.expertise3'), desc: t('home.expertise3Desc') },
    { icon: Settings2, title: t('home.expertise4'), desc: t('home.expertise4Desc') }
  ];

  const stats = [
    { target: 100, suffix: '+', label: t('home.stat1') },
    { target: 24, suffix: '/7', label: t('home.stat2') },
    { target: 100, suffix: '%', label: t('home.stat3') },
    { target: 100, suffix: '%', label: t('home.stat4') }
  ];

  return (
    <div>
      {/* Full-bleed brand hero — kept as-is */}
      <section className="relative min-h-[85svh] sm:min-h-[100svh] flex items-end overflow-hidden">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.18),transparent_45%)]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-28 sm:pb-20 sm:pt-40">
          <div className="max-w-3xl animate-rise">
            <p className="inline-flex items-center gap-2 text-electric-400 font-semibold tracking-[0.18em] uppercase text-xs sm:text-sm mb-4 sm:mb-5">
              <Zap className="w-3.5 h-3.5" />
              Electrical excellence
            </p>
            <h1 className="font-display text-[2rem] leading-tight sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white sm:leading-[1.05] tracking-tight mb-4 sm:mb-5">
              {t('home.title')}
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-xl mb-6 sm:mb-8 leading-relaxed">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-electric-500 text-slate-950 px-6 sm:px-7 py-3.5 rounded-xl font-semibold hover:bg-electric-400 transition-all shadow-lg shadow-electric-500/25 sm:hover:-translate-y-0.5 w-full sm:w-auto"
              >
                {t('home.getStarted')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 border border-white/25 bg-white/5 backdrop-blur-sm text-white px-6 sm:px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all w-full sm:w-auto"
              >
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us — editorial feature strip */}
      <section className="relative py-14 sm:py-20 lg:py-24 bg-white dark:bg-slate-950 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-electric-400/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-electric-500 font-semibold tracking-[0.2em] uppercase text-xs mb-4">
                Hassan Elec
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 dark:text-white leading-tight mb-5">
                {t('home.whyChooseUs')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-md">
                {t('home.whyChooseUsSubtitle')}
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-electric-400 hover:gap-3 transition-all"
              >
                {t('home.getStarted')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {reasons.map(({ icon: Icon, title, desc, num }) => (
                <div
                  key={num}
                  className="group flex gap-3 sm:gap-6 py-5 sm:py-7 first:pt-0 last:pb-0"
                >
                  <span className="font-display text-xl sm:text-3xl font-bold text-slate-200 dark:text-slate-800 group-hover:text-electric-400/50 transition-colors tabular-nums shrink-0">
                    {num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 mb-2">
                      <Icon className="w-5 h-5 text-electric-500 shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
                      <h3 className="text-base sm:text-xl font-semibold text-slate-900 dark:text-white">
                        {title}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-14 sm:py-20 lg:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(234,179,8,0.12),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <p className="text-electric-400 font-semibold tracking-[0.2em] uppercase text-xs mb-3">
              Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              {t('home.processTitle')}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t('home.processSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {processSteps.map(({ icon: Icon, title, desc, num }, index) => (
              <div key={num} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-[-1.5rem] h-px bg-gradient-to-r from-electric-400/40 to-transparent" />
                )}
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-electric-500/10 border border-electric-400/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-electric-400" />
                    </div>
                    <span className="font-display text-sm font-bold text-electric-400/70 tracking-wider">
                      {num}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 sm:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <p className="text-electric-500 font-semibold tracking-[0.2em] uppercase text-xs mb-3">
                {t('nav.services')}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {t('home.ourServices')}
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl">
                {t('services.subtitle')}
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 px-5 py-2.5 rounded-xl hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400 transition-colors"
            >
              {t('home.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-500 mx-auto" />
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
              {services.map((service) => (
                <Link
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="group relative isolate overflow-hidden rounded-2xl bg-slate-900 min-h-[16rem] sm:min-h-[20rem]"
                >
                  {service.image ? (
                    <img
                      src={getImageUrl(service.image)}
                      alt={getLocalizedText(service.title, currentLang)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                      <Zap className="w-12 h-12 text-electric-400/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6 sm:p-7">
                    <h3 className="font-display text-xl font-bold text-white mb-2 tracking-tight">
                      {getLocalizedText(service.title, currentLang)}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                      {getLocalizedText(service.description, currentLang)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-electric-400 text-sm font-semibold group-hover:gap-2.5 transition-all">
                      {t('home.learnMore')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">{t('services.noServices')}</p>
          )}
        </div>
      </section>

      {/* Expertise */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <p className="text-electric-500 font-semibold tracking-[0.2em] uppercase text-xs mb-3">
              Expertise
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('home.expertiseTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {t('home.expertiseSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {expertise.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 group">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-electric-400/50 group-hover:bg-electric-500/10 transition-colors">
                  <Icon className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-electric-500 transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-electric-500 font-semibold tracking-[0.2em] uppercase text-xs mb-8 sm:mb-10">
            {t('home.statsTitle')}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4">
            {stats.map((stat) => (
              <CountUpStat
                key={stat.label}
                target={stat.target}
                suffix={stat.suffix}
                label={stat.label}
                duration={850}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <p className="text-electric-500 font-semibold tracking-[0.2em] uppercase text-xs mb-3">
                {t('nav.projects')}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {t('home.recentProjects')}
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl">
                {t('projects.subtitle')}
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 px-5 py-2.5 rounded-xl hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400 transition-colors"
            >
              {t('home.viewGallery')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-500 mx-auto" />
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="group relative isolate overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 min-h-[15rem] sm:min-h-[18rem]"
                >
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={getImageUrl(project.images[0])}
                      alt={getLocalizedText(project.title, currentLang)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <Zap className="w-12 h-12 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  {project.images && project.images.length > 1 && (
                    <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur text-white text-xs font-medium">
                      +{project.images.length - 1}
                    </span>
                  )}
                  <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                      {getLocalizedText(project.title, currentLang)}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2 max-w-lg">
                      {getLocalizedText(project.description, currentLang)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-12">{t('projects.noProjects')}</p>
          )}
        </div>
      </section>

      {/* Gallery marquee — small images scrolling left → right */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-electric-500 font-semibold tracking-[0.2em] uppercase text-xs mb-3">
                {t('nav.gallery')}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                {t('home.galleryTitle')}
              </h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-xl">
                {t('home.gallerySubtitle')}
              </p>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-semibold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 px-5 py-2.5 rounded-xl hover:border-electric-400 hover:text-electric-600 dark:hover:text-electric-400 transition-colors"
            >
              {t('home.viewGallery')}
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>

        <div className="relative" dir="ltr">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10" />
          <div
            className={`flex w-max gap-3 sm:gap-5 hover:[animation-play-state:paused] ${
              isRtl ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
            }`}
          >
            {marqueeImages.map((src, index) => (
              <Link
                key={`${src}-${index}`}
                to="/gallery"
                className="shrink-0 w-36 h-36 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shadow-sm"
              >
                <img
                  src={getImageUrl(src)}
                  alt=""
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { e.target.style.opacity = '0.3'; }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative py-14 sm:py-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.12),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-electric-400 font-semibold tracking-[0.2em] uppercase text-xs mb-4">
            Hassan Elec
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-electric-500 text-slate-950 px-6 sm:px-7 py-3.5 rounded-xl font-semibold hover:bg-electric-400 transition-colors shadow-lg shadow-electric-500/20 w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" />
              {t('home.getStarted')}
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 sm:px-7 py-3.5 rounded-xl font-semibold hover:bg-white/5 transition-colors w-full sm:w-auto"
            >
              {t('home.viewGallery')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
