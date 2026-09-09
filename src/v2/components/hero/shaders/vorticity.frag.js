/**
 * Vorticity confinement: push energy back into the small rotational features
 * that the semi-Lagrangian advection step numerically smears away.
 *
 * This is the tendril knob. Below ~15 the plumes fall as smooth sheets; above
 * ~40 they shred into noise inside a second. Tune uCurl before anything else,
 * and never trade it away for performance — it is the whole look.
 */
export const vorticityFragment = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;

  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float uCurl_;
  uniform float uDt;

  void main() {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= uCurl_ * C;
    force.y *= -1.0;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * uDt;
    velocity = clamp(velocity, -1000.0, 1000.0);

    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export default vorticityFragment;
