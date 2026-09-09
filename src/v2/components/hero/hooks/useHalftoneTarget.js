import { useEffect, useState } from 'react';
import logoUrl from '../../../../assets/klassico-logo.png';
import { HALFTONE_CROP_TOP, HALFTONE_CROP_BOTTOM } from '../constants';

const SAMPLE_WIDTH = 128;
// Roughly matches the blobs' home-position footprint (~x:[-1.5,1.5]) so the
// resolved mark reads at a comparable scale, not swimming in empty space.
const SCENE_WIDTH = 3.2;

/**
 * Samples the icon region of the Klassico logo (crop excludes the
 * "KLASSICO INKS." wordmark — its fine detail wouldn't resolve at any sane
 * particle count) into two Float32Arrays: a loose starting "liquid" cloud
 * and the halftone target positions particles resolve into. One-time work,
 * memoized per particle count — not per-frame.
 */
export default function useHalftoneTarget(particleCount) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (cancelled) return;

      const cropTopPx = Math.round(img.naturalHeight * HALFTONE_CROP_TOP);
      const cropBottomPx = Math.round(img.naturalHeight * HALFTONE_CROP_BOTTOM);
      const cropH = cropBottomPx - cropTopPx;
      const cropW = img.naturalWidth;

      const sampleW = SAMPLE_WIDTH;
      const sampleH = Math.max(1, Math.round(SAMPLE_WIDTH * (cropH / cropW)));

      const canvas = document.createElement('canvas');
      canvas.width = sampleW;
      canvas.height = sampleH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, cropTopPx, cropW, cropH, 0, 0, sampleW, sampleH);

      const { data } = ctx.getImageData(0, 0, sampleW, sampleH);
      const candidates = [];
      for (let y = 0; y < sampleH; y += 1) {
        for (let x = 0; x < sampleW; x += 1) {
          const alpha = data[(y * sampleW + x) * 4 + 3];
          if (alpha > 128) {
            const nx = (x / sampleW - 0.5) * SCENE_WIDTH;
            const ny = -(y / sampleH - 0.5) * SCENE_WIDTH * (sampleH / sampleW);
            candidates.push(nx, ny, (Math.random() - 0.5) * 0.15);
          }
        }
      }

      const targetPositions = new Float32Array(particleCount * 3);
      const liquidPositions = new Float32Array(particleCount * 3);
      const candidateCount = candidates.length / 3;

      for (let i = 0; i < particleCount; i += 1) {
        if (candidateCount > 0) {
          const c = Math.floor(Math.random() * candidateCount);
          targetPositions[i * 3] = candidates[c * 3];
          targetPositions[i * 3 + 1] = candidates[c * 3 + 1];
          targetPositions[i * 3 + 2] = candidates[c * 3 + 2];
        }

        // Loose starting cloud: scattered within a sphere near the blobs'
        // converged cluster, not tied to any single blob's live geometry.
        const r = 0.9 * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        liquidPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        liquidPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        liquidPositions[i * 3 + 2] = r * Math.cos(phi);
      }

      setResult({ liquidPositions, targetPositions });
    };

    img.src = logoUrl;
    return () => {
      cancelled = true;
    };
  }, [particleCount]);

  return result;
}
