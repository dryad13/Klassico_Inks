/**
 * The four nozzles, in simulation UV — one per corner, all four aimed at the
 * "KLASSICO INKS" wordmark so the pigments converge on the headline.
 *
 * Aim is computed from each nozzle's LIVE position toward CONVERGENCE_TARGET
 * rather than stored as a fixed vector, so the drift in emitterPosition()
 * cannot slowly walk a stream off target.
 *
 * `swirl` adds a tangential component to that aim (positive = counterclockwise
 * around the target). Four jets fired straight at one point cancel and produce
 * a static symmetric knot; a tangential bias makes the convergence rotate and
 * keeps folding new pigment through itself instead.
 *
 * M's swirl is NEGATIVE while the other three are positive. With a uniform
 * sign, magenta's aim was rotated down-and-right — straight into the corridor
 * black travels up, so the two right-hand jets shared a path and magenta's
 * chroma swamped black's silhouette. Flipping it makes them diverge.
 *
 * `rate` scales dye injection per nozzle. Black runs hot (2.2) because it is
 * the one pigment that cannot compete on chroma: it removes light rather than
 * colouring it, so wherever it overlaps a chromatic plume the eye reads the
 * other pigment unless there is materially more black present. Real process
 * inks differ in tinting strength the same way, and carbon black is the
 * strongest of the four. It also needs the extra density for its own sake:
 * the rendered colour is medium * exp(-tau), so unless tau is high enough to
 * drive that near zero, the cool medium shows straight through the plume and
 * black reads blue.
 *
 * The two bottom nozzles fire upward against gravity, so they carry more
 * speed than the top pair — otherwise they stall short of the headline. They
 * also sit further in from their corners, so the bloom lands inside the frame
 * rather than being clipped by the bottom edge.
 *
 * Both must clear FLUID.drainHeight with room to spare. K sat at y 0.19
 * against a drain band of 0.18: anything that dipped even slightly was being
 * removed, so the black jet was fighting a sink the other three never touched.
 * Keep the bottom pair at matching heights unless there is a reason not to.
 *
 * `channel` indexes the dye target's CMYK components: each nozzle injects
 * into exactly one, and colour only appears later, in ink.frag's absorption
 * model. Nothing here is an RGB colour.
 *
 * Speeds are in UV per second and converted to the simulation's texel units
 * at injection — see emitterVelocity. They are much higher than the distance
 * to the target would suggest: a splat only adds momentum locally, and the
 * pressure projection immediately cancels most of a localised jet, so the
 * velocity that actually survives downstream is a fraction of what is
 * injected.
 */

// Centre of the headline type block, in UV with y up. Move this and all four
// streams re-aim together.
export const CONVERGENCE_TARGET = [0.5, 0.58];

export const EMITTERS = [
  // C — top left, M — top right, Y — bottom left, K — bottom right.
  { channel: 0, x: 0.15, y: 0.81, speed: 1.30, swirl:  0.09, rate: 1.00, freq: [0.70, 1.10], phase: 0.0 },
  { channel: 1, x: 0.86, y: 0.86, speed: 1.16, swirl: -0.10, rate: 0.85, freq: [0.53, 0.87], phase: 1.7 },
  { channel: 2, x: 0.17, y: 0.25, speed: 1.52, swirl:  0.11, rate: 1.00, freq: [0.61, 1.30], phase: 3.1 },
  { channel: 3, x: 0.85, y: 0.26, speed: 1.52, swirl:  0.08, rate: 2.20, freq: [0.44, 0.96], phase: 4.6 },
];

export const DRIFT_X = 0.018;
export const DRIFT_Y = 0.010;

/** Nozzle position at time `t`, including its slow aperiodic drift. */
export function emitterPosition(emitter, t) {
  return [
    emitter.x + Math.sin(t * emitter.freq[0] + emitter.phase) * DRIFT_X,
    emitter.y + Math.sin(t * emitter.freq[1] + emitter.phase * 0.7) * DRIFT_Y,
  ];
}

/**
 * Aim from a nozzle's current position at the convergence target, plus its
 * tangential swirl.
 *
 * The UV direction is scaled by the grid dimensions because advection moves
 * dye by `velocity * texelSize` — the two axes have different texel sizes, so
 * feeding a raw UV direction in would bend every stream away from its target
 * on any non-square viewport.
 */
export function emitterVelocity(emitter, position, simWidth, simHeight) {
  let dx = CONVERGENCE_TARGET[0] - position[0];
  let dy = CONVERGENCE_TARGET[1] - position[1];
  const distance = Math.hypot(dx, dy) || 1;
  dx /= distance;
  dy /= distance;

  const ax = dx - dy * emitter.swirl;
  const ay = dy + dx * emitter.swirl;
  const norm = Math.hypot(ax, ay) || 1;

  return [
    (ax / norm) * emitter.speed * simWidth,
    (ay / norm) * emitter.speed * simHeight,
  ];
}

/**
 * Injection strength over time. Continuous injection at load strength
 * saturates the dye buffer within ~10s: density climbs, exp(-tau) goes to
 * zero everywhere, and the hero becomes a black rectangle. This is the
 * failure mode most likely to reach production unnoticed, because it looks
 * correct for the first fifteen seconds of every dev reload.
 */
export const LIFECYCLE = { burstUntil: 2.5, settleUntil: 6.0, trickle: 0.42 };

export function emitterStrength(t) {
  if (t <= LIFECYCLE.burstUntil) return 1.0;
  if (t >= LIFECYCLE.settleUntil) return LIFECYCLE.trickle;
  const k = (t - LIFECYCLE.burstUntil) / (LIFECYCLE.settleUntil - LIFECYCLE.burstUntil);
  return 1.0 + (LIFECYCLE.trickle - 1.0) * (k * k * (3.0 - 2.0 * k));
}
