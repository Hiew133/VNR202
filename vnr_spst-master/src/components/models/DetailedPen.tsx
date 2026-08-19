import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function DetailedPen() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Xoay nhẹ nhàng để lột tả vẻ đẹp của bút
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      {/* Group xoay nghiêng bút */}
      <group ref={groupRef} scale={[1.5, 1.5, 1.5]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        
        {/* Thân bút (Barrel) - Màu đen bóng */}
        <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Nắp bút (Cap top) */}
        <mesh castShadow position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.06, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Vòng kim loại giữa thân (Ring) */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.062, 0.062, 0.1, 32]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
        </mesh>

        {/* Phần tay cầm (Grip) */}
        <mesh castShadow receiveShadow position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.06, 0.04, 0.5, 32]} />
          <meshStandardMaterial color="#2c2c2c" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Ngòi bút (Nib base) */}
        <mesh castShadow position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.04, 0.015, 0.2, 32]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
        </mesh>

        {/* Đầu ngòi bút nhọn (Nib tip) */}
        <mesh castShadow position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.015, 0.1, 16]} />
          <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.1} />
        </mesh>

        {/* Kẹp bút (Clip) vàng */}
        <mesh castShadow position={[0.065, 0.9, 0]}>
          <boxGeometry args={[0.02, 0.6, 0.04]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
        </mesh>

      </group>
    </group>
  );
}
