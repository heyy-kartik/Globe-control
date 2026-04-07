'use client';

import { useState } from 'react';

interface Gesture {
  emoji: string;
  name: string;
  action: string;
  description: string;
}

const GESTURES: Gesture[] = [
  {
    emoji: '🖐',
    name: 'Open Palm',
    action: 'Rotate Globe',
    description: 'All 5 fingers extended. Move hand to rotate the globe.',
  },
  {
    emoji: '🤏',
    name: 'Pinch',
    action: 'Zoom In',
    description: 'Bring thumb and index finger together to zoom in.',
  },
  {
    emoji: '✌️',
    name: 'Spread',
    action: 'Zoom Out',
    description: 'Move thumb and index finger apart to zoom out.',
  },
  {
    emoji: '✊',
    name: 'Fist',
    action: 'Lock Position',
    description: 'Close all fingers to lock the globe in place.',
  },
  {
    emoji: '☝️',
    name: 'Index Point Up',
    action: 'Reset Globe',
    description: 'Point index finger up to reset to default position.',
  },
  {
    emoji: '👐',
    name: 'Two-Hand Pinch',
    action: 'Scale Up',
    description: 'Pinch with both hands and move them apart to enlarge the globe.',
  },
  {
    emoji: '🤲',
    name: 'Two-Hand Spread',
    action: 'Scale Down',
    description: 'Spread both hands inward while pinching to shrink the globe.',
  },
];

export default function GestureGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-900/80 hover:bg-gray-800 backdrop-blur-sm border border-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
        aria-label="Open gesture guide"
      >
        🤚 Gesture Guide
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Gesture Guide</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
                aria-label="Close gesture guide"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {GESTURES.map((g) => (
                <div
                  key={g.name}
                  className="flex items-start gap-3 bg-gray-800/60 rounded-xl p-3"
                >
                  <span className="text-3xl leading-none">{g.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold text-sm">
                        {g.name}
                      </span>
                      <span className="bg-blue-600 text-blue-100 text-xs px-2 py-0.5 rounded-full">
                        {g.action}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{g.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-xs mt-4 text-center">
              Allow camera access for gesture detection to work.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
