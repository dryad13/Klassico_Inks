import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import SEO from '../components/SEO';
import { faqData } from '../data/faq';

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div className="border border-slate-700 rounded-xl overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left bg-slate-800/50 hover:bg-slate-800 transition-colors"
    >
      <span className="font-bold text-white pr-4">{item.question}</span>
      <ChevronDown
        className={clsx('h-5 w-5 text-primary-500 shrink-0 transition-transform', isOpen && 'rotate-180')}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-700 pt-4">
            {item.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openId, setOpenId] = useState(faqData[0]?.id);

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <SEO
        title="FAQ"
        description="Frequently asked questions about Klassico Inks products, color matching, lead times, certifications, and technical support."
        path="/faq"
      />

      <div className="bg-slate-950 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <HelpCircle className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Answers to common questions about our inks, processes, and support.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
        {faqData.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}

        <div className="mt-12 p-8 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-slate-400 mb-6">Our technical team is ready to help.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
