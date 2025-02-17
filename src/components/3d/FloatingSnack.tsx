import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function FloatingSnack() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={[0.5, 0.5, 0.5]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FFB6C1" />
    </mesh>
  );
}