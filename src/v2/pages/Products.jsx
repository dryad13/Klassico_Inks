import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';
import clsx from 'clsx';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { PageHeader, Container, focusRing } from '../components/ui';
import { productsData, categories } from '../../data/products';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(
    categoryParam && categories.some((c) => c.id === categoryParam) ? categoryParam : 'all'
  );

  useEffect(() => {
    if (categoryParam && categories.some((c) => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return productsData;
    return productsData.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-ki-paper pb-20" data-v2-tone="paper">
      <SEO
        title="Products"
        description="Klassico Inks product catalog — ink series, processes, solvents, and printing ink industry products."
        path="/products"
      />

      <PageHeader
        tone="paper"
        title="Product Catalog"
        description="Ink series, ink processes, solvents & blends, and printing ink industry products — pigments, titanium dioxide, resins, nitrocellulose, and solvent dyes."
      />

      <div className="sticky top-16 z-40 bg-ki-paper/95 backdrop-blur border-b border-ki-green/15 shadow-sm">
        <Container>
          <div className="flex overflow-x-auto space-x-2 py-4 no-scrollbar justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  focusRing,
                  'focus-visible:ring-offset-ki-paper',
                  activeCategory === cat.id
                    ? 'bg-ki-orange text-ki-ground shadow-lg shadow-ki-orange/25'
                    : 'bg-white text-slate-600 border border-ki-green/15 hover:border-ki-orange/40 hover:text-ki-ground'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard product={product} tone="paper" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No products found in this category.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Products;
