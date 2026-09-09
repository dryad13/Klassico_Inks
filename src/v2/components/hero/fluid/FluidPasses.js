import * as THREE from 'three';
import { baseVertex } from '../shaders/base.vert.js';
import { advectionFragment } from '../shaders/advection.frag.js';
import { divergenceFragment } from '../shaders/divergence.frag.js';
import { pressureFragment } from '../shaders/pressure.frag.js';
import { gradientSubtractFragment } from '../shaders/gradientSubtract.frag.js';
import { curlFragment } from '../shaders/curl.frag.js';
import { vorticityFragment } from '../shaders/vorticity.frag.js';
import { splatFragment } from '../shaders/splat.frag.js';
import { bodyForceFragment } from '../shaders/bodyForce.frag.js';
import { probeFragment } from '../shaders/probe.frag.js';

/** Simulation passes overwrite every fragment, so blending and depth are pure cost. */
function passMaterial(fragmentShader, uniforms) {
  return new THREE.ShaderMaterial({
    vertexShader: baseVertex,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
}

export function createPasses() {
  const texel = { value: new THREE.Vector2() };

  return {
    advection: passMaterial(advectionFragment, {
      uTexelSize: texel,
      uVelocity: { value: null },
      uSource: { value: null },
      uDt: { value: 0 },
      uDecay: { value: 1 },
      uDrainHeight: { value: 0.16 },
      uDrainDecay: { value: 1 },
    }),
    divergence: passMaterial(divergenceFragment, {
      uTexelSize: texel,
      uVelocity: { value: null },
    }),
    pressure: passMaterial(pressureFragment, {
      uTexelSize: texel,
      uPressure: { value: null },
      uDivergence: { value: null },
    }),
    gradientSubtract: passMaterial(gradientSubtractFragment, {
      uTexelSize: texel,
      uPressure: { value: null },
      uVelocity: { value: null },
    }),
    curl: passMaterial(curlFragment, {
      uTexelSize: texel,
      uVelocity: { value: null },
    }),
    vorticity: passMaterial(vorticityFragment, {
      uTexelSize: texel,
      uVelocity: { value: null },
      uCurl: { value: null },
      uCurl_: { value: 0 },
      uDt: { value: 0 },
    }),
    splat: passMaterial(splatFragment, {
      uTexelSize: texel,
      uTarget: { value: null },
      uColor: { value: new THREE.Vector4() },
      uPoint: { value: new THREE.Vector2() },
      uRadius: { value: 0.0045 },
      uAspect: { value: 1 },
      uAxis: { value: new THREE.Vector2(0, -1) },
      uElongation: { value: 1 },
    }),
    bodyForce: passMaterial(bodyForceFragment, {
      uTexelSize: texel,
      uVelocity: { value: null },
      uDye: { value: null },
      uDt: { value: 0 },
      uGravity: { value: 0 },
      uFloorFade: { value: 0.3 },
      uDensityWeights: { value: new THREE.Vector4(1, 1, 1, 1) },
    }),
    // Shared so one write updates every pass's neighbour offsets on resize.
    sharedTexel: texel,
  };
}

/**
 * The headline light probe. Separate from createPasses because it is not part
 * of the per-frame simulation chain — it runs every few frames only.
 *
 * uBand is the region of the dye field sampled, in UV: the headline block plus
 * a margin, so a jet arriving near the type registers before it crosses it.
 */
export function createProbePass(config) {
  return new THREE.ShaderMaterial({
    vertexShader: baseVertex,
    fragmentShader: probeFragment,
    uniforms: {
      uTexelSize: { value: new THREE.Vector2(1, 1) },
      uDye: { value: null },
      uBand: { value: new THREE.Vector4(0.22, 0.42, 0.56, 0.30) },
      uFloor: { value: config.inkFloor },
      uGamma: { value: config.inkGamma },
    },
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
}
