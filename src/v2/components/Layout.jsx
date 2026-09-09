import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFab from './WhatsAppFab';
import { trackPageView } from '../../utils/analytics';

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-ki-ground text-slate-100 font-sans selection:bg-ki-orange/30">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-grow pt-16" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Layout;
