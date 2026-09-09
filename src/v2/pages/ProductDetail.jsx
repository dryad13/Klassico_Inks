import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Download, ChevronRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { Container, Button, Card, focusRing } from '../components/ui';
import { getProductBySlug, getCategoryLabel } from '../../data/products';
import { getProductImage } from '../../assets/products';
import ProductImage from '../components/ProductImage';
import { trackEvent } from '../../utils/analytics';
import clsx from 'clsx';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const imageSrc = product ? getProductImage(product.slug) : null;

  useEffect(() => {
    if (product) {
      trackEvent('product_view', { product: product.slug });
    }
  }, [product]);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const handleTdsClick = () => {
    if (product.tdsUrl) {
      trackEvent('tds_download', { product: product.slug });
    }
  };

  const hasApplications = product.applications?.length > 0;
  const hasItems = product.items?.length > 0;
  const hasProcess = Boolean(product.process || product.printMode);
  const hasStructures = product.structures?.length > 0;
  const hasSubstrates = product.substrates?.length > 0;
  const hasNotes = product.notes?.length > 0;

  const sideLink = clsx(
    'flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition-colors',
    'bg-white border-ki-green/15 text-slate-700 hover:border-ki-orange/40 hover:text-ki-ground',
    focusRing,
    'focus-visible:ring-offset-ki-paper'
  );

  return (
    <div className="min-h-screen bg-ki-paper pb-20" data-v2-tone="paper">
      <SEO
        title={product.name}
        description={product.description}
        path={`/products/${product.slug}`}
      />

      <div className="bg-ki-paper py-12 border-b border-ki-green/15">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link
              to="/products"
              className={clsx(
                'hover:text-ki-ground transition-colors flex items-center gap-1 rounded',
                focusRing,
                'focus-visible:ring-offset-ki-paper'
              )}
            >
              <ArrowLeft className="h-4 w-4" /> Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-ki-ground">{product.name}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-white px-3 py-1 rounded-lg text-xs font-mono text-ki-orange border border-ki-green/20">
                {getCategoryLabel(product.category)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-ki-ground mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-slate-600 text-lg max-w-3xl leading-[1.65]">{product.description}</p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {imageSrc && (
              <div className="rounded-2xl overflow-hidden border border-ki-green/15 aspect-video bg-white">
                <ProductImage
                  image={imageSrc}
                  alt={`${product.name} — application creative`}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {hasProcess && (
              <section>
                <h2 className="text-xl font-bold font-heading text-ki-ground mb-4">Process</h2>
                <p className="text-slate-700 leading-[1.65] mb-5">
                  {[product.process, product.printMode].filter(Boolean).join(' · ')}
                </p>

                {hasStructures && (
                  <div className="mb-5">
                    <p className="text-sm font-medium text-ki-green uppercase tracking-[0.14em] mb-3">
                      Structures
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.structures.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 bg-white rounded-lg text-sm font-mono text-slate-700 border border-ki-green/15"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasSubstrates && (
                  <div className="mb-5">
                    <p className="text-sm font-medium text-ki-green uppercase tracking-[0.14em] mb-3">
                      Substrates
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.substrates.map((item) => (
                        <span
                          key={item}
                          className="px-3 py-1.5 bg-white rounded-lg text-sm font-mono text-slate-700 border border-ki-green/15"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasNotes && (
                  <ul className="space-y-2">
                    {product.notes.map((note) => (
                      <li
                        key={note}
                        className="flex items-start text-slate-700 text-sm leading-[1.65]"
                      >
                        <Check
                          className="h-5 w-5 text-ki-orange mr-3 mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {hasItems && (
              <section>
                <h2 className="text-xl font-bold font-heading text-ki-ground mb-4">
                  Available Grades
                </h2>
                <ul className="space-y-3">
                  {product.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start text-slate-700 font-mono text-sm"
                    >
                      <Check
                        className="h-5 w-5 text-ki-orange mr-3 mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {hasApplications && (
              <section>
                <h2 className="text-xl font-bold font-heading text-ki-ground mb-4">Applications</h2>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app) => (
                    <span
                      key={app}
                      className="px-4 py-2 bg-white rounded-lg text-sm text-slate-700 border border-ki-green/15"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <Card tone="paper" className="p-6 sticky top-24">
              <h3 className="font-bold text-ki-ground mb-4">Downloads</h3>
              <div className="space-y-3">
                {product.tdsUrl ? (
                  <a href={product.tdsUrl} download onClick={handleTdsClick} className={sideLink}>
                    <Download className="h-5 w-5 text-ki-orange" />
                    Download TDS
                  </a>
                ) : (
                  <Link to={`/contact?intent=quote&product=${product.slug}`} className={sideLink}>
                    <Download className="h-5 w-5 text-ki-orange" />
                    Request TDS
                  </Link>
                )}
                {product.sdsUrl ? (
                  <a href={product.sdsUrl} download className={sideLink}>
                    <Download className="h-5 w-5 text-ki-orange" />
                    Download SDS
                  </a>
                ) : (
                  <Link
                    to={`/contact?intent=quote&product=${product.slug}&doc=sds`}
                    className={sideLink}
                  >
                    <Download className="h-5 w-5 text-ki-orange" />
                    Request SDS
                  </Link>
                )}
              </div>

              <Button to={`/contact?intent=quote&product=${product.slug}`} className="mt-6 w-full">
                Request Quote for this Product
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
