import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { matchProducts } from '../utils/productMatcher';
import { trackEvent } from '../utils/analytics';

const SUBSTRATES = ['PET', 'BOPP', 'PE', 'Aluminum Foil', 'PVC', 'Paper'];
const APPLICATIONS = ['Lamination', 'Surface Print', 'Shrink Sleeve', 'Food Packaging'];
const OPTIONAL_FILTERS = ['Toluene-free', 'High Gloss'];

const SubstrateSelector = () => {
  const [substrate, setSubstrate] = useState('');
  const [application, setApplication] = useState('');
  const [filters, setFilters] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const results = showResults
    ? matchProducts({ substrate, application, optionalFilters: filters })
    : [];

  const toggleFilter = (filter) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleFind = () => {
    if (!substrate && !application) return;
    setShowResults(true);
    trackEvent('substrate_selector_complete', { substrate, application, filters: filters.join(',') });
  };

  const handleReset = () => {
    setSubstrate('');
    setApplication('');
    setFilters([]);
    setShowResults(false);
  };

  return (
    <section className="mb-12 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-primary-500" />
        <h2 className="text-2xl font-bold font-heading text-white">Ink Selector</h2>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Find the right ink series for your substrate and application.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">1. Substrate</label>
          <div className="flex flex-wrap gap-2">
            {SUBSTRATES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setSubstrate(s); setShowResults(false); }}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  substrate === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">2. Application</label>
          <div className="flex flex-wrap gap-2">
            {APPLICATIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => { setApplication(a); setShowResults(false); }}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  application === a
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-3">3. Optional Filters</label>
          <div className="flex flex-wrap gap-2">
            {OPTIONAL_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => { toggleFilter(f); setShowResults(false); }}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  filters.includes(f)
                    ? 'bg-secondary-500/30 text-primary-400 border border-primary-500/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleFind}
            disabled={!substrate && !application}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            Find Matching Inks <ChevronRight className="h-4 w-4" />
          </button>
          {(substrate || application || filters.length > 0) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 pt-8 border-t border-slate-700"
        >
          {results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-400 mb-4">
                {results.length} matching product{results.length !== 1 ? 's' : ''} found:
              </p>
              {results.map((product) => (
                <Link
                  key={product.slug}
                  to={`/products/${product.slug}`}
                  className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700 hover:border-primary-500/50 transition-colors group"
                >
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-400">{product.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-primary-500 shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-4">
              No exact matches found.{' '}
              <Link to="/contact" className="text-primary-400 hover:underline">
                Contact our technical team
              </Link>{' '}
              for a custom recommendation.
            </p>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default SubstrateSelector;
