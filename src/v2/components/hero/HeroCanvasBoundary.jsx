import { useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import PigmentField from './PigmentField';
import FluidScene from './scene/FluidScene';
import { CAMERA } from './constants';

/** Owns the R3F <Canvas> and its WebGL-context-loss fallback. */
export default function HeroCanvasBoundary({ quality, lightTargetRef, active = true, onUnplayable }) {
  const [contextLost, setContextLost] = useState(false);

  const handleCreated = useCallback(({ gl }) => {
    gl.domElement.addEventListener(
      'webglcontextlost',
      (e) => {
        e.preventDefault();
        setContextLost(true);
      },
      false
    );
  }, []);

  if (contextLost) return <PigmentField animated={!quality.reducedMotion} />;

  const dpr =
    typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, quality.maxDpr)
      : 1;

  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, CAMERA.z], fov: CAMERA.fov, near: CAMERA.near, far: CAMERA.far }}
        dpr={[1, dpr]}
        // 'never' halts the render loop outright when the hero is off-screen
        // or the tab is hidden. FluidScene clamps its delta, so resuming after
        // a long pause steps the field forward normally instead of advecting
        // it off screen in one frame.
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={handleCreated}
      >
        <FluidScene quality={quality} lightTargetRef={lightTargetRef} onUnplayable={onUnplayable} />
      </Canvas>
    </div>
  );
}
