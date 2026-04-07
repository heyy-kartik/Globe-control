'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import GestureLabel from '@/components/Gesture/GestureLabel';
import GestureGuide from '@/components/UI/GestureGuide';
import SettingsPanel from '@/components/UI/SettingsPanel';

// Dynamically import components that require browser APIs
const GlobeScene = dynamic(() => import('@/components/Globe/GlobeScene'), {
  ssr: false,
});
const MediaPipeSetup = dynamic(
  () => import('@/components/Camera/MediaPipeSetup'),
  { ssr: false }
);

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="relative w-screen h-screen bg-black overflow-hidden">
      {/* 3D Globe — fills the full screen */}
      <div className="absolute inset-0">
        <GlobeScene />
      </div>

      {/* Camera + hand overlay — bottom-left corner */}
      <div className="absolute bottom-20 left-4 w-48 h-36 rounded-xl overflow-hidden border border-gray-700 shadow-lg bg-black/30">
        <MediaPipeSetup />
      </div>

      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-white text-xl font-bold tracking-tight drop-shadow-lg">
            🌍 EarthControls
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Hand-gesture powered 3D globe
          </p>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <GestureGuide />
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className="bg-gray-900/80 hover:bg-gray-800 backdrop-blur-sm border border-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            aria-label="Toggle settings"
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      {/* Settings panel — slides in from the right */}
      {settingsOpen && (
        <div className="absolute top-16 right-6 z-40">
          <SettingsPanel />
        </div>
      )}

      {/* Gesture label badge */}
      <GestureLabel />
    </main>
  );
}
