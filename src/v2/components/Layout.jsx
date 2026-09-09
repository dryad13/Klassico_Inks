import { Suspense, useEffect } from 'react';
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
        {/*
          The boundary sits here rather than around <Routes> so a loading route
          chunk only blanks the page body. Wrapping the router put Navbar inside
          the boundary, and React hides that subtree while a chunk loads — which
          froze the mobile menu's exit animation mid-flight and left the open
          panel orphaned in the DOM after every navigation.
        */}
        <Suspense fallback={<div className="min-h-screen bg-ki-ground" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};

export default Layout;
