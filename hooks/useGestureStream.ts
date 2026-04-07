import { useEffect, useRef } from 'react';
import { useGestureStore } from '@/components/Gesture/GestureStore';
import type { GestureEvent } from '@/components/Gesture/GestureClassifier';

/**
 * Returns a throttled stream of gesture events.
 * @param intervalMs - Minimum ms between emitted events (default 50ms = 20fps)
 * @param callback - Called with the latest gesture event when the throttle fires
 */
export function useGestureStream(
  callback: (event: GestureEvent) => void,
  intervalMs = 50
) {
  const gesture = useGestureStore((s) => s.gesture);
  const lastFireRef = useRef<number>(0);
  // Keep a ref to the latest callback to avoid stale closure issues
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const now = Date.now();
    if (now - lastFireRef.current >= intervalMs) {
      lastFireRef.current = now;
      callbackRef.current(gesture);
    }
  }, [gesture, intervalMs]);
}
