/**
 * Semi-Lagrangian advection: for each cell, trace the velocity field backward
 * one timestep and fetch what was there. Used twice per frame — once to
 * advect velocity through itself, once to carry the CMYK dye field.
 *
 * uDecay is computed CPU-side as pow(dissipation, dt * 60) so dissipation
 * reads as a per-frame multiplier near 1.0 while staying framerate-independent.
 */
export const advectionFragment = /* glsl */ `
  varying vec2 vUv;

  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDt;
  uniform float uDecay;
  uniform float uDrainHeight;
  uniform float uDrainDecay;

  void main() {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;

    // Extra decay in a band along the bottom edge, so pigment that does reach
    // the floor drains instead of accumulating. The frame's bottom is an
    // artificial wall, not a real tank floor; without a sink there, whatever
    // settles just keeps building up and reads as sludge. Set uDrainDecay to
    // 1.0 to disable — the velocity pass does exactly that.
    float band = 1.0 - smoothstep(0.0, uDrainHeight, vUv.y);
    gl_FragColor = texture2D(uSource, coord) * uDecay * mix(1.0, uDrainDecay, band);
  }
`;

export default advectionFragment;
