const GA_ID = import.meta.env.VITE_GA_ID;

/**
 * Loads GA4 when VITE_GA_ID is set (Netlify env var), and no-ops otherwise so
 * local and preview builds stay out of the property.
 *
 * page_view is disabled on the config call because Layout fires trackPageView
 * on every route change — leaving it on would double-count the first page.
 */
export function initAnalytics() {
  if (!GA_ID || typeof document === 'undefined') return;
  if (document.querySelector('script[data-ga]')) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.setAttribute('data-ga', '');
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false });
}

export function trackEvent(name, params = {}) {
  if (import.meta.env.DEV) {
    console.log('[analytics]', name, params);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: params });
  }
}

export function trackPageView(path) {
  if (import.meta.env.DEV) {
    console.log('[analytics] page_view', path);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: path });
  }
  if (typeof window.plausible === 'function') {
    window.plausible('pageview', { u: path });
  }
}
