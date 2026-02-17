import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './SocialIcons';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = {
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    tiktok: 'https://www.tiktok.com'
  };

  return (
    <footer className="bg-gradient-to-b from-primary-900 to-primary-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center">
              <span className="text-white">Hassan Elec</span>
              <span className="text-electric-500 ml-2 text-xl">⚡</span>
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              {t('home.subtitle')}
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 flex-wrap">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#1877F2] active:scale-95 text-white p-3 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg touch-manipulation"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-gradient-to-r hover:from-[#E4405F] hover:via-[#F77737] hover:to-[#FCAF45] active:scale-95 text-white p-3 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg touch-manipulation"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#000000] active:scale-95 text-white p-3 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg touch-manipulation"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-electric-400">{t('nav.services')}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="block py-2 sm:py-0 text-gray-300 hover:text-electric-400 transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-electric-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="block py-2 sm:py-0 text-gray-300 hover:text-electric-400 transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-electric-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="block py-2 sm:py-0 text-gray-300 hover:text-electric-400 transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-electric-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="block py-2 sm:py-0 text-gray-300 hover:text-electric-400 transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-electric-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="block py-2 sm:py-0 text-gray-300 hover:text-electric-400 transition-colors flex items-center group text-sm sm:text-base">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-electric-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-electric-400">{t('nav.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 rtl:gap-3 group">
                <div className="mt-0.5 shrink-0">
                  <Phone className="w-5 h-5 text-electric-500 group-hover:scale-110 transition-transform" />
                </div>
                <a href="tel:+212638463432" className="text-gray-300 hover:text-electric-400 transition-colors text-sm sm:text-base break-all">
                  +212 638-463432
                </a>
              </li>
              <li className="flex items-start gap-3 rtl:gap-3 group">
                <div className="mt-0.5 shrink-0">
                  <Mail className="w-5 h-5 text-electric-500 group-hover:scale-110 transition-transform" />
                </div>
                <a href="mailto:info@hassan-elec.com" className="text-gray-300 hover:text-electric-400 transition-colors break-all text-sm sm:text-base">
                  info@hassan-elec.com
                </a>
              </li>
              <li className="flex items-start gap-3 rtl:gap-3 group">
                <div className="mt-0.5 shrink-0">
                  <MapPin className="w-5 h-5 text-electric-500 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-gray-300 text-sm sm:text-base">
                  Your Address Here
                </span>
              </li>
            </ul>
          </div>

          {/* Business Hours / Additional Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-electric-400">Business Hours</h4>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span>Monday - Friday</span>
                <span className="text-electric-400 shrink-0">8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span>Saturday</span>
                <span className="text-electric-400 shrink-0">9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2">
                <span>Sunday</span>
                <span className="text-electric-400 shrink-0">Emergency Only</span>
              </li>
            </ul>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-gray-300">
                <span className="text-electric-400 font-semibold">24/7 Emergency Service</span> available
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-gray-400 text-xs sm:text-sm order-2 sm:order-1">
              &copy; {new Date().getFullYear()} Hassan Elec. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-400 order-1 sm:order-2">
              <Link to="/" className="hover:text-electric-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-electric-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
