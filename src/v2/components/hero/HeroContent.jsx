import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui';
import { trackEvent } from '../../../utils/analytics';
import { BASE_DELAY, EXPO_OUT } from './constants';

// Ported unchanged from the old Hero.jsx.
function HeroCtas() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button
        to="/products"
        onClick={() => trackEvent('cta_products_click', { location: 'hero' })}
      >
        View Products <ArrowRight className="h-5 w-5" />
      </Button>
      <Button
        to="/contact?intent=quote"
        variant="ghost"
        onClick={() => trackEvent('cta_quote_click', { location: 'hero' })}
      >
        Contact Sales
      </Button>
    </div>
  );
}

/**
 * Light cast onto the glyphs by whichever jet is nearest, driven by
 * --ink-light-color / --ink-light-strength which FluidScene writes onto the
 * hero <section> every few frames. The fallbacks matter: the CSS fallback path
 * (no WebGL, reduced motion) never sets these, and an unresolved var would
 * drop the whole text-shadow.
 */
const inkLitText = {
  textShadow: [
    '0 0 calc(38px * var(--ink-light-strength, 0)) var(--ink-light-color, transparent)',
    '0 0 calc(90px * var(--ink-light-strength, 0)) var(--ink-light-color, transparent)',
  ].join(', '),
};

/** Text overlay — HTML, not WebGL, so it stays SEO/accessibility-friendly. */
export default function HeroContent() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative z-10 px-4 py-20 w-full max-w-5xl mx-auto text-center">
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { delay: BASE_DELAY - 0.08, duration: 0.45, ease: EXPO_OUT }}
        className="text-sm md:text-base font-medium text-ki-yellow uppercase tracking-[0.18em] mb-5"
      >
        Bringing colour to life.
      </motion.p>

      <h1
        className="font-heading font-bold uppercase tracking-tight text-white leading-[0.92] mb-5"
        style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)', ...inkLitText }}
      >
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: BASE_DELAY, duration: 0.6, ease: EXPO_OUT }}
          className="inline-block"
        >
          Klassico
        </motion.span>{' '}
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: BASE_DELAY + 0.08, duration: 0.6, ease: EXPO_OUT }}
          className="inline-block text-ki-orange"
        >
          Inks
        </motion.span>
      </h1>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { delay: BASE_DELAY + 0.32, duration: 0.55 }}
        className="font-heading font-bold uppercase tracking-tight text-white leading-[1.05] mb-6"
        style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.25rem)', ...inkLitText }}
      >
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, filter: 'blur(10px)', color: '#94a3b8' }}
          animate={{ opacity: 1, filter: 'blur(0px)', color: '#FAE100' }}
          transition={
            reduceMotion ? { duration: 0 } : { delay: BASE_DELAY + 0.55, duration: 1.1, ease: 'easeOut' }
          }
          className="inline-block"
        >
          Colour
        </motion.span>{' '}
        that holds on the pack.
      </motion.p>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { delay: BASE_DELAY + 0.42, duration: 0.5 }}
      >
        <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-[1.65] mb-4">
          Rotogravure, flexographic, water-based, and offset inks — matched to your substrate
          and end market.
        </p>

        <p className="font-mono text-xs md:text-sm text-slate-400 tracking-wide mb-10">
          Seven series · one for every pack
        </p>

        <HeroCtas />
      </motion.div>
    </div>
  );
}
