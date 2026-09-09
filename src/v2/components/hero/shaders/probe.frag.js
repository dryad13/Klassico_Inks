import { pigmentChunk } from './pigment.glsl.js';

/**
 * Renders the pigment sitting over the headline into a 16x8 buffer, which the
 * CPU reads back once every few frames to drive a CSS light on the HTML type.
 *
 * Output is the pigment's own hue weighted by how much of it there is, so
 * averaging the buffer gives both the colour and the strength of the light in
 * one read. Deliberately tiny: readPixels is a synchronous stall, and the
 * result only has to be right enough to tint a text-shadow.
 */
export const probeFragment = /* glsl */ `
  varying vec2 vUv;

  uniform sampler2D uDye;
  uniform vec4 uBand;
  uniform float uFloor;
  uniform float uGamma;

  ${pigmentChunk}

  void main() {
    vec2 uv = uBand.xy + vUv * uBand.zw;

    vec4 shaped = shapeDensity(texture2D(uDye, uv), uFloor, uGamma);
    vec3 tau = opticalDepthOf(shaped);

    vec3 transmission = exp(-tau);
    float amount = 1.0 - min(transmission.r, min(transmission.g, transmission.b));

    gl_FragColor = vec4(exp(-tau * 0.3) * amount, 1.0);
  }
`;

export default probeFragment;
