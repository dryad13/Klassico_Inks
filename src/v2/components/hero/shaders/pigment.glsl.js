/**
 * Shared pigment model. Included by both ink.frag (what you see) and
 * probe.frag (what drives the CSS light on the headline) so the two cannot
 * disagree about what colour a given dye sample is — a probe that drifts from
 * the render would spill the wrong colour onto the type, which is worse than
 * no spill at all.
 *
 * See ink.frag for why absorption is subtractive and why these are close to
 * true process CMY rather than tuned to brand colour.
 */
export const pigmentChunk = /* glsl */ `
  const vec3 ABSORB_C = vec3(3.05, 0.13, 0.05);
  const vec3 ABSORB_M = vec3(0.18, 2.85, 0.19);
  const vec3 ABSORB_Y = vec3(0.05, 0.15, 3.15);
  // Slightly BLUE-weighted rather than flat. With equal-or-lower blue
  // absorption, dense black passes the medium's blue through and reads as a
  // violet shadow instead of as ink — worse still next to magenta, which
  // pushes the same direction. Absorbing a little more blue keeps it neutral
  // against a cool medium.
  const vec3 ABSORB_K = vec3(2.42, 2.40, 2.58);

  // Clears the low-density haze semi-Lagrangian advection smears everywhere,
  // then steepens what remains so plume boundaries stay defined.
  vec4 shapeDensity(vec4 d, float floorLevel, float gamma) {
    return pow(max(d - floorLevel, 0.0), vec4(gamma));
  }

  vec3 opticalDepthOf(vec4 shaped) {
    return shaped.r * ABSORB_C + shaped.g * ABSORB_M
         + shaped.b * ABSORB_Y + shaped.a * ABSORB_K;
  }
`;

export default pigmentChunk;
