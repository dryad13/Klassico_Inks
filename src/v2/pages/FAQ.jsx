import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import clsx from 'clsx';
import SEO from '../components/SEO';
import { PageHeader, Container, Button, Card, focusRing } from '../components/ui';
import { faqData } from '../../data/faq';

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div className="border border-ki-green/20 rounded-xl overflow-hidden bg-white">
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        'w-full flex items-center justify-between p-6 text-left hover:bg-ki-paper/80 transition-colors',
        focusRing,
        'focus-visible:ring-offset-ki-paper'
      )}
    >
      <span className="font-bold text-ki-ground pr-4">{item.question}</span>
      <ChevronDown
        className={clsx(
          'h-5 w-5 text-ki-orange shrink-0 transition-transform',
          isOpen && 'rotate-180'
        )}
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
          <div className="px-6 pb-6 text-slate-600 leading-[1.65] border-t border-ki-green/15 pt-4">
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
    <div className="min-h-screen bg-ki-paper pb-20" data-v2-tone="paper">
      <SEO
        title="FAQ"
        description="Frequently asked questions about Klassico Inks products, color matching, lead times, and technical support."
        path="/faq"
      />

      <PageHeader
        tone="paper"
        icon={HelpCircle}
        title="Frequently Asked Questions"
        description="Answers to common questions about our inks, processes, and support."
      />

      <Container className="max-w-3xl py-16 space-y-4">
        {faqData.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}

        <Card tone="paper" className="mt-12 p-8 text-center">
          <h3 className="text-xl font-bold text-ki-ground mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-6 leading-[1.65]">Our technical team is ready to help.</p>
          <Button to="/contact">Contact Us</Button>
        </Card>
      </Container>
    </div>
  );
};

export default FAQ;
