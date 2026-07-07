import { Mail, Phone, MapPin, Facebook, Linkedin } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 py-8 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-heading text-white uppercase">Subscribe our Newsletter</h3>
            <p className="text-slate-400 text-sm">Stay updated with the latest in ink technology.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 w-full md:w-80"
            />
            <button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity uppercase">
              Subscribe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
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
              <li><a href="/products?category=rotogravure" className="hover:text-primary-500 transition">Rotogravure Inks</a></li>
              <li><a href="/products?category=flexographic" className="hover:text-primary-500 transition">Flexographic Inks</a></li>
              <li><a href="/products?category=specialty" className="hover:text-primary-500 transition">Specialty Inks</a></li>
              <li><a href="/products?category=materials" className="hover:text-primary-500 transition">Raw Materials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0" />
                <span>Karachi, Pakistan (Head Office)<br/>Gadoon Amazai (Factory)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                <span>+92 345 209 9683</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                <a href="mailto:danyalsalam@klassicoinks.com" className="hover:text-white transition">danyalsalam@klassicoinks.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-500 transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-500 transition">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Klassico Inks.<br/>All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
