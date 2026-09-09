import * as THREE from 'three';
import DoubleTarget, { createTarget } from './DoubleTarget';

// Probe resolution. Small enough that the readback stall is negligible.
const PROBE_W = 16;
const PROBE_H = 8;
import { createPasses, createProbePass } from './FluidPasses';
import { EMITTERS, emitterPosition, emitterVelocity } from './InkEmitters';

/**
 * Stable-fluids solver on the GPU. A plain class, deliberately: nothing here
 * belongs in React state, and no simulation value ever crosses that boundary.
 * React touches it exactly twice — construct/dispose in an effect, update(dt)
 * in a frame callback.
 *
 * Two structural choices worth knowing before editing:
 *
 * - The dye field runs at a much HIGHER resolution than velocity/pressure
 *   (1024 vs 192 on desktop). Velocity is smooth and low-frequency; all the
 *   visible detail lives in the dye. Advecting high-res dye through a low-res
 *   velocity field costs almost nothing and is what produces filaments finer
 *   than a simulation cell. Equalise the two and it turns into coloured fog
 *   that no amount of vorticity recovers.
 *
 * - The dye target stores CMYK pigment CONCENTRATION, not colour. See
 *   shaders/ink.frag.js for why that is not an implementation detail.
 */
export default class FluidSimulation {
  constructor(renderer, options) {
    const { simRes = 192, dyeRes = 1024, pressureIterations = 24, aspect = 1.6, config } = options;

    this.renderer = renderer;
    this.config = config;
    this.pressureIterations = pressureIterations;
    this.simRes = simRes;
    this.dyeRes = dyeRes;
    this.time = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);

    this.passes = createPasses();

    // Gravity should respond to pigment mass, not to how strongly a pigment
    // tints. Deriving these from the emitter rates rather than hardcoding
    // them means retuning a nozzle's rate can never silently change how its
    // plume moves.
    this.densityWeights = new THREE.Vector4(1, 1, 1, 1);
    EMITTERS.forEach((e) => {
      this.densityWeights.setComponent(e.channel, 1 / (e.rate ?? 1));
    });
    this.probe = createProbePass(config);
    this.probeTarget = new THREE.WebGLRenderTarget(PROBE_W, PROBE_H, {
      type: THREE.UnsignedByteType,
      format: THREE.RGBAFormat,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.probeBuffer = new Uint8Array(PROBE_W * PROBE_H * 4);

    this.buildTargets(aspect);
  }

  /**
   * Average pigment colour and strength over the headline band, for the CSS
   * light on the HTML type. Renders a 16x8 buffer and reads it back.
   *
   * readPixels is a synchronous stall, so this is deliberately tiny and is
   * called every few frames rather than every frame — the result only has to
   * be right enough to tint a text-shadow. Returns values in 0..1.
   */
  readInkLight() {
    this.probe.uniforms.uDye.value = this.dye.read.texture;
    this.blit(this.probe, this.probeTarget);
    this.renderer.readRenderTargetPixels(
      this.probeTarget, 0, 0, PROBE_W, PROBE_H, this.probeBuffer
    );
    this.renderer.setRenderTarget(null);

    const buf = this.probeBuffer;
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < buf.length; i += 4) {
      r += buf[i];
      g += buf[i + 1];
      b += buf[i + 2];
    }
    const n = buf.length / 4;
    const inv = 1 / (n * 255);
    r *= inv;
    g *= inv;
    b *= inv;

    // Strength is the brightest channel: a saturated cyan spill is "strong"
    // light even though its mean across RGB is low.
    return { r, g, b, strength: Math.max(r, Math.max(g, b)) };
  }

  /**
   * Grid dimensions track the viewport aspect. A square grid on a wide
   * viewport shears the ink horizontally — a bug that presents as a physics
   * problem and is not one.
   */
  buildTargets(aspect) {
    const dims = (base) =>
      aspect > 1
        ? [Math.round(base), Math.max(1, Math.round(base / aspect))]
        : [Math.max(1, Math.round(base * aspect)), Math.round(base)];

    const [sw, sh] = dims(this.simRes);
    const [dw, dh] = dims(this.dyeRes);

    this.simWidth = sw;
    this.simHeight = sh;
    // Grid aspect after rounding, used for circular splats. Kept separate from
    // requestedAspect so the resize guard compares like with like.
    this.aspect = sw / sh;
    this.requestedAspect = aspect;

    if (this.velocity) {
      this.velocity.resize(sw, sh);
      this.pressure.resize(sw, sh);
      this.dye.resize(dw, dh);
      this.divergence.setSize(sw, sh);
      this.curl.setSize(sw, sh);
    } else {
      this.velocity = new DoubleTarget(sw, sh);
      this.pressure = new DoubleTarget(sw, sh);
      this.dye = new DoubleTarget(dw, dh);
      this.divergence = createTarget(sw, sh);
      this.curl = createTarget(sw, sh);
      this.clearAll();
    }

    this.passes.sharedTexel.value.set(1 / sw, 1 / sh);
    this.passes.splat.uniforms.uAspect.value = this.aspect;
  }

  /** Fresh half-float targets contain garbage; zero them before the first pass. */
  clearAll() {
    const { renderer } = this;
    const previous = renderer.getClearColor(new THREE.Color());
    const previousAlpha = renderer.getClearAlpha();
    renderer.setClearColor(0x000000, 0);

    [this.velocity.a, this.velocity.b, this.pressure.a, this.pressure.b,
     this.dye.a, this.dye.b, this.divergence, this.curl].forEach((target) => {
      renderer.setRenderTarget(target);
      renderer.clear(true, false, false);
    });

    renderer.setRenderTarget(null);
    renderer.setClearColor(previous, previousAlpha);
  }

  resize(aspect) {
    if (this.requestedAspect && Math.abs(aspect - this.requestedAspect) < 0.01) return;
    this.buildTargets(aspect);
  }

  blit(material, target) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Additive gaussian into a ping-pong field. `color` is a Vector4.
   *
   * `axis` and `elongation` stretch the gaussian into a line segment — see
   * splat.frag. Omit them for the isotropic case.
   */
  splat(field, point, color, radius, axis, elongation = 1) {
    const { splat } = this.passes;
    splat.uniforms.uTarget.value = field.read.texture;
    splat.uniforms.uPoint.value.set(point[0], point[1]);
    splat.uniforms.uColor.value.copy(color);
    splat.uniforms.uRadius.value = radius;
    splat.uniforms.uAxis.value.set(axis ? axis[0] : 0, axis ? axis[1] : -1);
    splat.uniforms.uElongation.value = elongation;
    this.blit(splat, field.write);
    field.swap();
  }

  /** Pointer momentum only — never dye. See usePointerSplat for why. */
  splatVelocity(x, y, dx, dy, radius) {
    this.scratch = this.scratch || new THREE.Vector4();
    this.scratch.set(dx, dy, 0, 0);
    const len = Math.hypot(dx, dy) || 1;
    this.splat(this.velocity, [x, y], this.scratch, radius, [dx / len, dy / len], 2.2);
  }

  injectEmitters(dt, strength) {
    if (strength <= 0) return;
    this.scratch = this.scratch || new THREE.Vector4();
    const {
      splatRadius, dyeSplatRadius, dyeRate, jetElongation, dyeElongation,
    } = this.config;

    for (let i = 0; i < EMITTERS.length; i += 1) {
      const e = EMITTERS[i];
      const nozzle = emitterPosition(e, this.time);
      const [vx, vy] = emitterVelocity(e, nozzle, this.simWidth, this.simHeight);

      // Jet axis. In the splat's aspect-corrected space this reduces to the
      // raw velocity direction, because the x correction and the grid's own
      // width/height ratio cancel exactly.
      const speed = Math.hypot(vx, vy) || 1;
      const axis = [vx / speed, vy / speed];

      // Push the elongated splat forward so it extends from the nozzle INTO
      // the frame. Centred on the nozzle, half of every corner jet would fall
      // outside the viewport and be wasted.
      const reach = 0.5 * jetElongation * Math.sqrt(splatRadius);
      const point = [
        nozzle[0] + (axis[0] / this.aspect) * reach,
        nozzle[1] + axis[1] * reach,
      ];

      // Momentum first, so the nozzle's own thrust is made divergence-free by
      // this frame's projection rather than showing as a pressure artifact.
      this.scratch.set(vx * dt * strength, vy * dt * strength, 0, 0);
      this.splat(this.velocity, point, this.scratch, splatRadius, axis, jetElongation);

      this.scratch.set(0, 0, 0, 0);
      this.scratch.setComponent(e.channel, dyeRate * (e.rate ?? 1) * dt * strength);
      this.splat(this.dye, point, this.scratch, dyeSplatRadius, axis, dyeElongation);
    }
  }

  /**
   * One simulation step. Pass order is load-bearing — see section 4.2 of
   * docs/hero-fluid-spec.md. In particular splats go in BEFORE projection.
   */
  update(dt, strength) {
    const { renderer, passes, config } = this;
    const previousAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    this.time += dt;

    const decay = (d) => Math.pow(d, dt * 60);

    // 1. advect velocity through itself
    passes.advection.uniforms.uVelocity.value = this.velocity.read.texture;
    passes.advection.uniforms.uSource.value = this.velocity.read.texture;
    passes.advection.uniforms.uDt.value = dt;
    passes.advection.uniforms.uDecay.value = decay(config.velocityDissipation);
    passes.advection.uniforms.uDrainDecay.value = 1;  // velocity is not drained
    this.blit(passes.advection, this.velocity.write);
    this.velocity.swap();

    // 2. nozzles inject momentum + pigment
    this.injectEmitters(dt, strength);

    // 3. gravity proportional to pigment density — ink falls, it does not billow
    passes.bodyForce.uniforms.uVelocity.value = this.velocity.read.texture;
    passes.bodyForce.uniforms.uDye.value = this.dye.read.texture;
    passes.bodyForce.uniforms.uDt.value = dt;
    passes.bodyForce.uniforms.uGravity.value = config.gravity;
    passes.bodyForce.uniforms.uFloorFade.value = config.floorFade;
    passes.bodyForce.uniforms.uDensityWeights.value.copy(this.densityWeights);
    this.blit(passes.bodyForce, this.velocity.write);
    this.velocity.swap();

    // 4-5. curl, then vorticity confinement — the tendrils
    passes.curl.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(passes.curl, this.curl);

    passes.vorticity.uniforms.uVelocity.value = this.velocity.read.texture;
    passes.vorticity.uniforms.uCurl.value = this.curl.texture;
    passes.vorticity.uniforms.uCurl_.value = config.curlStrength;
    passes.vorticity.uniforms.uDt.value = dt;
    this.blit(passes.vorticity, this.velocity.write);
    this.velocity.swap();

    // 6-8. project onto a divergence-free field
    passes.divergence.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(passes.divergence, this.divergence);

    passes.pressure.uniforms.uDivergence.value = this.divergence.texture;
    for (let i = 0; i < this.pressureIterations; i += 1) {
      passes.pressure.uniforms.uPressure.value = this.pressure.read.texture;
      this.blit(passes.pressure, this.pressure.write);
      this.pressure.swap();
    }

    passes.gradientSubtract.uniforms.uPressure.value = this.pressure.read.texture;
    passes.gradientSubtract.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(passes.gradientSubtract, this.velocity.write);
    this.velocity.swap();

    // 10. carry the pigment
    passes.advection.uniforms.uVelocity.value = this.velocity.read.texture;
    passes.advection.uniforms.uSource.value = this.dye.read.texture;
    passes.advection.uniforms.uDecay.value = decay(config.dyeDissipation);
    passes.advection.uniforms.uDrainHeight.value = config.drainHeight;
    passes.advection.uniforms.uDrainDecay.value = decay(1 - config.drainStrength);
    this.blit(passes.advection, this.dye.write);
    this.dye.swap();

    // Hand the renderer back exactly as found — miss this and R3F's own render
    // lands in the last simulation buffer and the hero goes black.
    renderer.setRenderTarget(null);
    renderer.autoClear = previousAutoClear;
  }

  get dyeTexture() {
    return this.dye.texture;
  }

  dispose() {
    this.velocity.dispose();
    this.pressure.dispose();
    this.dye.dispose();
    this.divergence.dispose();
    this.curl.dispose();
    this.probeTarget.dispose();
    this.probe.dispose();
    this.quad.geometry.dispose();
    Object.values(this.passes).forEach((p) => p.dispose?.());
  }
}
