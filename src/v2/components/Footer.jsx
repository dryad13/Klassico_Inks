import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin } from 'lucide-react';
import Logo from '../../components/Logo';
import NetlifyForm, { SubmitButton } from '../../components/NetlifyForm';
import {
  PHONE_MOBILE,
  PHONE_MOBILE_DISPLAY,
  EMAIL_PRIMARY,
  SOCIAL,
  ADDRESS,
} from '../../config/site';
import { trackEvent } from '../../utils/analytics';
import { focusRing } from './ui';

const Footer = () => {
  const handleNewsletterSubmit = () => {
    trackEvent('newsletter_submit');
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', { location: 'footer' });
  };

  const linkClass = clsxFooterLink();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 py-8 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-heading text-white uppercase">
              Subscribe our Newsletter
            </h3>
            <p className="text-slate-400 text-sm leading-[1.65]">
              Stay updated with the latest in ink technology.
            </p>
          </div>
          <NetlifyForm
            name="newsletter"
            onSubmit={handleNewsletterSubmit}
            successMessage="You're subscribed! Thank you for joining our newsletter."
            className="flex w-full md:w-auto gap-2"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="bg-ki-ground border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-ki-orange focus:ring-1 focus:ring-ki-orange w-full md:w-80"
            />
            <SubmitButton className="w-auto px-6 py-3 uppercase whitespace-nowrap bg-ki-orange hover:bg-[#e0841a] text-ki-ground font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ki-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
              Subscribe
            </SubmitButton>
          </NetlifyForm>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div>
            <Logo className="h-16 w-auto object-contain mb-4" />
            <p className="text-sm leading-[1.65] text-slate-400">
              Leading manufacturer of industrial printing inks, solvents, and raw materials for
              packaging and commercial print.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/products?category=ink-series" className={linkClass}>
                  Ink Series
                </Link>
              </li>
              <li>
                <Link to="/products?category=ink-processes" className={linkClass}>
                  Ink Processes
                </Link>
              </li>
              <li>
                <Link to="/products?category=solvents" className={linkClass}>
                  Solvents & Blends
                </Link>
              </li>
              <li>
                <Link to="/products?category=industry-products" className={linkClass}>
                  Printing Ink Industry Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/faq" className={linkClass}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/infrastructure" className={linkClass}>
                  Manufacturing
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-ki-orange shrink-0" aria-hidden="true" />
                <span>
                  {ADDRESS.headOffice} (Head Office)
                  <br />
                  {ADDRESS.factory} (Factory)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-ki-orange shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${PHONE_MOBILE}`}
                  onClick={handlePhoneClick}
                  className={linkClass}
                >
                  {PHONE_MOBILE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-ki-orange shrink-0" aria-hidden="true" />
                <a href={`mailto:${EMAIL_PRIMARY}`} className={linkClass}>
                  {EMAIL_PRIMARY}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Klassico Inks.
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

function clsxFooterLink() {
  return `hover:text-ki-orange transition rounded ${focusRing} focus-visible:ring-offset-slate-950`;
}

export default Footer;
