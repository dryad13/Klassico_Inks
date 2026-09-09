import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { inkVertex, inkFragment } from '../shaders/ink.frag.js';
import { CAMERA } from '../constants';

/**
 * The presentation surface: one screen-filling plane that samples the dye
 * field three times along the view ray and sums the results as optical depth.
 *
 * Three separate meshes at different z would be the obvious reading of
 * "depth layers", but summing tau in a single pass is both cheaper (one draw
 * call) and more correct — absorption composites by addition regardless of
 * ordering, so there is no transparency sort to get wrong. The parallax is
 * real: the offsets derive from the actual view direction, so the camera
 * dolly in FluidScene produces genuine relative motion between slices.
 *
 * Sized for the camera's farthest dolly position, so pushing in only ever
 * over-covers the frustum. Under-covering shows the section ground at the
 * edges, which reads as a bug.
 */
export default function InkPlane({ uniforms }) {
  const { size } = useThree();

  const scale = useMemo(() => {
    const height = 2 * Math.tan((CAMERA.fov * Math.PI) / 360) * CAMERA.z;
    const aspect = size.width / size.height;
    return [height * aspect * 1.02, height * 1.02, 1];
  }, [size.width, size.height]);

  return (
    <mesh scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={inkVertex}
        fragmentShader={inkFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
