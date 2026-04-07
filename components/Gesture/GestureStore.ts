import { create } from 'zustand';
import type { GestureEvent, GestureType } from './GestureClassifier';

interface GestureState {
  gesture: GestureEvent;
  sensitivity: number;
  cameraEnabled: boolean;
  showOverlay: boolean;
  setGesture: (event: GestureEvent) => void;
  setSensitivity: (value: number) => void;
  setCameraEnabled: (value: boolean) => void;
  setShowOverlay: (value: boolean) => void;
  resetGesture: () => void;
}

const defaultGesture: GestureEvent = {
  type: 'NONE',
  confidence: 0,
  delta: { x: 0, y: 0 },
};

export const useGestureStore = create<GestureState>((set) => ({
  gesture: defaultGesture,
  sensitivity: 1.0,
  cameraEnabled: true,
  showOverlay: true,

  setGesture: (event) => set({ gesture: event }),
  setSensitivity: (value) => set({ sensitivity: value }),
  setCameraEnabled: (value) => set({ cameraEnabled: value }),
  setShowOverlay: (value) => set({ showOverlay: value }),
  resetGesture: () => set({ gesture: defaultGesture }),
}));
