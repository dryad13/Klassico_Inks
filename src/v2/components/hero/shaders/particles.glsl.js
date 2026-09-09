// Point-sprite particles: interpolate between a loose "liquid" cloud and
// the halftone-sampled mark positions, plus idle ambient drift and a
// mouse-reactive jitter (the same "inject real perturbation" pattern used
// in InkBlob — see docs/hero-spec.md).

export const vertexShader = /* glsl */ `
  attribute vec3 aLiquidPos;
  attribute vec3 aTargetPos;
  attribute vec3 aJitterAxis;
  attribute float aRandom;

  uniform float uHaltoneProgress;
  uniform float uParticleOpacity;
  uniform float uTime;
  uniform vec3 uMouseWorld;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  uniform float uBaseSize;

  varying float vAlpha;

  void main() {
    vec3 pos = mix(aLiquidPos, aTargetPos, uHaltoneProgress);

    // Idle ambient drift — small, per-particle-phased.
    float driftPhase = uTime * 0.6 + aRandom * 6.28318;
    pos += aJitterAxis * sin(driftPhase) * 0.025;

    // Mouse stir: nearby particles get pushed along their own jitter axis.
    float distToMouse = distance(pos, uMouseWorld);
    float mouseFalloff = exp(-distToMouse * distToMouse * 1.5) * uMouseStrength;
    pos += aJitterAxis * mouseFalloff * 0.4;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float atten = uBaseSize * uPixelRatio / max(-mvPosition.z, 0.001);
    gl_PointSize = clamp(atten, 1.0, 14.0);

    vAlpha = uParticleOpacity;
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.15, d) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
