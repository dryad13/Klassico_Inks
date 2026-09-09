/**
 * Product creatives, resized and re-encoded at build time by vite-imagetools.
 *
 * The sources are 1600x900 JPEGs (~250kB each); nothing on the site displays
 * them wider than ~720px, so serving the originals wasted most of every byte.
 * Globbed rather than listed so a new creative only needs to be dropped in the
 * folder with a filename matching its product slug.
 */
// Widths are inlined at each call: Vite requires import.meta.glob options to
// be statically analyzable, so they cannot come from a shared constant.
const webpSrcSets = import.meta.glob('./*.jpg', {
  query: { w: '480;720;1080', format: 'webp', as: 'srcset' },
  import: 'default',
  eager: true,
});

// JPEG fallback for browsers without WebP, and the `src` a <picture> needs.
const jpegSrcSets = import.meta.glob('./*.jpg', {
  query: { w: '480;720;1080', format: 'jpg', as: 'srcset' },
  import: 'default',
  eager: true,
});

const jpegFallbacks = import.meta.glob('./*.jpg', {
  query: { w: '720', format: 'jpg' },
  import: 'default',
  eager: true,
});

function slugOf(path) {
  return path.replace('./', '').replace('.jpg', '');
}

/** slug → { webpSrcSet, jpegSrcSet, src }, or null when no creative exists. */
export const productImages = Object.fromEntries(
  Object.keys(webpSrcSets).map((path) => [
    slugOf(path),
    {
      webpSrcSet: webpSrcSets[path],
      jpegSrcSet: jpegSrcSets[path],
      src: jpegFallbacks[path],
    },
  ])
);

export function getProductImage(slug) {
  return productImages[slug] ?? null;
}
