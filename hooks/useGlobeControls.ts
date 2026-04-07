import { useRef, useState, useCallback } from 'react';
import { useGestureStore } from '@/components/Gesture/GestureStore';
import { useGestureStream } from './useGestureStream';

const DEFAULT_ZOOM = 2.0;
const DEFAULT_SCALE = 1.0;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 5.0;
const MIN_SCALE = 0.4;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.05;
const SCALE_STEP = 0.03;

interface GlobeState {
  rotation: { x: number; y: number };
  scale: number;
  zoom: number;
}

/**
 * Translates gesture events from the store into globe transform values.
 * Returns rotation velocity, scale, and zoom radius that GlobeModel consumes.
 */
export function useGlobeControls(): GlobeState {
  const sensitivity = useGestureStore((s) => s.sensitivity);

  const [state, setState] = useState<GlobeState>({
    rotation: { x: 0, y: 0 },
    scale: DEFAULT_SCALE,
    zoom: DEFAULT_ZOOM,
  });

  const lockedRef = useRef(false);

  const handleGesture = useCallback(
    (event: import('@/components/Gesture/GestureClassifier').GestureEvent) => {
      if (event.type === 'FIST') {
        lockedRef.current = true;
        setState((prev) => ({
          ...prev,
          rotation: { x: 0, y: 0 },
        }));
        return;
      }

      if (event.type === 'INDEX_POINT_UP') {
        lockedRef.current = false;
        setState({
          rotation: { x: 0, y: 0 },
          scale: DEFAULT_SCALE,
          zoom: DEFAULT_ZOOM,
        });
        return;
      }

      if (lockedRef.current) return;

      switch (event.type) {
        case 'OPEN_PALM':
          setState((prev) => ({
            ...prev,
            rotation: {
              x: -event.delta.y * sensitivity * 2,
              y: -event.delta.x * sensitivity * 2,
            },
          }));
          break;

        case 'PINCH':
          setState((prev) => ({
            ...prev,
            rotation: { x: 0, y: 0 },
            zoom: Math.max(MIN_ZOOM, prev.zoom - ZOOM_STEP * sensitivity),
          }));
          break;

        case 'SPREAD':
          setState((prev) => ({
            ...prev,
            rotation: { x: 0, y: 0 },
            zoom: Math.min(MAX_ZOOM, prev.zoom + ZOOM_STEP * sensitivity),
          }));
          break;

        case 'TWO_HAND_PINCH':
          setState((prev) => ({
            ...prev,
            rotation: { x: 0, y: 0 },
            scale: Math.min(
              MAX_SCALE,
              prev.scale + SCALE_STEP * sensitivity
            ),
          }));
          break;

        case 'TWO_HAND_SPREAD':
          setState((prev) => ({
            ...prev,
            rotation: { x: 0, y: 0 },
            scale: Math.max(
              MIN_SCALE,
              prev.scale - SCALE_STEP * sensitivity
            ),
          }));
          break;

        default:
          // Gradually decelerate when no gesture
          setState((prev) => ({
            ...prev,
            rotation: {
              x: prev.rotation.x * 0.9,
              y: prev.rotation.y * 0.9,
            },
          }));
      }
    },
    [sensitivity]
  );

  useGestureStream(handleGesture, 16);

  return state;
}
