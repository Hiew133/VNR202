import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function DetailedMonument() {
  const { nodes } = useGLTF('/assets/models/tuong_bac.glb') as any;

  return (
    <group position={[0, -0.6, 0]}>
      {/* Bệ đỡ vuông vức bên dưới tượng */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
         <boxGeometry args={[1.5, 0.4, 1.5]} />
         <meshStandardMaterial color="#4a3222" roughness={0.7} metalness={0.2} />
      </mesh>
      
      {/* Tượng Chủ tịch Hồ Chí Minh - Đá Cẩm Thạch Trắng (White Marble PBR) */}
      <group position={[-0.78, 0.4, 0.64]} scale={0.045} rotation={[-Math.PI / 2, 0, 0]}>
         {nodes.Material2 && (
           <mesh geometry={nodes.Material2.geometry} castShadow receiveShadow>
             <meshStandardMaterial color="#e8e4d8" roughness={0.4} metalness={0.05} />
           </mesh>
         )}
         {nodes.Material3 && (
           <mesh geometry={nodes.Material3.geometry} castShadow receiveShadow>
             <meshStandardMaterial color="#dedac8" roughness={0.4} metalness={0.05} />
           </mesh>
         )}
      </group>
    </group>
  );
}

useGLTF.preload('/assets/models/tuong_bac.glb');
