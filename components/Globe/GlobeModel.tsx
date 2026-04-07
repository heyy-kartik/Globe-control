'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useSpring, animated } from '@react-spring/three';
import type { Mesh } from 'three';
import { useGlobeControls } from '@/hooks/useGlobeControls';

export default function GlobeModel() {
  const meshRef = useRef<Mesh>(null);
  const { rotation, scale, zoom } = useGlobeControls();

  // Load Earth texture from public assets
  const earthTexture = useLoader(
    TextureLoader,
    '/textures/earth_daymap.jpg'
  );

  // Smooth spring animation for globe state changes
  const { animScale } = useSpring({
    animScale: scale,
    config: { tension: 120, friction: 20 },
  });

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Apply rotation directly for responsive gesture feel
    meshRef.current.rotation.y += rotation.y * delta * 2;
    meshRef.current.rotation.x = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, meshRef.current.rotation.x + rotation.x * delta * 2)
    );
  });

  return (
    <animated.mesh ref={meshRef} scale={animScale}>
      <sphereGeometry args={[zoom, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture}
        roughness={0.8}
        metalness={0.1}
      />
    </animated.mesh>
  );
}
