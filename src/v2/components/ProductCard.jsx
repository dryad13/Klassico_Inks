import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import { getCategoryLabel } from '../../data/products';
import { getProductImage } from '../../assets/products';
import ProductImage from './ProductImage';
import { getProductIcon } from '../../utils/productIcons';
import { focusRing } from './ui';

/**
 * Product card with full end-market / grade lists (creative-direction Phase 6).
 * Grade codes render in mono.
 */
const ProductCard = ({ product, tone = 'paper' }) => {
  const isPaper = tone === 'paper';
  const imageSrc = getProductImage(product.slug);
  const ProductIcon = getProductIcon(product);
  const list = product.applications?.length
    ? product.applications
    : product.items?.length
      ? product.items
      : [];
  const listLabel = product.items?.length && !product.applications?.length ? 'Grades' : 'End markets';
  const useMono = Boolean(product.items?.length && !product.applications?.length);

  return (
    <Link
      to={`/products/${product.slug}`}
      className={clsx(
        'block rounded-2xl border overflow-hidden h-full group transition-colors',
        focusRing,
        isPaper
          ? 'bg-white border-ki-green/15 hover:border-ki-orange/50 focus-visible:ring-offset-ki-paper'
          : 'bg-slate-800/50 border-slate-700 hover:border-ki-orange/50 focus-visible:ring-offset-ki-ground'
      )}
    >
      <div
        className={clsx(
          'h-48 relative overflow-hidden flex items-center justify-center',
          isPaper ? 'bg-slate-100' : 'bg-slate-800'
        )}
      >
        {imageSrc ? (
          <ProductImage
            image={imageSrc}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-ki-ground to-ki-green/40" />
            <ProductIcon
              className="h-16 w-16 text-slate-500 group-hover:text-ki-orange/70 transition-colors"
              aria-hidden="true"
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ki-ground/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 bg-ki-ground/85 backdrop-blur px-3 py-1 rounded-lg text-xs font-mono text-ki-orange border border-slate-700 max-w-[85%] truncate">
          {getCategoryLabel(product.category)}
        </div>
      </div>

      <div className="p-6">
        <h3
          className={clsx(
            'text-xl font-bold font-heading mb-2 transition-colors group-hover:text-ki-orange',
            isPaper ? 'text-ki-ground' : 'text-white'
          )}
        >
          {product.name}
        </h3>
        <p
          className={clsx(
            'text-sm mb-5 leading-[1.65]',
            isPaper ? 'text-slate-600' : 'text-slate-300'
          )}
        >
          {product.description}
        </p>

        {list.length > 0 && (
          <div className="space-y-3">
            <h4
              className={clsx(
                'text-xs font-bold uppercase tracking-wider',
                isPaper ? 'text-ki-green' : 'text-slate-500'
              )}
            >
              {listLabel}
            </h4>
            <ul className="space-y-2">
              {list.map((item) => (
                <li
                  key={item}
                  className={clsx(
                    'flex items-start text-sm',
                    useMono && 'font-mono text-[13px]',
                    isPaper ? 'text-slate-700' : 'text-slate-300'
                  )}
                >
                  <Check
                    className="h-4 w-4 text-ki-orange mr-2 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
