import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/Logo';
import { focusRing } from './ui';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Manufacturing', path: '/infrastructure' },
  { name: 'About', path: '/about' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [overPaper, setOverPaper] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // getBoundingClientRect forces a synchronous layout, and scroll can fire
    // more than once per frame — so this is coalesced into a single rAF pass
    // rather than run per event. The query stays inside the callback so it
    // still picks up sections from a lazily-loaded route that mounts after
    // this effect, but now costs one pass per frame instead of one per event.
    let queued = false;

    const measure = () => {
      queued = false;
      const navBottom = 64;
      let paper = false;
      document.querySelectorAll('[data-v2-tone="paper"]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navBottom && rect.bottom >= navBottom) {
          paper = true;
        }
      });
      setOverPaper(paper);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const ringOffset = overPaper ? 'focus-visible:ring-offset-ki-paper' : 'focus-visible:ring-offset-ki-ground';

  return (
    <nav
      className={clsx(
        'fixed w-full z-50 backdrop-blur-md border-b transition-colors duration-300',
        overPaper
          ? 'bg-ki-paper/90 border-ki-green/15 text-ki-ground'
          : 'bg-ki-ground/80 border-slate-800 text-white'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className={clsx('flex items-center h-16 rounded', focusRing, ringOffset)}
          >
            <Logo className="h-12 sm:h-14 w-auto max-h-full object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  focusRing,
                  ringOffset,
                  isActive(link.path)
                    ? overPaper
                      ? 'text-ki-orange bg-ki-orange/10 border border-ki-orange/25'
                      : 'text-ki-orange bg-ki-green/20 border border-ki-orange/20'
                    : overPaper
                      ? 'text-slate-700 hover:text-ki-ground hover:bg-white/70'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={clsx(
                'inline-flex items-center justify-center p-2 rounded-md',
                focusRing,
                ringOffset,
                overPaper ? 'text-ki-ground hover:bg-white/70' : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={clsx(
              'lg:hidden border-b',
              overPaper ? 'bg-ki-paper border-ki-green/15' : 'bg-ki-ground border-slate-800'
            )}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'block px-3 py-2 rounded-md text-base font-medium',
                    focusRing,
                    ringOffset,
                    isActive(link.path)
                      ? 'text-ki-orange bg-ki-orange/10'
                      : overPaper
                        ? 'text-slate-700 hover:bg-white/70'
                        : 'text-slate-300 hover:bg-slate-800'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
