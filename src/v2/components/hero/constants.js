// Text entrance choreography (ported from the old Hero.jsx, unchanged)
export const BASE_DELAY = 1.2;
export const EXPO_OUT = [0.16, 1, 0.3, 1];

/**
 * Hero phases, in seconds from mount. The simulation runs continuously
 * underneath and never ends — the timeline only modulates emitter strength,
 * opacity, and camera. See docs/hero-fluid-spec.md section 7.
 */
export const TIMELINE = {
  fadeIn: [0.0, 1.4],
  establish: [0.0, 2.5],
  disperse: [2.5, 6.0],
};

/**
 * Simulation tuning. Dissipation values are per-frame multipliers at 60fps,
 * converted to a framerate-independent decay in FluidSimulation.update().
 *
 * curlStrength is the highest-leverage number here: below ~15 the plumes fall
 * as smooth sheets, above ~40 they shred into noise within a second. Tune it
 * before touching anything else, and never trade it away for performance.
 *
 * gravity is NEGATIVE — pigment is denser than the medium, so plumes drift
 * down. Flipping the sign gives smoke buoyancy and rising mushroom clouds.
 * Kept small since two of the four nozzles fire upward from the bottom
 * corners: gravity acts on all pigment everywhere, so a strong value pins
 * those two to the bottom edge as a smear instead of letting them bloom.
 *
 * Velocity is in simulation texels per second (advection multiplies by
 * texel size), which is why these read large next to the UV-space radii.
 */
export const FLUID = {
  velocityDissipation: 0.9955,
  dyeDissipation: 0.997,
  // Lowered for the jet look: high curl shreds the stream into turbulence
  // immediately, so the coherent core never forms. A real jet holds together
  // for a while and breaks up downstream — that contrast is the whole read.
  curlStrength: 21,
  gravity: -11,

  // Squared-distance falloff, NOT a radius in UV — exp(-d*d / r), so these are
  // much smaller numbers than they look. The dye nozzle in particular has to
  // be tiny: a wide soft gaussian injects a blob that no amount of vorticity
  // can ever sharpen into a filament, which is the single most common way
  // this effect ends up looking like coloured fog.
  splatRadius: 0.0004,
  dyeSplatRadius: 0.00012,

  // Peak density at the nozzle settles near rate * dt, because advection
  // sweeps roughly a nozzle-width of dye away every frame.
  //
  // This scales INVERSELY with dyeElongation: stretching the splat multiplies
  // the injected area by roughly that factor, so a rate tuned for a round
  // nozzle floods the field once the nozzle becomes a ribbon. 150 at
  // elongation 1 became soup at elongation 4.5.
  dyeRate: 42,

  // How far each splat is stretched along its own aim. This is the difference
  // between a jet and a bloom: a round splat is a point source of momentum,
  // and in incompressible flow that spreads radially and recirculates rather
  // than travelling. The dye ribbon is shorter than the momentum jet driving
  // it, so pigment rides a stream that is already moving.
  jetElongation: 7.5,
  dyeElongation: 4.5,

  pointerForce: 260,
  pointerRadius: 0.0025,

  // Anti-pooling. Gravity tapers to zero below `floorFade` so it stops
  // pressing settled ink into the bottom edge, and dye inside `drainHeight`
  // decays faster so anything that does reach the floor clears instead of
  // building into sludge. Together these stop the two upward-firing nozzles
  // from ending up as a band along the bottom of the frame.
  floorFade: 0.34,
  drainHeight: 0.18,
  drainStrength: 0.05,
};

/**
 * Quality tiers. Pressure iterations go first when downgrading, then dye
 * resolution. Simulation resolution and curl strength are last resorts —
 * they are the look, not the polish.
 */
export const TIERS = {
  desktop: { simRes: 192, dyeRes: 1024, pressureIterations: 24, maxDpr: 1.75 },
  laptop: { simRes: 160, dyeRes: 768, pressureIterations: 16, maxDpr: 1.5 },
  mobile: { simRes: 128, dyeRes: 512, pressureIterations: 10, maxDpr: 1 },
};

export const TIER_ORDER = ['desktop', 'laptop', 'mobile'];

// Ink presentation. deep/tank define the backlit medium the pigment absorbs
// light from — subtractive ink on a flat dark ground is invisible by
// definition, so the tank is what makes the colour read at all.
// A strongly tinted backlight caps which hues the pigment can reach: against a
// saturated teal tank the yellow channel has almost no red to transmit and
// reads olive. Keeping the medium cool but fairly desaturated lets all four
// pigments show their own colour.
export const INK = {
  deepColor: '#080f18',
  tankColor: '#5d7c88',
  // Near-neutral on purpose. The hue of scattered light comes from
  // scatterHue (the local pigment), so any tint here is added to EVERY plume
  // — a cool blue-white version of this was lighting the black jet blue and
  // making it read as a violet shadow rather than as ink.
  scatterColor: '#dee2e5',
  density: 1.0,
  parallax: 0.055,
  legibility: 0.5,

  // Edge shaping applied to sampled density before absorption. `floor` clears
  // the low-density haze that semi-Lagrangian advection smears everywhere,
  // `gamma` steepens the falloff so plume boundaries are defined. Without
  // these the sim is physically fine and visually mush.
  floor: 0.012,
  gamma: 1.25,

  // Chroma lift applied after absorption. 1.0 is physically neutral; the
  // medium is a coloured backlight that desaturates every pigment on the way
  // out, so a little above 1 restores what the tank takes.
  saturation: 1.4,

  // Coloured light the jets spill onto the headline block. See uInkLight in
  // ink.frag — this is the in-canvas half; the glyphs themselves are lit by
  // the probe in FluidSimulation.readInkLight().
  inkLight: 0.22,
};

/**
 * Post chain. Deliberately NOT an EffectComposer: the scene is already a
 * single fullscreen quad, so a composer would render the same pixels twice to
 * apply effects that cost a handful of instructions inline. Everything here
 * runs at the end of ink.frag.
 *
 * No bloom, per docs/hero-fluid-spec.md §1.5 — ink absorbs light, and bloom
 * inverts that reading. `sharpen` is the one that matters most; it is an
 * unsharp mask on optical depth, which is what recovers the filament edges
 * semi-Lagrangian advection smears away.
 */
export const POST = {
  sharpen: 0.85,
  aberration: 0.004,
  vignette: 0.4,
  filmic: 0.22,
  grain: 1.0,
};

export const CAMERA = { fov: 35, near: 0.1, far: 100, z: 7.0, zScrolled: 5.6 };
