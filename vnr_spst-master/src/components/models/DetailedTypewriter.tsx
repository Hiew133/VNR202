import React, { useLayoutEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function DetailedTypewriter() {
  const { scene } = useGLTF('/assets/models/72d50626ee0843fbb774ba9585e0c793.glb');
  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    if (groupRef.current) {
      // Create a temporary clone to measure its pure local bounding box
      const measureScene = scene.clone();
      measureScene.position.set(0, 0, 0);
      measureScene.scale.set(1, 1, 1);
      measureScene.rotation.set(0, 0, 0);
      measureScene.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(measureScene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      if (maxDim > 0) {
        const scale = 1.0 / maxDim; // 1 unit width/depth/height
        groupRef.current.scale.set(scale, scale, scale);

        const center = box.getCenter(new THREE.Vector3());
        const bottom = box.min.y;
        
        // Shift actual scene so its bounding box bottom is at 0 and centered on X/Z
        scene.position.set(-center.x, -bottom, -center.z);
      }
    }
  }, [scene]);

  return (
    <group position={[0, -0.49, 0]}>
      <group ref={groupRef}>
        <primitive object={scene} castShadow receiveShadow />
      </group>
    </group>
  );
}

useGLTF.preload('/assets/models/72d50626ee0843fbb774ba9585e0c793.glb');
