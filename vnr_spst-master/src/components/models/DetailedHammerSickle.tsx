import React from 'react';
import { useGLTF, Center } from '@react-three/drei';

export default function DetailedHammerSickle({ color = "#ffd700" }: { color?: string }) {
  const { scene } = useGLTF('/assets/models/communist_badge.glb');

  return (
    <group scale={1} position={[0, 0.6, 0]}>
      <Center>
        <primitive object={scene} castShadow receiveShadow />
      </Center>
    </group>
  );
}

useGLTF.preload('/assets/models/communist_badge.glb');
