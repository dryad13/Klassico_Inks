import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin } from 'lucide-react';
import Logo from './Logo';
import NetlifyForm, { SubmitButton } from './NetlifyForm';
import {
  PHONE_MOBILE,
  PHONE_MOBILE_DISPLAY,
  EMAIL_PRIMARY,
  SOCIAL,
  ADDRESS,
} from '../config/site';
import { trackEvent } from '../utils/analytics';

const Footer = () => {
  const handleNewsletterSubmit = () => {
    trackEvent('newsletter_submit');
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', { location: 'footer' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 py-8 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-heading text-white uppercase">Subscribe our Newsletter</h3>
            <p className="text-slate-400 text-sm">Stay updated with the latest in ink technology.</p>
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
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 w-full md:w-80"
            />
            <SubmitButton className="w-auto px-6 py-3 uppercase whitespace-nowrap bg-gradient-to-r from-orange-500 to-yellow-500 hover:opacity-90">
              Subscribe
            </SubmitButton>
          </NetlifyForm>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <Logo className="h-16 w-auto object-contain mb-2" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leading manufacturer of industrial liquid inks for flexible packaging. Delivering precision, quality, and innovation in every drop.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Products</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/products?category=rotogravure" className="hover:text-primary-500 transition">
                  Rotogravure Inks
                </Link>
              </li>
              <li>
                <Link to="/products?category=flexographic" className="hover:text-primary-500 transition">
                  Flexographic Inks
                </Link>
              </li>
              <li>
                <Link to="/products?category=specialty" className="hover:text-primary-500 transition">
                  Specialty Inks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/faq" className="hover:text-primary-500 transition">FAQ</Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-primary-500 transition">Case Studies</Link>
              </li>
              <li>
                <Link to="/infrastructure" className="hover:text-primary-500 transition">Infrastructure</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0" />
                <span>
                  {ADDRESS.headOffice} (Head Office)<br />
                  {ADDRESS.factory} (Factory)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                <a
                  href={`tel:${PHONE_MOBILE}`}
                  onClick={handlePhoneClick}
                  className="hover:text-white transition"
                >
                  {PHONE_MOBILE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                <a href={`mailto:${EMAIL_PRIMARY}`} className="hover:text-white transition">
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
                className="text-slate-400 hover:text-primary-500 transition"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-primary-500 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Klassico Inks.<br />
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
