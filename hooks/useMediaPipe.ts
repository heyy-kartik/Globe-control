import { useEffect, useRef, useState } from 'react';
import type { Results } from '@mediapipe/hands';

interface UseMediaPipeOptions {
  enabled: boolean;
  onResults: (results: Results) => void;
}

/**
 * Manages the MediaPipe Hands lifecycle:
 * - Obtains the singleton Hands instance
 * - Starts and stops the camera stream
 * - Sends frames to MediaPipe via requestAnimationFrame
 */
export function useMediaPipe({ enabled, onResults }: UseMediaPipeOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }

    let animationId: number;
    let stream: MediaStream | null = null;
    let hands: import('@mediapipe/hands').Hands | null = null;

    async function init() {
      try {
        const { getHandsInstance } = await import('@/lib/mediapipe');
        hands = await getHandsInstance();
        hands.onResults(onResults);

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise<void>((resolve) => {
            videoRef.current!.onloadeddata = () => resolve();
          });
          setReady(true);
        }

        const tick = async () => {
          if (videoRef.current && hands && videoRef.current.readyState >= 2) {
            await hands.send({ image: videoRef.current });
          }
          animationId = requestAnimationFrame(tick);
        };

        animationId = requestAnimationFrame(tick);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'MediaPipe initialization failed';
        setError(message);
        console.error(message, err);
      }
    }

    init();

    return () => {
      cancelAnimationFrame(animationId);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [enabled, onResults]);

  return { videoRef, error, ready };
}
