import { motion, useReducedMotion } from 'framer-motion';

// Four-corner CMYK fallback for no-WebGL. Each blob gets its own mutually-
// prime-ish duration and a multi-waypoint (not straight A→B) path, so the
// combined motion has no short, obvious loop — the CSS equivalent of
// aperiodic drift. Ported unchanged from the old Hero.jsx.
export default function PigmentField({ animated = false }) {
  const reduceMotion = useReducedMotion();
  const move = animated && !reduceMotion;

  return (
    <div className="absolute inset-0 overflow-hidden bg-ki-ground" aria-hidden="true">
      {move ? (
        <>
          <motion.div
            className="absolute -top-20 -left-20 h-[28rem] w-[28rem] rounded-full bg-cyan-500/50 blur-3xl"
            animate={{
              x: [0, 60, 110, 70, 140, 0],
              y: [0, 45, 30, 90, 60, 0],
              scale: [1, 0.92, 1.05, 0.85, 0.95, 1],
            }}
            transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -top-20 -right-20 h-[28rem] w-[28rem] rounded-full bg-ki-magenta/50 blur-3xl"
            animate={{
              x: [0, -55, -100, -60, -130, 0],
              y: [0, 50, 35, 95, 65, 0],
              scale: [1, 0.9, 1.08, 0.82, 0.98, 1],
            }}
            transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 h-[26rem] w-[26rem] rounded-full bg-ki-yellow/45 blur-3xl"
            animate={{
              x: [0, 65, 120, 75, 130, 0],
              y: [0, -40, -25, -85, -55, 0],
              scale: [1, 0.88, 1.06, 0.8, 0.97, 1],
            }}
            transition={{ duration: 29, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-[24rem] w-[24rem] rounded-full bg-black/50 blur-3xl"
            animate={{
              x: [0, -60, -105, -65, -115, 0],
              y: [0, -45, -30, -80, -50, 0],
              scale: [1, 0.9, 1.05, 0.85, 0.96, 1],
            }}
            transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut', delay: 4.5 }}
          />
        </>
      ) : (
        <>
          <div className="absolute -top-20 -left-20 h-[28rem] w-[28rem] rounded-full bg-cyan-500/45 blur-3xl" />
          <div className="absolute -top-20 -right-20 h-[28rem] w-[28rem] rounded-full bg-ki-magenta/45 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[26rem] w-[26rem] rounded-full bg-ki-yellow/40 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-[24rem] w-[24rem] rounded-full bg-black/45 blur-3xl" />
        </>
      )}
    </div>
  );
}
