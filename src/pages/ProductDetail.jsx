import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Download, ChevronRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { getProductBySlug } from '../data/products';
import { trackEvent } from '../utils/analytics';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

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

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <SEO
        title={product.name}
        description={product.description}
        path={`/products/${product.slug}`}
        type="product"
      />

      <div className="bg-slate-950 py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/products" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{product.name}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-primary-400 border border-slate-700">
                {product.category.toUpperCase()}
              </span>
              {product.tag && (
                <span className="bg-secondary-500/20 text-primary-400 text-xs font-bold px-3 py-1 rounded-full border border-secondary-500/20">
                  {product.tag}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
              {product.name}
            </h1>
            <p className="text-slate-400 text-lg max-w-3xl">{product.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-xl font-bold font-heading text-white mb-4">Key Features</h2>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-slate-300">
                    <Check className="h-5 w-5 text-cyan-500 mr-3 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-white mb-4">Applications</h2>
              <div className="flex flex-wrap gap-2">
                {product.applications.map((app) => (
                  <span
                    key={app}
                    className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-white mb-4">Compatible Substrates</h2>
              <div className="flex flex-wrap gap-2">
                {product.substrates.map((s) => (
                  <span
                    key={s}
                    className="px-4 py-2 bg-primary-500/10 rounded-lg text-sm text-primary-400 border border-primary-500/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold font-heading text-white mb-4">Technical Specifications</h2>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? 'bg-slate-800/30' : ''}
                      >
                        <td className="px-6 py-4 text-slate-400 capitalize font-medium w-1/3">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="px-6 py-4 text-white">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 sticky top-24">
              <h3 className="font-bold text-white mb-4">Downloads</h3>
              <div className="space-y-3">
                {product.tdsUrl ? (
                  <a
                    href={product.tdsUrl}
                    download
                    onClick={handleTdsClick}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-900 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="h-5 w-5 text-primary-500" />
                    Download TDS
                  </a>
                ) : (
                  <Link
                    to={`/contact?intent=quote&product=${product.slug}`}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-900 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="h-5 w-5 text-primary-500" />
                    Request TDS
                  </Link>
                )}
                {product.sdsUrl ? (
                  <a
                    href={product.sdsUrl}
                    download
                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-900 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="h-5 w-5 text-primary-500" />
                    Download SDS
                  </a>
                ) : (
                  <Link
                    to={`/contact?intent=quote&product=${product.slug}&doc=sds`}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-slate-900 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <Download className="h-5 w-5 text-primary-500" />
                    Request SDS
                  </Link>
                )}
              </div>

              <Link
                to={`/contact?intent=quote&product=${product.slug}`}
                className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold transition-colors"
              >
                Request Quote for this Product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
