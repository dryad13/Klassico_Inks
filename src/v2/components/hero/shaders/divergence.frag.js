/**
 * Divergence of the velocity field — how much fluid each cell is gaining or
 * losing. The pressure solve then cancels it, which is what makes the ink
 * swirl and fold instead of dissipating radially like a gas.
 *
 * The four boundary tests impose free-slip walls: velocity mirrors at the
 * viewport edge so plumes slide along it rather than pouring out of frame.
 */
export const divergenceFragment = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;

  uniform sampler2D uVelocity;

  void main() {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;

    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }

    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`;

export default divergenceFragment;
