/**
 * The fluid hero needs half-float render targets, which means WebGL2 plus
 * EXT_color_buffer_float. That is a real population of devices, not a
 * theoretical one — without the extension the simulation renders black
 * rather than failing loudly, so this must be checked up front.
 */
export function supportsFluidHero() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    return !!gl.getExtension('EXT_color_buffer_float');
  } catch {
    return false;
  }
}

/** True when the fluid hero cannot run — use the CSS pigment fallback instead. */
export function shouldPreferCssPigment() {
  return !supportsFluidHero();
}
