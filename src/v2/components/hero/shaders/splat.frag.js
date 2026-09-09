/**
 * Additive gaussian injection. Used for both fields:
 *   velocity — uColor = vec4(vx, vy, 0, 0), momentum from a nozzle or pointer
 *   dye      — uColor = channelMask * amount, pigment into exactly one of CMYK
 *
 * uRadius is squared-distance falloff, so it is small (~0.0004), not a radius
 * in UV. uAspect keeps the splat round on wide viewports.
 *
 * The gaussian is ANISOTROPIC — stretched by uElongation along uAxis. This is
 * what makes a jet a jet. A circular splat is a point source of momentum, and
 * in incompressible flow a point source spreads radially and recirculates: it
 * can only ever produce a bloom. Driving the fluid along a line instead gives
 * the stream a coherent core that travels, then breaks up downstream — which
 * is what a real jet does. Set uElongation to 1 for the isotropic case.
 */
export const splatFragment = /* glsl */ `
  varying vec2 vUv;

  uniform sampler2D uTarget;
  uniform vec4 uColor;
  uniform vec2 uPoint;
  uniform float uRadius;
  uniform float uAspect;
  uniform vec2 uAxis;
  uniform float uElongation;

  void main() {
    vec2 p = vUv - uPoint;
    p.x *= uAspect;

    vec2 across = vec2(-uAxis.y, uAxis.x);
    vec2 q = vec2(dot(p, uAxis) / uElongation, dot(p, across));

    float falloff = exp(-dot(q, q) / uRadius);
    gl_FragColor = texture2D(uTarget, vUv) + uColor * falloff;
  }
`;

export default splatFragment;
