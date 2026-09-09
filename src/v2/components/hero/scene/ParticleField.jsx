import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../shaders/particles.glsl.js';
import useHalftoneTarget from '../hooks/useHalftoneTarget';

/** Particles that crossfade in as the blobs fade out, then resolve into the halftone mark. */
export default function ParticleField({ count, heroStateRef, mouseWorldRef, mouseStrengthRef, reducedMotion }) {
  const materialRef = useRef();
  const target = useHalftoneTarget(count);

  const geometry = useMemo(() => {
    const jitter = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      jitter[i * 3] = v.x;
      jitter[i * 3 + 1] = v.y;
      jitter[i * 3 + 2] = v.z;
      randoms[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    // Required placeholder — actual position is computed in the vertex
    // shader from aLiquidPos/aTargetPos, this attribute is never read.
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute('aJitterAxis', new THREE.BufferAttribute(jitter, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    return geo;
  }, [count]);

  useMemo(() => {
    if (!target) return;
    geometry.setAttribute('aLiquidPos', new THREE.BufferAttribute(target.liquidPositions, 3));
    geometry.setAttribute('aTargetPos', new THREE.BufferAttribute(target.targetPositions, 3));
  }, [target, geometry]);

  const uniforms = useMemo(
    () => ({
      uHaltoneProgress: { value: 0 },
      uParticleOpacity: { value: 0 },
      uTime: { value: 0 },
      uMouseWorld: { value: new THREE.Vector3(999, 999, 999) },
      uMouseStrength: { value: 0 },
      uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.75) : 1 },
      uBaseSize: { value: 34 },
      uColor: { value: new THREE.Color('#F6931E') },
    }),
    []
  );

  useFrame((_, delta) => {
    const heroState = heroStateRef.current;
    uniforms.uHaltoneProgress.value = heroState.haltoneProgress;
    uniforms.uParticleOpacity.value = heroState.particleProgress;
    if (!reducedMotion) uniforms.uTime.value += delta;
    uniforms.uMouseWorld.value.copy(mouseWorldRef.current);
    uniforms.uMouseStrength.value = mouseStrengthRef.current;
  });

  if (!target) return null;

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
