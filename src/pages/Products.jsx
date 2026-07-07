import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Droplet, Package, Check } from 'lucide-react';
import clsx from 'clsx';

const productsData = [
  {
    id: 'lam-series',
    name: 'LAM / H-LAM Series',
    category: 'rotogravure',
    description: 'High-performance inks designed for general lamination applications on treated films.',
    features: ['Excellent bonding strength', 'Low solvent retention', 'Vibrant color reproduction'],
    applications: ['Snack packaging', 'General lamination']
  },
  {
    id: 'super-series',
    name: 'SUPER Series',
    category: 'rotogravure',
    description: 'Toluene-free inks specifically engineered for reverse gravure lamination on flexible films.',
    features: ['Toluene-free formulation', 'Eco-friendly profile', 'Superior printability on PET/BOPP'],
    tag: 'Eco-Friendly',
    applications: ['Food packaging', 'Pharmaceuticals']
  },
  {
    id: 'surface-series',
    name: 'GLITZ / PEL / KPI Series',
    category: 'rotogravure',
    description: 'Specialized surface printing inks for high-gloss and scuff-resistant finishes.',
    features: ['High gloss', 'Excellent rub resistance', 'Good tape adhesion'],
    applications: ['Shopping bags', 'Twist wrappers', 'Labels']
  },
  {
    id: 'peak-series',
    name: 'PEAK Series',
    category: 'flexographic',
    description: 'Premium flexographic inks for surface printing on Polyethylene and Polypropylene films.',
    features: ['High gloss finish', 'Fat & Oil resistance', 'Heat resistant', 'Excellent scratch resistance'],
    tag: 'Premium',
    applications: ['Milk pouches', 'Oil packaging', 'Frozen food']
  },
  {
    id: 'pivotal-series',
    name: 'PIVOTAL Series',
    category: 'flexographic',
    description: 'Polyamide-based inks designed for high-quality polyethylene bags.',
    features: ['Excellent ink transfer', 'High gloss', 'Superior adhesion'],
    applications: ['Heavy duty bags', 'Shopping bags']
  },
  {
    id: 'pvc-series',
    name: 'PVC Series',
    category: 'specialty',
    description: 'Specialized inks for shrink sleeves and twist PVC applications.',
    features: ['High shrinkability', 'Vibrant colors', 'Chemical resistance'],
    applications: ['Beverage labels', 'Confectionery wrappers']
  }
];

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'rotogravure', label: 'Rotogravure' },
  { id: 'flexographic', label: 'Flexographic' },
  { id: 'specialty', label: 'Specialty & Others' }
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return productsData;
    return productsData.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-950 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white"
          >
            Product Catalog
          </motion.h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore our comprehensive range of high-quality industrial inks designed for every substrate and application using the latest color technology.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-2 py-4 no-scrollbar justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-primary-500/50 transition-colors group"
              >
                <div className="h-48 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-secondary-900" />
                  <Droplet className="h-16 w-16 text-slate-700 group-hover:text-primary-500/50 transition-colors duration-500" />
                  {product.tag && (
                    <span className="absolute top-4 right-4 bg-secondary-500/20 text-primary-400 text-xs font-bold px-3 py-1 rounded-full border border-secondary-500/20">
                      {product.tag}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-mono text-primary-400 border border-slate-700">
                    {product.category.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-primary-400 transition-colors">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Features</h4>
                    <ul className="space-y-2">
                       {product.features.map((feature, idx) => (
                         <li key={idx} className="flex items-start text-sm text-slate-300">
                           <Check className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 shrink-0" />
                           {feature}
                         </li>
                       ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
