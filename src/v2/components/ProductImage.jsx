/**
 * Renders a product creative as WebP with a JPEG fallback.
 *
 * `sizes` must describe the rendered width at each breakpoint or the browser
 * will assume 100vw and pull the largest variant into a small card.
 */
export default function ProductImage({ image, alt = '', className, sizes, priority = false }) {
  if (!image) return null;

  return (
    <picture>
      <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />
      <source type="image/jpeg" srcSet={image.jpegSrcSet} sizes={sizes} />
      <img
        src={image.src}
        alt={alt}
        className={className}
        width={1600}
        height={900}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
