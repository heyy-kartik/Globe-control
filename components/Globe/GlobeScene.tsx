'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import GlobeModel from './GlobeModel';

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      className="w-full h-full"
      gl={{ antialias: true }}
    >
      {/* Ambient light for overall brightness */}
      <ambientLight intensity={0.4} />
      {/* Directional "sun" light */}
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      {/* Subtle hemisphere light for day/night mood */}
      <hemisphereLight args={['#1a2a4a', '#000010', 0.3]} />

      {/* Starfield background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />

      <Suspense fallback={null}>
        <GlobeModel />
      </Suspense>

      {/* OrbitControls as fallback for mouse/touch */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        makeDefault
      />
    </Canvas>
  );
}
