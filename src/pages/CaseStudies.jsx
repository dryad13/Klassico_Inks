import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import SEO from '../components/SEO';
import { caseStudiesData } from '../data/caseStudies';

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <SEO
        title="Case Studies"
        description="Real-world success stories from Klassico Inks clients in food packaging, pharmaceuticals, and flexible packaging."
        path="/case-studies"
      />

      <div className="bg-slate-950 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <TrendingUp className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
              Case Studies
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              How Klassico Inks helps packaging printers solve real production challenges.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudiesData.map((study, idx) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-700">
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                  {study.industry}
                </span>
                <h2 className="text-xl font-bold font-heading text-white mt-2 mb-1">
                  {study.title}
                </h2>
                <p className="text-sm text-slate-500">{study.client}</p>
              </div>

              <div className="p-6 flex-grow space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Challenge
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{study.challenge}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Solution
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{study.solution}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">
                    Result
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">{study.result}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/products/${study.productSlug}`}
                  className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View Product Series <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-6">Facing a similar challenge? Let us help.</p>
          <Link
            to="/contact?intent=quote"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold transition-colors"
          >
            Get a Quote <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
