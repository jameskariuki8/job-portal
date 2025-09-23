import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AdditiveBlending } from 'three';

function Globe() {
  const groupRef = useRef(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshStandardMaterial color="#22d3ee" roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.905, 32, 32]} />
        <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[1.9, 64, 64]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.12} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="heroCanvas" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <color attach="background" args={[0, 0, 0, 0]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 6, 6]} intensity={0.9} />
        <directionalLight position={[-6, -6, -6]} intensity={0.4} />
        <Suspense fallback={null}>
          <Globe />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}


