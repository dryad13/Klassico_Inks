/**
 * Shared vertex shader for every simulation pass. Draws a PlaneGeometry(2,2)
 * as a fullscreen quad by writing clip space directly — camera matrices are
 * deliberately ignored, so the same dummy camera works for all passes.
 *
 * The four neighbour varyings are computed here rather than in each fragment
 * shader: neighbour lookups are the inner loop of divergence/pressure/curl,
 * and doing the offset math per-vertex (4 vertices) instead of per-fragment
 * (up to 1M) is the single cheapest win in the whole chain.
 */
export const baseVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;

  uniform vec2 uTexelSize;

  void main() {
    vUv = uv;
    vL = vUv - vec2(uTexelSize.x, 0.0);
    vR = vUv + vec2(uTexelSize.x, 0.0);
    vT = vUv + vec2(0.0, uTexelSize.y);
    vB = vUv - vec2(0.0, uTexelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export default baseVertex;
