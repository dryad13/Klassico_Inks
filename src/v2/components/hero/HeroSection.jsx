import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { supportsFluidHero } from '../../utils/webgl';
import useHeroQualityTier from './hooks/useHeroQualityTier';
import PigmentField from './PigmentField';
import GrainOverlay from './GrainOverlay';
import HeroContent from './HeroContent';

// three.js + @react-three + gsap reach ~217kB gzip and are only ever executed
// by the fluid simulation. Loading them lazily keeps them off the critical path
// entirely for reduced-motion users and devices that fail the WebGL2 check —
// they now cost those visitors nothing, rather than being downloaded and parsed
// only to be skipped at render time.
const HeroCanvasBoundary = lazy(() => import('./HeroCanvasBoundary'));

/**
 * Single-viewport hero: a GPU fluid simulation dispersing four CMYK inks
 * behind static copy. See docs/hero-fluid-spec.md.
 *
 * Reduced motion falls back to PigmentField rather than a paused simulation —
 * a frozen fluid field has no meaningful still state, it is just a smear.
 */
export default function HeroSection() {
  const quality = useHeroQualityTier();
  const [canRunFluid] = useState(() => supportsFluidHero());

  // The simulation writes --ink-light-* onto this element every few frames, so
  // the headline picks up the colour of whichever jet is nearest. Custom
  // properties inherit, so setting them here reaches HeroContent's type
  // without re-rendering React at 60fps.
  const sectionRef = useRef(null);

  // The simulation is a full GPU fluid solve every frame, and the hero is only
  // one viewport tall. Without this it keeps running once the visitor scrolls
  // into the page — burning battery and stealing frames from the scroll itself,
  // which is most of the cost on a phone. Also stops on a hidden tab, where
  // rAF throttling alone still leaves work queued.
  const [active, setActive] = useState(true);
  // Set when the simulation measures itself as unplayable on the lowest tier.
  const [gaveUp, setGaveUp] = useState(false);

  const useFallback = !canRunFluid || quality.reducedMotion || gaveUp;

  useEffect(() => {
    if (useFallback) return undefined;
    const el = sectionRef.current;
    if (!el) return undefined;

    let onScreen = true;
    const sync = () => setActive(onScreen && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    observer.observe(el);
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [useFallback]);

  return (
    <section ref={sectionRef} className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-ki-ground">
      {useFallback ? (
        <PigmentField animated={!quality.reducedMotion} />
      ) : (
        <Suspense fallback={<PigmentField animated={!quality.reducedMotion} />}>
          <HeroCanvasBoundary
            quality={quality}
            lightTargetRef={sectionRef}
            active={active}
            onUnplayable={() => setGaveUp(true)}
          />
        </Suspense>
      )}

      {/* Scrim only at the bottom so ink stays visible behind the headline */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-transparent to-ki-ground/80 pointer-events-none" />
      <GrainOverlay />

      <HeroContent />
    </section>
  );
}
