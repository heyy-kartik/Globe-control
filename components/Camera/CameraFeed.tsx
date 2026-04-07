'use client';

import { useEffect, useRef } from 'react';
import { useGestureStore } from '../Gesture/GestureStore';

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraEnabled = useGestureStore((s) => s.cameraEnabled);

  useEffect(() => {
    if (!cameraEnabled) {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraEnabled]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 w-full h-full object-cover"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
}
