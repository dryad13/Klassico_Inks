import { pigmentChunk } from './pigment.glsl.js';

/**
 * Density -> colour. This is the step that makes the sim read as process ink
 * rather than coloured fog, and it is worth understanding before tuning it.
 *
 * The dye target does not store colour. It stores four pigment CONCENTRATIONS
 * (C, M, Y, K), unbounded above 1.0. Colour is derived here by Beer-Lambert
 * absorption, which is subtractive:
 *
 *     cyan + magenta + yellow  ->  near black    (correct, registration black)
 *     cyan + magenta           ->  violet
 *     cyan + yellow            ->  green
 *
 * An additive RGB dye buffer gives the opposite (C+M+Y = white) and is the
 * usual reason these effects look like glowing smoke. exp(-tau) is also steep
 * near zero, so a wisp carrying 5% pigment stays a clean pale cyan instead of
 * greying out, and density has real headroom above 1.0 instead of clipping.
 *
 * Tune ABSORB_* to hit brand colour, never the dye injection itself.
 */
export const inkVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const inkFragment = /* glsl */ `
  ${pigmentChunk}

  varying vec2 vUv;
  varying vec3 vViewDir;

  uniform sampler2D uDye;
  uniform float uAspect;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uParallax;
  uniform float uDensity;
  uniform float uLegibility;
  uniform float uInkLight;
  uniform float uFloor;
  uniform float uGamma;
  uniform float uSaturation;
  uniform vec2 uDyeTexel;
  uniform float uSharpen;
  uniform float uAberration;
  uniform float uVignette;
  uniform float uFilmic;
  uniform float uGrain;
  uniform vec3 uDeepColor;
  uniform vec3 uTankColor;
  uniform vec3 uScatterColor;

  // Absorption spectra and density shaping live in shaders/pigment.glsl.js,
  // shared with the headline light probe. They are close to true process CMY
  // on purpose: pulling them toward the brand's green made every overlap read
  // olive, because a cyan that also absorbs blue has nowhere clean to mix. The
  // brand palette belongs in the medium, the UI and the type — the pigment
  // itself has to behave like pigment or the subtractive model buys nothing.

  // Three parallax slices of the same dye field, displaced along the view ray.
  // Because they are summed as optical depth rather than alpha-blended, they
  // composite in the physically correct order automatically, at one draw call.
  const vec3 LAYER_Z      = vec3(-0.60, 0.0, 0.45);
  const vec3 LAYER_SCALE  = vec3(0.94, 1.0, 1.07);
  const vec3 LAYER_WEIGHT = vec3(0.42, 1.0, 0.55);

  vec2 layerUv(float z, float scale) {
    vec2 centered = (vUv - 0.5) / scale;
    return centered + 0.5 + vViewDir.xy * z * uParallax;
  }

  vec3 opticalDepth(vec2 uv, float weight) {
    return opticalDepthOf(shapeDensity(texture2D(uDye, uv), uFloor, uGamma)) * weight;
  }

  // The medium itself: a backlit tank sitting inside the dark section ground.
  // Subtractive pigment can only remove light, so it needs something to remove
  // it FROM -- on a flat dark ground the ink would be invisible by definition.
  vec3 medium(vec2 uv) {
    vec2 p = uv - vec2(0.5, 0.54);
    p.x *= uAspect * 0.52;

    // Wide enough to reach the corner nozzles. The pigment is only visible
    // against lit medium, so a tight central pool leaves the two bottom
    // sprouts reading as dim smudges no matter how much dye they carry.
    float glow = 1.0 - smoothstep(0.02, 0.86, length(p));
    float caustic = 0.5 + 0.5 * sin(uv.x * 7.0 + uTime * 0.21)
                            * sin(uv.y * 5.0 - uTime * 0.17);

    return mix(uDeepColor, uTankColor, glow * (0.86 + caustic * 0.14));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uvFar  = layerUv(LAYER_Z.x, LAYER_SCALE.x);
    vec2 uvMid  = layerUv(LAYER_Z.y, LAYER_SCALE.y);
    vec2 uvNear = layerUv(LAYER_Z.z, LAYER_SCALE.z);

    vec3 tauMid = opticalDepth(uvMid, LAYER_WEIGHT.y);
    vec3 tau = opticalDepth(uvFar, LAYER_WEIGHT.x)
             + tauMid
             + opticalDepth(uvNear, LAYER_WEIGHT.z);

    // Unsharp mask, applied to optical DEPTH rather than to the finished
    // pixels. Sharpening density is what actually recovers the filament edges
    // that advection smeared; sharpening the composited image afterwards just
    // adds halos around the medium's gradient as well.
    vec2 t = uDyeTexel * 2.5;
    vec3 blur = 0.25 * (
        opticalDepth(uvMid + vec2(t.x, 0.0), LAYER_WEIGHT.y)
      + opticalDepth(uvMid - vec2(t.x, 0.0), LAYER_WEIGHT.y)
      + opticalDepth(uvMid + vec2(0.0, t.y), LAYER_WEIGHT.y)
      + opticalDepth(uvMid - vec2(0.0, t.y), LAYER_WEIGHT.y));
    tau = max(tau + (tauMid - blur) * uSharpen, 0.0);

    // Radial chromatic dispersion -- pigment edges refract, and real lenses
    // disperse more toward the frame edge. Not bloom: this shifts hue at
    // boundaries, it does not add luminance.
    vec2 radial = (vUv - 0.5) * uAberration;
    tau.r += opticalDepth(uvNear + radial, 0.06).r;
    tau.b += opticalDepth(uvNear - radial, 0.06).b;

    tau *= uDensity;

    // Legibility (docs/hero-fluid-spec.md section 9). The headline is 7.5rem
    // white type sitting directly on this, so pigment is thinned across the
    // text block. Elliptical, centred slightly above the tank's bright spot so
    // the two only partly overlap -- the ink still reads where it is densest.
    vec2 q = (vUv - vec2(0.5, 0.52)) * vec2(uAspect * 0.58, 1.0);
    float toText = length(q);
    tau *= mix(uLegibility, 1.0, smoothstep(0.09, 0.48, toText));

    vec3 transmission = exp(-tau);
    vec3 color = medium(vUv) * transmission;

    // Pigment in suspension scatters a little light as well as absorbing it,
    // which is what keeps dense plumes from going flat black. Kept very low --
    // push this and it turns into the neon-smoke look we are avoiding.
    //
    // The scattered light must carry the LOCAL pigment's hue. A single fixed
    // tint here (this was cyan) gets added to every plume, which pushes
    // magenta toward white and yellow toward green -- it reads as a general
    // wash and quietly cancels a lot of the chroma the absorption model just
    // produced. Sampling transmission at reduced depth gives a stable hue even
    // where the core is dense enough that exp(-tau) has gone to zero.
    float density = 1.0 - min(transmission.r, min(transmission.g, transmission.b));
    vec3 scatterHue = exp(-tau * 0.3);
    color += scatterHue * uScatterColor * density * density * 0.11;

    // Ink light. Pigment arriving near the headline throws its own colour onto
    // the type block, so the jets read as lighting the words rather than just
    // passing behind them. Tinted by scatterHue, so a cyan jet spills cyan and
    // a yellow one spills yellow — a fixed tint here would read as a generic
    // glow and break the connection to whichever jet is actually close.
    float spill = 1.0 - smoothstep(0.0, 0.46, toText);
    color += scatterHue * density * spill * uInkLight;

    // Final chroma lift. The medium is a coloured backlight, so every pigment
    // hue is multiplied by it and loses some saturation on the way out; this
    // buys that back without brightening the plane or washing out the type.
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = max(mix(vec3(luma), color, uSaturation), 0.0);

    // Filmic S-curve: deepens the shadows and firms up the highlights without
    // the clipping a straight contrast multiply would cause.
    vec3 curved = color * color * (3.0 - 2.0 * color);
    color = mix(color, curved, uFilmic);

    // Vignette. Aspect-corrected so it stays circular on wide viewports.
    vec2 v = (vUv - 0.5) * vec2(uAspect * 0.62, 1.0);
    color *= 1.0 - uVignette * smoothstep(0.25, 0.95, length(v));

    float edgeFade = smoothstep(0.0, 0.045, vUv.x) * smoothstep(1.0, 0.955, vUv.x)
                   * smoothstep(0.0, 0.045, vUv.y) * smoothstep(1.0, 0.955, vUv.y);

    gl_FragColor = vec4(color, uOpacity * edgeFade);

    // ShaderMaterial gets no automatic output conversion: three only injects
    // this chunk where it is asked for. Without it the linear values above are
    // written straight into an sRGB-interpreted buffer and the whole hero
    // renders roughly four stops dark, which reads as "the ink isn't working"
    // rather than as a colour management bug.
    #include <colorspace_fragment>

    // Dither LAST, in output space. The medium is a wide smooth gradient, which
    // is exactly the content that bands on an 8-bit framebuffer; a sub-LSB of
    // noise breaks the contours up. Applying it before the conversion above
    // would be the wrong magnitude in the shadows, where sRGB expands most.
    gl_FragColor.rgb += (hash(gl_FragCoord.xy) - 0.5) * uGrain / 255.0;
  }
`;

export default inkFragment;
