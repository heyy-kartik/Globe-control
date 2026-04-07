'use client';

import { useEffect, useRef, useState } from 'react';
import type { Results } from '@mediapipe/hands';
import { useGestureStore } from '../Gesture/GestureStore';
import { GestureClassifier } from '../Gesture/GestureClassifier';
import HandOverlay from './HandOverlay';

export default function MediaPipeSetup() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [results, setResults] = useState<Results | null>(null);
  const cameraEnabled = useGestureStore((s) => s.cameraEnabled);
  const setGesture = useGestureStore((s) => s.setGesture);
  const prevPinchDist = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!cameraEnabled) return;

    let animationId: number;
    let hands: import('@mediapipe/hands').Hands | null = null;
    let stream: MediaStream | null = null;

    async function setup() {
      const { getHandsInstance } = await import('@/lib/mediapipe');
      hands = await getHandsInstance();

      hands.onResults((res: Results) => {
        setResults(res);

        if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
          const event = GestureClassifier.classify(
            res.multiHandLandmarks,
            prevPinchDist.current
          );
          prevPinchDist.current = event.delta.pinchDistance;
          setGesture(event);
        } else {
          setGesture({ type: 'NONE', confidence: 0, delta: { x: 0, y: 0 } });
          prevPinchDist.current = undefined;
        }
      });

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadeddata = () => resolve();
            }
          });
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        return;
      }

      const processFrame = async () => {
        if (videoRef.current && hands && videoRef.current.readyState >= 2) {
          await hands.send({ image: videoRef.current });
        }
        animationId = requestAnimationFrame(processFrame);
      };

      animationId = requestAnimationFrame(processFrame);
    }

    setup();

    return () => {
      cancelAnimationFrame(animationId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraEnabled, setGesture]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />
      <HandOverlay results={results} width={640} height={480} />
    </div>
  );
}
