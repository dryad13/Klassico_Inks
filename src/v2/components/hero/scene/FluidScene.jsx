import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import FluidSimulation from '../fluid/FluidSimulation';
import InkPlane from './InkPlane';
import useHeroTimeline from '../hooks/useHeroTimeline';
import usePointerSplat from '../hooks/usePointerSplat';
import { FLUID, INK, POST, CAMERA, TIERS, TIER_ORDER } from '../constants';

const MAX_DT = 1 / 30;

// Frames between headline-light probes. readPixels is a synchronous stall, so
// this trades a little latency for not paying it every frame; at 6 the light
// still tracks a jet arriving faster than the eye reads it.
const PROBE_EVERY = 6;
const LIGHT_LERP = 0.12;
const LIGHT_CHROMA = 2.2;
const MEASURE_FRAMES = 90;
const SLOW_FRAME_MS = 20;
// Sustained sub-30fps. Only consulted once there is no tier left to drop to,
// where the choice is no longer "cheaper simulation" but "simulation or not".
const UNPLAYABLE_FRAME_MS = 34;

export default function FluidScene({ quality, lightTargetRef, onUnplayable }) {
  const { gl, size, camera } = useThree();
  const heroStateRef = useHeroTimeline(quality.reducedMotion);
  const simulationRef = useRef(null);
  const tierRef = useRef(TIER_ORDER.indexOf(quality.tier));
  const samples = useRef([]);
  const frameRef = useRef(0);
  // readPixels stalls the pipeline, so probe half as often on the mobile tier
  // where there is least headroom to absorb it.
  const probeEvery = quality.tier === 'mobile' ? PROBE_EVERY * 2 : PROBE_EVERY;
  const lightRef = useRef({ r: 0, g: 0, b: 0, strength: 0 });

  const uniforms = useMemo(
    () => ({
      uDye: { value: null },
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uParallax: { value: INK.parallax },
      uDensity: { value: INK.density },
      uLegibility: { value: INK.legibility },
      uInkLight: { value: INK.inkLight },
      uFloor: { value: INK.floor },
      uGamma: { value: INK.gamma },
      uSaturation: { value: INK.saturation },
      uDyeTexel: { value: new THREE.Vector2(1 / 1024, 1 / 640) },
      uSharpen: { value: POST.sharpen },
      uAberration: { value: POST.aberration },
      uVignette: { value: POST.vignette },
      uFilmic: { value: POST.filmic },
      uGrain: { value: POST.grain },
      uDeepColor: { value: new THREE.Color(INK.deepColor) },
      uTankColor: { value: new THREE.Color(INK.tankColor) },
      uScatterColor: { value: new THREE.Color(INK.scatterColor) },
    }),
    []
  );

  // Construct once. Tier changes rebuild it through the same path (below), so
  // this effect deliberately does not depend on tier.
  useEffect(() => {
    const tier = TIERS[TIER_ORDER[tierRef.current]];
    const sim = new FluidSimulation(gl, {
      ...tier,
      aspect: size.width / size.height,
      config: { ...FLUID, inkFloor: INK.floor, inkGamma: INK.gamma },
    });
    simulationRef.current = sim;
    uniforms.uDye.value = sim.dyeTexture;
    // The unsharp tap distance is in dye texels, so it has to track the
    // actual target size or sharpening strength changes with quality tier.
    uniforms.uDyeTexel.value.set(1 / sim.dye.width, 1 / sim.dye.height);

    // Dispose whatever is current, not the instance captured here — an
    // adaptive downgrade replaces it, and closing over `sim` would
    // double-dispose the old one and leak the new one.
    return () => {
      simulationRef.current?.dispose();
      simulationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  useEffect(() => {
    const sim = simulationRef.current;
    sim?.resize(size.width / size.height);
    if (sim) uniforms.uDyeTexel.value.set(1 / sim.dye.width, 1 / sim.dye.height);
    uniforms.uAspect.value = size.width / size.height;
  }, [size.width, size.height, uniforms]);

  usePointerSplat(simulationRef, {
    enabled: !quality.reducedMotion,
    force: FLUID.pointerForce,
    radius: FLUID.pointerRadius,
  });

  /**
   * Priority 0 matters. Any useFrame with priority > 0 disables R3F's
   * automatic render and makes this component responsible for gl.render();
   * at priority 0 the passes run first and R3F still draws the scene after.
   */
  useFrame((_, rawDelta) => {
    const sim = simulationRef.current;
    if (!sim) return;

    // Clamped — a backgrounded tab returns with a multi-second delta, which
    // advects the whole dye field off screen in one step and blanks the hero.
    const dt = Math.min(rawDelta, MAX_DT);
    const heroState = heroStateRef.current;

    sim.update(dt, heroState.emitterStrength);

    uniforms.uDye.value = sim.dyeTexture;
    uniforms.uTime.value = sim.time;
    uniforms.uOpacity.value = heroState.opacity;

    // Headline light. Smoothed toward the probe reading rather than applied
    // raw: the field is turbulent frame to frame, and an unsmoothed value
    // makes the type flicker.
    frameRef.current += 1;
    if (lightTargetRef?.current && frameRef.current % probeEvery === 0) {
      const probe = sim.readInkLight();
      const light = lightRef.current;
      light.r += (probe.r - light.r) * LIGHT_LERP;
      light.g += (probe.g - light.g) * LIGHT_LERP;
      light.b += (probe.b - light.b) * LIGHT_LERP;
      light.strength += (probe.strength - light.strength) * LIGHT_LERP;

      // Averaging the band mixes all four pigments toward white, so the raw
      // probe colour is close to neutral even when one jet clearly dominates.
      // Push chroma away from that average so the glow reads as the colour of
      // the ink actually arriving, not as a generic white halo.
      const peak = Math.max(light.r, Math.max(light.g, light.b)) || 1;
      const mean = (light.r + light.g + light.b) / 3;
      const chroma = (c) => mean + (c - mean) * LIGHT_CHROMA;
      const norm = (c) => Math.round(Math.max(0, Math.min(255, (chroma(c) / peak) * 255)));
      const style = lightTargetRef.current.style;
      style.setProperty(
        '--ink-light-color',
        `rgb(${norm(light.r)} ${norm(light.g)} ${norm(light.b)})`
      );
      // Gain kept low enough that the light modulates instead of pinning at
      // full: a glow that is always maximum reads as a static effect, not as
      // a jet arriving.
      style.setProperty('--ink-light-strength', Math.min(1, light.strength * 1.15).toFixed(3));
    }

    const scrolled =
      typeof window !== 'undefined'
        ? Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)))
        : 0;
    camera.position.z += (THREE.MathUtils.lerp(CAMERA.z, CAMERA.zScrolled, scrolled) - camera.position.z) * 0.08;

    // Tier by measurement, not user agent. One downgrade only — a second one
    // would sit below the point where the effect is worth running at all.
    if (samples.current && samples.current.length < MEASURE_FRAMES) {
      samples.current.push(rawDelta * 1000);
      if (samples.current.length === MEASURE_FRAMES) {
        const sorted = [...samples.current].sort((a, b) => a - b);
        const p75 = sorted[Math.floor(sorted.length * 0.75)];
        samples.current = null;

        // Phones start on the lowest tier, so the downgrade below can never
        // fire for them — without this a struggling handset would simply stay
        // struggling, with no route back to the CSS fallback.
        if (p75 > UNPLAYABLE_FRAME_MS && tierRef.current >= TIER_ORDER.length - 1) {
          onUnplayable?.();
          return;
        }

        if (p75 > SLOW_FRAME_MS && tierRef.current < TIER_ORDER.length - 1) {
          tierRef.current += 1;
          const next = TIERS[TIER_ORDER[tierRef.current]];
          sim.dispose();
          const replacement = new FluidSimulation(gl, {
            ...next,
            aspect: size.width / size.height,
            config: { ...FLUID, inkFloor: INK.floor, inkGamma: INK.gamma },
          });
          simulationRef.current = replacement;
          uniforms.uDye.value = replacement.dyeTexture;
          uniforms.uDyeTexel.value.set(1 / replacement.dye.width, 1 / replacement.dye.height);
        }
      }
    }
  });

  return <InkPlane uniforms={uniforms} />;
}
