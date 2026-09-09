import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { TIERS } from '../constants';

/**
 * Starting quality tier. Deliberately coarse — the real decision is made by
 * measurement at runtime (see useAdaptiveQuality), because user-agent sniffing
 * cannot tell a current laptop from a five-year-old one and both report the
 * same viewport.
 */
export default function useHeroQualityTier() {
  const reducedMotion = useReducedMotion();

  const [tier] = useState(() => {
    if (typeof window === 'undefined') return 'mobile';
    if (window.matchMedia('(max-width: 768px)').matches) return 'mobile';
    const cores = navigator.hardwareConcurrency || 4;
    return cores >= 8 && window.innerWidth >= 1280 ? 'desktop' : 'laptop';
  });

  return {
    tier,
    reducedMotion: !!reducedMotion,
    ...TIERS[tier],
  };
}
