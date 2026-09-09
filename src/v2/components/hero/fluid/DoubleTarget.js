import * as THREE from 'three';

const TARGET_OPTIONS = {
  type: THREE.HalfFloatType,
  format: THREE.RGBAFormat,
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
  depthBuffer: false,
  stencilBuffer: false,
  generateMipmaps: false,
};

export function createTarget(width, height) {
  return new THREE.WebGLRenderTarget(width, height, { ...TARGET_OPTIONS });
}

/**
 * A ping-pong render target pair. Every simulation pass reads `read` and
 * writes `write`, then swaps — a texture can never be sampled and rendered
 * to in the same draw call, which is the constraint the whole chain is
 * structured around.
 */
export default class DoubleTarget {
  constructor(width, height) {
    this.a = createTarget(width, height);
    this.b = createTarget(width, height);
    this.width = width;
    this.height = height;
  }

  get read() {
    return this.a;
  }

  get write() {
    return this.b;
  }

  get texture() {
    return this.a.texture;
  }

  swap() {
    const t = this.a;
    this.a = this.b;
    this.b = t;
  }

  resize(width, height) {
    if (width === this.width && height === this.height) return;
    this.a.setSize(width, height);
    this.b.setSize(width, height);
    this.width = width;
    this.height = height;
  }

  dispose() {
    this.a.dispose();
    this.b.dispose();
  }
}
