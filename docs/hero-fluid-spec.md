# Hero — CMYK Ink Dispersion (Fluid Rebuild)

Supersedes the blob-mesh portion of `docs/hero-spec.md`. The stacking-order, fallback,
and no-scroll-hijack rules in that document still apply and are restated in §9.

---

## 0. Why the current hero doesn't look right

`scene/InkBlob.jsx` builds four `icosahedronGeometry` meshes, displaces their vertices with
noise, and shades them with Fresnel + specular. That is a **surface** pipeline:

```
polygon → material → transparency        →  glass / jelly / gel caps
```

Ink in water is not a surface. It has no boundary, no normal, no specular highlight. It is a
**density phenomenon** — pigment concentration transported by a moving medium:

```
velocity field → pigment density → light absorption   →  ink
```

No amount of tuning `uFresnelPower`, `uDisplacement`, or the noise octaves closes that gap,
because the gap is the pipeline, not the parameters. The meshes get deleted.

---

## 1. Corrections to the reference architecture

The GPU-fluid plan is right. The items below will otherwise produce a *fluid demo* rather
than *ink*. Each is cheap to get right up front and expensive to retrofit; §1.1 through §1.3
were each found by building it the other way first.

### 1.1 Dye must be subtractive, not additive — this is the big one

The reference stores dye as RGB and injects `[0,1,1]`, `[1,0,0.05]`, `[1,0.9,0]`, `[0,0,0]`.
Additively summed in RGB:

```
cyan + magenta + yellow  =  WHITE
```

That is backwards. It is why every "CMYK fluid" demo turns into a grey-white smear where the
plumes cross, and it is very likely the specific thing that reads as wrong to you now. Real
process ink is subtractive:

```
cyan + magenta + yellow  ≈  NEAR BLACK (registration black)
cyan + magenta           =  violet
cyan + yellow            =  green
magenta + yellow         =  red
```

So the dye render target does **not** store colour. It stores four **pigment densities**:

```
dyeRT.rgba  =  vec4(C, M, Y, K)     // concentration, 0..N, unbounded above 1
```

Each emitter injects into exactly one channel. The render pass converts density to colour
with Beer–Lambert absorption:

```glsl
vec4 d = texture2D(uDye, uv);                  // C, M, Y, K densities

// Per-pigment absorption coefficients (transmission spectra, in RGB)
const vec3 ABSORB_C = vec3(2.90, 0.20, 0.10);
const vec3 ABSORB_M = vec3(0.25, 2.70, 0.30);
const vec3 ABSORB_Y = vec3(0.10, 0.22, 3.00);
const vec3 ABSORB_K = vec3(2.30, 2.25, 2.15);

vec3 tau = d.r*ABSORB_C + d.g*ABSORB_M + d.b*ABSORB_Y + d.a*ABSORB_K;
vec3 transmission = exp(-tau);                 // 1 = clear water, 0 = opaque ink

float alpha = 1.0 - min(min(transmission.r, transmission.g), transmission.b);
vec3  rgb   = transmission;                    // composited over the ground below
```

Three things fall out of this for free, all of which the additive version has to fake:

- **Overlaps darken.** Where cyan crosses magenta you get violet, not a pale wash. Where all
  four cross you get a dense near-black core. That is the entire visual signature of process
  ink, and it is the part a viewer recognises without being able to name.
- **Thin edges stay saturated.** `exp(-x)` is steep near zero, so a wisp carrying 5% pigment is
  a clean pale cyan, not a washed grey. Additive blending greys out low densities.
- **Density has real headroom.** Concentration can go to 4.0 and just keeps getting darker
  instead of clipping to white at 1.0. Bright cores are the tell of an additive sim.

**Revised during build:** the original plan was to pull `ABSORB_*` toward brand colour
(`#136B43` green, `#E53693` magenta, `#FAE100` yellow). Built that way it looked wrong — a
cyan that also absorbs blue has nowhere clean to mix, so every overlap read olive and the
whole field turned into one muddy wash. The constants above are close to true process CMY
instead. Brand colour belongs in the medium, the type and the UI; the pigment has to behave
like pigment or the subtractive model buys nothing.

### 1.2 Chroma — where saturation is won and lost

The medium is a coloured backlight and the final colour is `medium * transmission`, so every
pigment hue is multiplied by the tank on the way out and loses chroma. Three levers, in the
order worth reaching for:

1. **Scatter must carry the local pigment's hue.** A single fixed scatter tint gets added to
   every plume — the first build used cyan, which pushed magenta toward white and yellow
   toward green, quietly cancelling much of the chroma the absorption model had just
   produced. Sample transmission at reduced depth (`exp(-tau * 0.3)`) to get a stable hue
   even where the core is dense enough that `exp(-tau)` has gone to zero.
2. **Cross-channel absorption.** Lower off-axis terms (cyan absorbing ~0.05 blue rather than
   0.10) let each pigment transmit its own two channels more completely.
3. **`INK.saturation`**, a chroma lift applied after absorption. 1.0 is physically neutral;
   ~1.4 restores what the tank takes without brightening the plane or washing out the type.

Raising `uDensity` is *not* a saturation lever — past a point higher optical depth drives
`exp(-tau)` toward zero, which is darker, not more colourful.

### 1.3 Output colour space — the bug that will look like a tuning problem

`ShaderMaterial` gets **no** automatic sRGB conversion. Three only applies it where the
shader asks:

```glsl
gl_FragColor = vec4(color, alpha);
#include <colorspace_fragment>
```

Without that include, linear values are written straight into an sRGB-interpreted buffer and
the entire hero renders roughly four stops dark. It presents as "the ink isn't showing up",
and no amount of raising density or brightening the medium fixes it — this cost a full tuning
cycle during the build.

### 1.4 Dye resolution must exceed simulation resolution

The velocity/pressure fields are smooth and low-frequency; the dye field is where all the
visible detail lives. Running both at one resolution is the most common reason a fluid sim
looks like coloured fog.

```
velocity / pressure / divergence / curl   →  128²  (desktop 192²)
dye                                       →  1024² (desktop)
```

Advecting a high-res dye texture through a low-res velocity field is nearly free and is what
produces filaments thinner than a simulation cell — the tendrils in the reference. Get this
ratio wrong and no amount of vorticity confinement recovers it.

### 1.5 No bloom, and what to do instead

Bloom is light emission. Ink is light *absorption* — the densest region is the darkest, and
bloom inverts that reading, which is what makes fluid demos look like neon smoke.

The post chain is **not** an `EffectComposer`. The scene is already a single fullscreen quad,
so a composer would render the same pixels a second time to apply effects that cost a handful
of instructions inline. Everything runs at the end of `ink.frag`, in this order:

| Stage | Why |
|---|---|
| Unsharp mask on **optical depth** | Recovers filament edges that advection smeared. Sharpening depth rather than the finished pixels avoids haloing the medium's gradient too. Measured ~+12% edge energy. |
| Radial chromatic dispersion | Pigment edges refract, and real lenses disperse more toward the frame edge. Shifts hue at boundaries; adds no luminance. |
| Chroma lift | §1.2. |
| Filmic S-curve | Deepens shadows without the clipping a contrast multiply causes. |
| Vignette | Aspect-corrected so it stays circular on wide viewports. |
| Dither, **after** the sRGB conversion | The medium is a wide smooth gradient — exactly the content that bands at 8-bit. Applying it before the conversion would be the wrong magnitude in the shadows, where sRGB expands most. |

The unsharp tap distance is in dye texels, so it must track the dye target size or the
sharpening silently changes strength when the quality tier changes.



---

## 2. Architecture

```
HeroSection
├── HeroCanvasBoundary          (keep — context-loss → PigmentField)
│   └── Canvas
│       └── FluidScene
│           ├── FluidSimulation (plain class, NOT React state)
│           ├── InkPlane        (3 parallax slices)
│           └── usePointerSplat
├── GrainOverlay                (keep, unchanged)
└── HeroContent                 (keep, unchanged)
```

The simulation is a plain class holding render targets and materials. React touches it twice:
once in `useEffect` to construct/dispose, once per frame in `useFrame` to call `update(dt)`.
No simulation value ever enters React state.

### 2.1 R3F integration — the one non-obvious rule

Run the sim in a **priority-0** `useFrame`. In R3F, any `useFrame` with priority > 0 disables
automatic rendering and makes you responsible for `gl.render()`. Priority 0 callbacks run
before the automatic render, which is exactly what we want: passes execute, then the scene
draws the result.

```js
useFrame((_, delta) => {
  sim.current?.update(Math.min(delta, 1 / 30));   // clamp — tab-restore spikes explode the sim
});
```

`update()` must end with `gl.setRenderTarget(null)` and restore `gl.autoClear`, or R3F's own
render lands in the last simulation buffer and the hero goes black.

---

## 3. File layout

```
src/v2/components/hero/
├── HeroSection.jsx             MODIFY  — unchanged structure, new scene
├── HeroCanvasBoundary.jsx      MODIFY  — camera, dpr, WebGL2 capability gate
├── HeroContent.jsx             KEEP    — untouched
├── GrainOverlay.jsx            KEEP    — untouched
├── PigmentField.jsx            KEEP    — fallback, now load-bearing (§9)
├── constants.js                MODIFY  — timeline + emitter + quality constants
├── hooks/
│   ├── useHeroQualityTier.js   MODIFY  — add fluid/dye res, pressure iterations
│   ├── useHeroTimeline.js      MODIFY  — new phases (§7)
│   ├── useHalftoneTarget.js    RETIRE  — unmount, leave on disk
│   └── usePointerSplat.js      NEW
├── fluid/
│   ├── FluidSimulation.js      NEW  — the class; ~250 lines
│   ├── FluidPasses.js          NEW  — material construction per pass
│   ├── DoubleTarget.js         NEW  — ping-pong RT pair + swap()
│   └── InkEmitters.js          NEW  — the four nozzles + their trajectories
├── scene/
│   ├── FluidScene.jsx          NEW  — replaces InkScene
│   ├── InkPlane.jsx            NEW  — parallax slices, Beer–Lambert render
│   ├── InkScene.jsx            DELETE
│   ├── InkBlob.jsx             DELETE
│   ├── lighting.jsx            DELETE  — density fields are not lit
│   └── ParticleField.jsx       RETIRE  — unmount, leave on disk
└── shaders/
    ├── base.vert.js            NEW  — shared fullscreen vertex + neighbour varyings
    ├── advection.frag.js       NEW
    ├── divergence.frag.js      NEW
    ├── pressure.frag.js        NEW
    ├── gradientSubtract.frag.js NEW
    ├── curl.frag.js            NEW
    ├── vorticity.frag.js       NEW
    ├── splat.frag.js           NEW
    ├── ink.frag.js             NEW  — Beer–Lambert composite (§1.1)
    ├── inkBlob.glsl.js         DELETE
    └── particles.glsl.js       RETIRE
```

Also dead and safe to delete — nothing imports either, `Home.jsx` moved to
`components/hero/HeroSection` some time ago:

```
src/v2/components/Hero.jsx           (235 lines)
src/v2/components/InkHeroScene.jsx   (509 lines)
```

---

## 4. Simulation

### 4.1 Render targets

All `HalfFloatType` / `RGBAFormat` / `LinearFilter` / `ClampToEdgeWrapping`.

| Target | Res | Ping-pong | Channels |
|---|---|---|---|
| velocity | sim | yes | xy = velocity |
| dye | dye | yes | rgba = C, M, Y, K density |
| pressure | sim | yes | r = pressure |
| divergence | sim | no | r |
| curl | sim | no | r |

Grid must be **aspect-corrected** (`simRes × simRes/aspect`) or the ink shears horizontally on
wide viewports — a bug that looks like a physics problem and is not.

### 4.2 Per-frame pass order

Order matters. Splats go in *before* projection so injected momentum is made divergence-free
in the same frame; injecting after projection leaves visible pressure artifacts at the nozzles.

```
1. advect velocity      velocity ← advect(velocity, velocity, dt, VEL_DISSIPATION)
2. splat velocity       emitters (§5) + pointer (§6) inject momentum
3. body forces          gravity ∝ dye density   (ink is denser than water — it falls)
4. curl                 curl ← ∇ × velocity
5. vorticity            velocity += vorticityConfinement(curl) * CURL_STRENGTH
6. divergence           divergence ← ∇ · velocity
7. pressure             N × Jacobi iterations
8. gradient subtract    velocity -= ∇pressure          (now divergence-free)
9. splat dye            emitters write into their own CMYK channel
10. advect dye          dye ← advect(dye, velocity, dt, DYE_DISSIPATION)
```

Step 3 is the difference between ink and smoke. The reference brief mentions buoyancy; for
this hero it must be **negative** — pigment is heavier than the medium, so the plumes fall and
spread, they do not billow upward.

### 4.3 Starting constants

Velocity is in **simulation texels per second** (advection multiplies by texel size). That is
why these read large next to the UV-space radii — the two are not in the same units.

```js
export const FLUID = {
  velocityDissipation: 0.995,    // per-frame multiplier at 60fps
  dyeDissipation:      0.9985,   // ink must outlive the currents that made it
  pressureIterations:  { desktop: 24, laptop: 16, mobile: 10 },
  curlStrength:        32,       // the tendril knob — tune this first
  gravity:             -45,      // ∝ dye density; NEGATIVE
  splatRadius:         0.0004,   // velocity nozzle
  dyeSplatRadius:      0.00012,  // dye nozzle — far tighter, see below
  dyeRate:             150,
};
```

`curlStrength` is the highest-leverage parameter. Below ~15 the plumes fall as smooth sheets;
above ~40 they shred into noise within a second.

**Splat radii are squared-distance falloff** (`exp(-d*d / r)`), not radii in UV, so they are
much smaller numbers than they look. The first build used `0.0045` for dye, which is a nozzle
about 13% of screen width — it injected soft blobs that no amount of vorticity could sharpen,
and the result was exactly the coloured fog this document warns about. The dye nozzle has to
be tiny.

Because the nozzle is tiny, `dyeRate` has to be large: advection sweeps roughly a
nozzle-width of dye away every frame, so peak density settles near `dyeRate * dt`. Reaching
the ~4 needed for `exp(-tau)` to bottom out takes a rate in the hundreds, not the units.

### 4.4 Edge shaping — required, not polish

Semi-Lagrangian advection resamples with linear filtering every step, so a low-density haze
creeps across the whole field and plumes lose their edges. Clear the pedestal and steepen
what remains, before absorption:

```glsl
d = pow(max(d - 0.012, 0.0), vec4(1.25));
```

Without this the simulation is physically fine and visually mush.

---

## 5. The four nozzles

One per corner, in simulation UV, **all four aimed at the "KLASSICO INKS" wordmark** so the
pigments converge on the headline rather than blooming independently.

```js
export const CONVERGENCE_TARGET = [0.5, 0.58];   // centre of the type block

export const EMITTERS = [
  // C — top left, M — top right, Y — bottom left, K — bottom right.
  { channel: 0, x: 0.15, y: 0.81, speed: 1.30, swirl: 0.20, freq: [0.70, 1.10], phase: 0.0 },
  { channel: 1, x: 0.85, y: 0.84, speed: 1.16, swirl: 0.16, freq: [0.53, 0.87], phase: 1.7 },
  { channel: 2, x: 0.17, y: 0.25, speed: 1.52, swirl: 0.23, freq: [0.61, 1.30], phase: 3.1 },
  { channel: 3, x: 0.83, y: 0.23, speed: 1.38, swirl: 0.18, freq: [0.44, 0.96], phase: 4.6 },
];
```

Aim is computed each frame from the nozzle's **live** position toward the target, not stored
as a fixed vector, so the drift below cannot slowly walk a stream off target. The UV direction
is scaled by grid width/height before use: advection moves dye by `velocity * texelSize`, and
the two axes have different texel sizes, so feeding a raw UV direction in bends every stream
away from its target on any non-square viewport.

Four rules, all of which cost a build iteration to learn:

- **`swirl` is not decoration.** Four jets fired straight at one point cancel and produce a
  static symmetric knot. A consistent tangential bias makes the convergence rotate and keeps
  folding new pigment through itself.
- **Speeds are far higher than the distance suggests** (~1.3 UV/s to cross ~0.4 UV). A splat
  only adds momentum locally and the pressure projection immediately cancels most of a
  localised jet, so what survives downstream is a fraction of what is injected. At 0.46 the
  streams bloom in their corners and never reach the headline.
- **The bottom pair fires upward against gravity**, so it needs more speed than the top pair,
  and sits further in from its corners so the bloom lands inside the frame instead of being
  clipped by the bottom edge. Gravity acts on all pigment everywhere: at -45 it pinned both
  bottom streams to the edge as a smear no matter how much dye they carried. -11 is the
  balance.
- **Nozzles drift, but only slightly** — `sin(t * freq)` on mutually non-harmonic frequencies
  so the combined pattern has no short period. The contrast between a controlled source and
  unpredictable output is what reads as physical rather than authored.

### 5.0 Jets, not blooms — the splat has to be anisotropic

A circular splat is a **point source of momentum**, and in incompressible flow a point source
spreads radially and recirculates. It can only ever produce a bloom; no amount of tuning speed,
curl or dissipation turns one into a jet.

The fix is to stretch the gaussian along the aim (`uAxis`, `uElongation` in splat.frag), so the
fluid is driven along a line rather than from a point. The stream then has a coherent core that
travels and breaks up downstream — which is what a real jet does, and the contrast between the
two is the whole read.

Three couplings that follow from it:

- **`dyeRate` scales inversely with `dyeElongation`.** Stretching the splat multiplies the
  injected area by roughly that factor. A rate tuned for a round nozzle floods the field once
  the nozzle is a ribbon: 150 at elongation 1 became soup at 4.5, and had to drop to ~42.
- **The splat is pushed forward along its axis** by `0.5 * elongation * sqrt(radius)`. Centred
  on the nozzle, half of every corner jet falls outside the viewport and is wasted.
- **`curlStrength` comes down** (32 → 21). High curl shreds the stream into turbulence
  immediately, so the coherent core never forms.

The dye ribbon is shorter than the momentum jet driving it, so pigment rides a stream that is
already moving rather than having to establish it.

### 5.0b Black cannot compete on chroma

Black is structurally disadvantaged against the other three and needs help in three places.
Symptom: the K jet reads as a violet shadow that magenta swamps, rather than as ink.

- **Per-nozzle `rate`.** Black removes light rather than colouring it, so wherever it overlaps
  a chromatic plume the eye reads the other pigment unless there is materially more black
  present. K runs at 2.2, M trimmed to 0.85. Real process inks differ in tinting strength the
  same way, and carbon black is the strongest of the four.
- **Density for its own sake.** The rendered colour is `medium * exp(-tau)`. Unless tau is high
  enough to drive that near zero, the cool medium shows straight through the plume and black
  reads blue.
- **`ABSORB_K` is blue-weighted**, `(2.42, 2.40, 2.58)`, not flat. With equal or lower blue
  absorption, dense black passes the medium's blue and reads violet — the same direction
  magenta pushes, which is why the two were compounding.
- **`scatterColor` must be near-neutral.** Hue comes from `scatterHue` (the local pigment), so
  any tint there is added to *every* plume. A cool blue-white value was lighting the black jet
  blue.

There is a layout cause too. `swirl` is signed, and with a uniform sign magenta's aim was
rotated down-and-right, straight into the corridor black travels up: the two right-hand jets
shared a path. M's swirl is negative so they diverge.

Measured on the K quadrant's darkest quartile, blue-over-green cast fell +14.7 → +9.8 and the
pigment darkened from rgb(22,32,46) to rgb(16,22,32). Some cool cast remains and should — a
black plume in a blue-lit tank genuinely takes one.

### 5.0c Injection rate is tinting strength, not mass

Two mechanical traps, both of which make one jet behave unlike the others while looking like
a colour problem.

**Gravity must use weighted density, not a raw channel sum.** `rate` is a *tinting* strength —
how strongly a pigment colours. Feeding the raw sum into the body force makes a hot channel
physically heavier: black at rate 2.2 got 2.2x the gravity, and firing upward from a bottom
corner it simply could not climb while the other bottom jet did. `uDensityWeights` divides the
rates back out, and FluidSimulation derives it from EMITTERS so retuning a rate can never
silently change how that plume moves.

**Bottom nozzles must clear `drainHeight` with room to spare.** K sat at y 0.19 against a drain
band of 0.18, so anything that dipped even slightly was removed — the black jet was fighting a
sink the other three never touched. Keep the bottom pair at matching heights unless there is a
reason not to.

Both presented as "the black ink looks wrong" and neither was about colour. When one pigment
reads as not working, check what is different about its *dynamics* before touching absorption.

### 5.1 The backlight has to reach the nozzles

Pigment is only visible against lit medium, so the medium's falloff and the emitter layout are
coupled. A tight central pool left the two bottom sprouts reading as dim smudges regardless of
their dye load. The glow radius has to cover all four corners.

Its tint is coupled too: against a saturated teal tank the yellow channel has almost no red to
transmit and reads olive. Cool but fairly desaturated lets all four pigments show their own
colour.

### 5.2 The floor is not a tank floor

Gravity applies to all pigment everywhere, so the two upward-firing bottom nozzles have a
standing problem: once their jets lose momentum, gravity presses that ink into the bottom
edge, where free-slip walls smear it sideways with nowhere to go. It accumulates into a band
of sludge across the bottom of the frame.

Two coupled fixes, neither sufficient alone:

- **`floorFade`** — gravity tapers to zero below ~34% height, so it stops pushing settled ink
  into the boundary. Above that it behaves normally and plumes still fall.
- **`drainHeight` / `drainStrength`** — dye inside the bottom band decays faster, so whatever
  does reach the floor clears instead of building up. The frame's bottom is an artificial wall,
  not a real tank floor; without a sink there, the sim has no way to lose that pigment.

The drain applies to the dye advection pass only — the velocity pass sets `uDrainDecay` to 1.

### 5.3 Injection lifecycle — the saturation trap

Continuous injection at load strength saturates the dye buffer within ~10 seconds. Density
climbs, `exp(-tau)` goes to zero everywhere, and the hero becomes a black rectangle. Guard it:

```
0.0 – 2.5s   strength 1.0    establishing burst, four clear streams
2.5 – 6.0s   ramp → 0.42     ease out
6.0s+        strength 0.42   trickle; balances dyeDissipation at a steady state
```

The trickle level lives in `InkEmitters.LIFECYCLE` and is imported by the timeline, so the
two paths cannot drift apart. It is a genuine balance point in both directions: at 0.14 the
field drains to a faint haze by ~10s, which is as wrong as saturating to black.

Verify the steady state by leaving the tab open for five minutes and confirming mean density
is flat. This is the failure mode most likely to reach production unnoticed, because it looks
correct for the first fifteen seconds of every dev reload.

---

## 6. Pointer interaction

Pointer delta → velocity splat, no dye. The cursor stirs the water; it does not add pigment
(adding pigment lets a visitor paint the hero solid black in about four seconds).

```js
sim.splatVelocity(uv, delta * FORCE, SPLAT_RADIUS);
```

Skip entirely under `prefers-reduced-motion` and on coarse pointers.

---

## 7. Timeline

Replaces the five-phase blob choreography in `constants.js`. The simulation runs continuously
underneath; the timeline only modulates emitter strength, camera, and opacity.

| Window | Phase | What changes |
|---|---|---|
| 0.0 – 2.5s | establish | emitter strength 1.0, camera z 7.0 |
| 2.5 – 6.0s | disperse | emitter strength → 0.14, curl → full |
| 6.0s+ | idle | steady state, pointer-reactive, no end |

No halftone resolve. Per the reference §22 and my own read: the dispersion is strong enough
alone, and transforming it into the logo mark undercuts it by revealing the whole thing was a
device. Drop the transform; `useHalftoneTarget` and `ParticleField` stay on disk unmounted.

Scroll drives a mild camera dolly (`z: 7.0 → 5.6`) across the hero's own height only. No pin,
no hijack, consistent with `docs/hero-spec.md`.

---

## 8. Making a 2D sim read as 3D

Skip raymarching. It is a real technique and it is genuinely phase 2 — it triples the shader
cost and is where cross-device support goes to die. Ship the cheap version:

**Revised during build.** Three separate meshes at different z is the obvious reading of
"depth layers", but it is the worse implementation: it costs three draw calls and introduces
a transparency sort that can go wrong. Absorption composites by *addition* regardless of
ordering, so summing optical depth from three samples inside one shader is both cheaper and
more correct.

- **One** screen-filling plane, perspective camera at fov 35. No tilt — a tilted plane stops
  covering the frustum at the edges, which reads as a bug.
- Three parallax slices sampled in that one pass at z = −0.6 / 0 / +0.45, scale 0.94 / 1.0 /
  1.07, absorption weighted 0.42 / 1.0 / 0.55. Offsets derive from the actual view direction,
  so the scroll dolly produces real relative motion between slices.
- Sized for the camera's farthest dolly position, so pushing in only ever over-covers.
- The medium is a backlit tank: a bright-centred gradient falling to near black at the frame
  edges. Subtractive pigment can only remove light, so it needs something to remove it from —
  on a flat dark ground the ink is invisible by definition. The dark surround is also what
  stops the whole viewport reading as one flat teal wash.

---

## 8.5 Lighting the headline

The type is HTML above the canvas, so it cannot be lit by the scene directly. Two halves:

**In-canvas spill** (`uInkLight` in ink.frag) — pigment near the headline adds its own hue to
the medium around the type block, tinted by `scatterHue` so a cyan jet spills cyan and a yellow
one spills yellow. A fixed tint here would read as a generic glow and break the connection to
whichever jet is actually close.

**On the glyphs** — `FluidSimulation.readInkLight()` renders the dye over the headline band into
a 16×8 RGBA8 buffer and reads it back, giving average colour and strength in one read. That
drives `--ink-light-color` / `--ink-light-strength` on the hero `<section>`, which
`HeroContent`'s text-shadow consumes. Custom properties inherit, so the simulation never
re-renders React.

Constraints worth respecting:

- `readPixels` is a **synchronous stall**. Keep the probe tiny and call it every ~6 frames; it
  only has to be right enough to tint a shadow.
- Smooth the reading (`LIGHT_LERP`). The field is turbulent frame to frame and a raw value makes
  the type flicker.
- Keep the strength gain low enough that the light **modulates** rather than pinning at full —
  a glow that is always maximum reads as a static effect, not as a jet arriving.
- The probe shares `shaders/pigment.glsl.js` with the renderer. A probe that drifted from what
  is on screen would spill the wrong colour onto the type, which is worse than no spill.
- The CSS fallback paths never set these variables, so the text-shadow needs var fallbacks or
  it drops entirely.

## 9. Legibility and fallbacks

**This is a constraint, not a polish item.** `HeroContent` sets a 7.5rem white headline
directly over the canvas. A full-viewport churning fluid at full density destroys it, and it
will look fine on your monitor and fail in sunlight on a phone.

- Radial density attenuation in `ink.frag`: multiply `tau` by
  `smoothstep(0.15, 0.55, distanceFromHeadlineCentre)`, so the ink thins where the type sits
  and stays dense at the edges. Cheaper and better-looking than a scrim on top.
- Keep the existing bottom scrim at `z-[2]`.
- Measure contrast on the final composite, not the mockup.

Fallback chain, in order:

1. No WebGL2 or no `EXT_color_buffer_float` → `PigmentField`. Half-float render targets are the
   hard requirement; this is a real population, not a theoretical one.
2. Context lost → `PigmentField` (already wired in `HeroCanvasBoundary`).
3. `prefers-reduced-motion` → `PigmentField` static. A fluid sim has no meaningful frozen
   state, so do not attempt a paused variant.

---

## 10. Quality tiers

```
desktop   sim 192²   dye 1024²   pressure 24   dpr ≤ 1.75
laptop    sim 160²   dye  768²   pressure 16   dpr ≤ 1.5
mobile    sim 128²   dye  512²   pressure 10   dpr = 1
```

Tier by measurement, not by user-agent: sample frame time over the first 90 frames, and step
down one tier if the p75 exceeds 20ms. Pressure iterations first, then dye resolution — never
drop `curlStrength`, it is the whole look.

---

## 11. Build order

Each step is independently verifiable. Do not proceed on a step you cannot see working.

1. `DoubleTarget` + `FluidSimulation` skeleton + advection only. Splat white dye on click.
   **Verify:** a smear that moves and decays.
2. Divergence + pressure + gradient subtract. **Verify:** the smear now swirls and conserves
   volume instead of dissipating radially.
3. Curl + vorticity confinement. **Verify:** tendrils. Tune `curlStrength` here.
4. Four CMYK emitters, single-channel injection, still rendered additively.
   **Verify:** four falling plumes.
5. Beer–Lambert composite (§1.1). **Verify:** overlaps darken, C+M reads violet. *This is the
   step where it starts looking like ink — if it does not, stop and fix it here.*
6. Gravity, emitter drift, lifecycle ramp. **Verify:** five-minute steady state.
7. Parallax slices, tilt, water plane.
8. Pointer splat, radial legibility attenuation, timeline, camera dolly.
9. Quality tiering + measured downgrade, fallbacks, delete dead files.

Steps 1–5 are the hero. Steps 6–9 are the ship.
