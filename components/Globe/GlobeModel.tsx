'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Color, AdditiveBlending, MeshStandardMaterial, BackSide } from 'three';
import { useSpring, animated } from '@react-spring/three';
import type { Mesh, Group } from 'three';
import { useGlobeControls } from '@/hooks/useGlobeControls';

export default function GlobeModel() {
  const earthRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const { rotation, scale, zoom } = useGlobeControls();

  // Load Earth texture from public assets
  const [
    albedoMap,
    bumpMap,
    cloudsMap,
    oceanMap,
    lightsMap
  ] = useLoader(
    TextureLoader,
    [
      '/Albedo.jpg',
      '/Bump.jpg',
      '/Clouds.png',
      '/Ocean.png',
      '/night_lights_modified.png'
    ]
  );

  // Smooth spring animation for globe state changes
  const { animScale } = useSpring({
    animScale: scale,
    config: { tension: 120, friction: 20 },
  });

  useFrame((_, delta) => {
    if (!earthRef.current || !groupRef.current) return;
    
    // Apply rotation directly for responsive gesture feel
    const currentRotX = groupRef.current.rotation.x;
    const currentRotY = groupRef.current.rotation.y;
    
    groupRef.current.rotation.y += rotation.y * delta * 2;
    groupRef.current.rotation.x = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, currentRotX + rotation.x * delta * 2)
    );

    // Slowly rotate clouds
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <animated.group ref={groupRef} scale={animScale}>
      {/* Base Earth Mesh */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[zoom, 64, 64]} />
        <meshStandardMaterial
          map={albedoMap}
          bumpMap={bumpMap}
          bumpScale={0.015}
          roughnessMap={oceanMap}
          roughness={0.8}
          metalness={0.1}
          emissiveMap={lightsMap}
          emissive={new Color(0xffffff)}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[zoom * 1.01, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.6}
          alphaMap={cloudsMap}
          alphaTest={0.05}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[zoom * 1.03, 64, 64]} />
        <meshBasicMaterial
          color={new Color(0x3366ff)}
          transparent={true}
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
          side={BackSide}
        />
      </mesh>
    </animated.group>
  );
}
