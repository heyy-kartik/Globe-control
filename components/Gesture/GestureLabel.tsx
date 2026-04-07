'use client';

import { useGestureStore } from './GestureStore';

const GESTURE_LABELS: Record<string, { label: string; color: string }> = {
  OPEN_PALM: { label: '🖐 Open Palm — Rotate', color: 'bg-blue-500' },
  PINCH: { label: '🤏 Pinch — Zoom In', color: 'bg-green-500' },
  SPREAD: { label: '✌️ Spread — Zoom Out', color: 'bg-yellow-500' },
  FIST: { label: '✊ Fist — Lock', color: 'bg-red-500' },
  INDEX_POINT_UP: { label: '☝️ Point Up — Reset', color: 'bg-purple-500' },
  TWO_HAND_PINCH: { label: '👐 Two-Hand Pinch — Scale Up', color: 'bg-cyan-500' },
  TWO_HAND_SPREAD: {
    label: '🤲 Two-Hand Spread — Scale Down',
    color: 'bg-orange-500',
  },
  NONE: { label: 'No gesture detected', color: 'bg-gray-600' },
};

export default function GestureLabel() {
  const gesture = useGestureStore((s) => s.gesture);

  const info = GESTURE_LABELS[gesture.type] ?? GESTURE_LABELS['NONE'];

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg transition-all duration-300 ${info.color}`}
      style={{ zIndex: 50 }}
    >
      {info.label}
      {gesture.confidence > 0 && (
        <span className="ml-2 opacity-70 text-xs">
          {Math.round(gesture.confidence * 100)}%
        </span>
      )}
    </div>
  );
}
