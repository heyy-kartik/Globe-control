'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { TextureLoader, BackSide } from 'three';
import GlobeModel from './GlobeModel';

function MilkyWay() {
  const starmap = useLoader(TextureLoader, '/Gaia_EDR3_darkened.png');
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial map={starmap} side={BackSide} />
    </mesh>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      className="w-full h-full"
      gl={{ antialias: true }}
    >
      {/* Ambient light for overall brightness */}
      <ambientLight intensity={0.1} />
      
      {/* Directional "sun" light */}
      <directionalLight position={[5, 1, -2]} intensity={2.2} />
      
      {/* Subtle hemisphere light for day/night mood */}
      <hemisphereLight args={['#ffffff', '#000000', 0.2]} />

      <Suspense fallback={null}>
        <MilkyWay />
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
