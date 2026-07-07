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
