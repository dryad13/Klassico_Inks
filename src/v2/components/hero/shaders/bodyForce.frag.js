/**
 * Gravity proportional to local pigment density.
 *
 * This is the step that separates ink from smoke. Pigment is *denser* than the
 * medium it is injected into, so uGravity is negative and the plumes fall and
 * spread. Smoke sims use the same term with the sign flipped and call it
 * buoyancy; using that sign here produces four rising mushroom clouds.
 *
 * The force is tapered near the floor — see uFloorFade below.
 */
export const bodyForceFragment = /* glsl */ `
  varying vec2 vUv;

  uniform sampler2D uVelocity;
  uniform sampler2D uDye;
  uniform float uDt;
  uniform float uGravity;
  uniform float uFloorFade;
  uniform vec4 uDensityWeights;

  void main() {
    vec4 d = texture2D(uDye, vUv);

    // Weighted, NOT a raw channel sum. A nozzle's injection rate is a TINTING
    // strength — how strongly that pigment colours — and conflating it with
    // mass makes a hot channel physically heavier. Black injects at 2.2x to
    // hold its own against chromatic pigments, and with a raw sum that gave
    // its plume 2.2x the gravity: firing upward from a bottom corner, it
    // simply could not climb, while the other bottom jet did. The weights
    // divide the rates back out so all four behave the same dynamically.
    float density = dot(d, uDensityWeights);

    vec2 velocity = texture2D(uVelocity, vUv).xy;

    // Gravity fades out near the bottom edge. It applies to all pigment
    // everywhere, so at full strength it keeps pressing ink that has already
    // settled into the floor, where free-slip walls smear it sideways with
    // nowhere to go — the two upward jets end up as a pool along the bottom
    // rather than plumes. Above the fade height it behaves normally.
    float settle = smoothstep(0.0, uFloorFade, vUv.y);
    velocity.y += uGravity * density * settle * uDt;

    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export default bodyForceFragment;
