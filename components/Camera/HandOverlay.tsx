'use client';

import { useEffect, useRef } from 'react';
import type { NormalizedLandmark, Results } from '@mediapipe/hands';
import { useGestureStore } from '../Gesture/GestureStore';

// Landmark connections for drawing the hand skeleton
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],   // thumb
  [0, 5], [5, 6], [6, 7], [7, 8],   // index
  [0, 9], [9, 10], [10, 11], [11, 12], // middle
  [0, 13], [13, 14], [14, 15], [15, 16], // ring
  [0, 17], [17, 18], [18, 19], [19, 20], // pinky
  [5, 9], [9, 13], [13, 17],          // palm
];

interface HandOverlayProps {
  results: Results | null;
  width: number;
  height: number;
}

export default function HandOverlay({
  results,
  width,
  height,
}: HandOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const showOverlay = useGestureStore((s) => s.showOverlay);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showOverlay || !results?.multiHandLandmarks) return;

    results.multiHandLandmarks.forEach((landmarks) => {
      drawSkeleton(ctx, landmarks, canvas.width, canvas.height);
    });
  }, [results, showOverlay]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
}

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  w: number,
  h: number
): void {
  // Draw connections
  ctx.strokeStyle = 'rgba(0, 255, 150, 0.8)';
  ctx.lineWidth = 2;
  HAND_CONNECTIONS.forEach(([a, b]) => {
    const lmA = landmarks[a];
    const lmB = landmarks[b];
    if (!lmA || !lmB) return;
    ctx.beginPath();
    ctx.moveTo(lmA.x * w, lmA.y * h);
    ctx.lineTo(lmB.x * w, lmB.y * h);
    ctx.stroke();
  });

  // Draw landmark dots
  landmarks.forEach((lm, i) => {
    const x = lm.x * w;
    const y = lm.y * h;
    ctx.beginPath();
    ctx.arc(x, y, i === 0 ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = i === 4 || i === 8 ? 'rgba(255, 80, 80, 1)' : 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
  });
}
