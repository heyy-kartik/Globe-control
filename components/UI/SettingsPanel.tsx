'use client';

import { useGestureStore } from '../Gesture/GestureStore';

export default function SettingsPanel() {
  const sensitivity = useGestureStore((s) => s.sensitivity);
  const setSensitivity = useGestureStore((s) => s.setSensitivity);
  const cameraEnabled = useGestureStore((s) => s.cameraEnabled);
  const setCameraEnabled = useGestureStore((s) => s.setCameraEnabled);
  const showOverlay = useGestureStore((s) => s.showOverlay);
  const setShowOverlay = useGestureStore((s) => s.setShowOverlay);

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 w-64 text-white">
      <h2 className="text-lg font-bold mb-4">⚙️ Settings</h2>

      {/* Camera toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-300">Camera</span>
        <button
          onClick={() => setCameraEnabled(!cameraEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            cameraEnabled ? 'bg-blue-500' : 'bg-gray-600'
          }`}
          aria-label="Toggle camera"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              cameraEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Overlay toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-300">Hand Overlay</span>
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showOverlay ? 'bg-blue-500' : 'bg-gray-600'
          }`}
          aria-label="Toggle overlay"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showOverlay ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Sensitivity slider */}
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-300">Sensitivity</span>
          <span className="text-sm text-gray-400">{sensitivity.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min={0.2}
          max={3.0}
          step={0.1}
          value={sensitivity}
          onChange={(e) => setSensitivity(parseFloat(e.target.value))}
          className="w-full accent-blue-500"
          aria-label="Gesture sensitivity"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Subtle</span>
          <span>Responsive</span>
        </div>
      </div>
    </div>
  );
}
