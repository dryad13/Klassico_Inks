import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TIMELINE } from '../constants';
import { LIFECYCLE } from '../fluid/InkEmitters';

const dur = (window_) => window_[1] - window_[0];

/**
 * Mount-triggered GSAP timeline driving a plain object — not React state.
 * It is read every frame inside useFrame and mutated by tweens, so putting it
 * in state would re-render the tree sixty times a second to no purpose.
 *
 * There is no end state and no halftone resolve: the timeline hands off to a
 * continuously running simulation. No ScrollTrigger either — this project
 * does not scroll-hijack the hero, see docs/hero-spec.md.
 */
export default function useHeroTimeline(reducedMotion) {
  const heroStateRef = useRef({
    opacity: 0,
    emitterStrength: 1,
    scrollProgress: 0,
  });

  useEffect(() => {
    const heroState = heroStateRef.current;
    const tl = gsap.timeline({ paused: true });

    tl.to(
      heroState,
      { opacity: 1, duration: dur(TIMELINE.fadeIn), ease: 'power2.out' },
      TIMELINE.fadeIn[0]
    );

    // Establishing burst holds, then eases down to a trickle that balances
    // dye dissipation. Too low and the field drains to haze after ~10s; too
    // high and it saturates to black. The level lives in InkEmitters.LIFECYCLE
    // so this and the non-timeline path cannot drift apart.
    tl.to(
      heroState,
      { emitterStrength: LIFECYCLE.trickle, duration: dur(TIMELINE.disperse), ease: 'power2.inOut' },
      TIMELINE.disperse[0]
    );

    if (reducedMotion) tl.progress(1);
    else tl.play(0);

    return () => tl.kill();
  }, [reducedMotion]);

  return heroStateRef;
}
