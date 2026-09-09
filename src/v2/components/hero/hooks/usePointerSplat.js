import { useEffect, useRef } from 'react';

/**
 * Pointer momentum into the velocity field. Velocity only — never dye: if the
 * cursor injected pigment, a visitor could paint the hero solid black in about
 * four seconds. The cursor stirs the water, it does not add ink.
 *
 * Listens on the canvas element rather than through R3F's pointer state so it
 * still receives moves while the HTML copy sits on top with pointer events.
 */
export default function usePointerSplat(simulationRef, { enabled, force, radius }) {
  const last = useRef(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const onMove = (event) => {
      const sim = simulationRef.current;
      if (!sim) return;

      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;

      if (last.current) {
        const dx = (x - last.current.x) * force;
        const dy = (y - last.current.y) * force;
        if (dx || dy) sim.splatVelocity(x, y, dx, dy, radius);
      }
      last.current = { x, y };
    };

    const onLeave = () => {
      last.current = null;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [simulationRef, enabled, force, radius]);
}
