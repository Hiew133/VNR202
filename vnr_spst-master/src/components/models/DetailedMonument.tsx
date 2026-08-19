import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Tượng đài Chủ tịch Hồ Chí Minh.
 *
 * Model gồm hai lớp lưới riêng (Material2, Material3) cần vật liệu khác nhau,
 * nên phải lấy từng node ra thay vì dựng nguyên cây scene.
 *
 * QUAN TRỌNG - phải giữ transform của node, đừng chỉ lấy `geometry`:
 * file .glb được nén bằng EXT_meshopt_compression, mà bước nén lượng tử hoá toạ
 * độ đỉnh về int16 chuẩn hoá rồi đẩy hệ số khôi phục (scale ~22.6 kèm một offset)
 * lên ma trận cục bộ của chính node mesh. Gắn trần `nodes.X.geometry` vào một
 * mesh mới là vứt mất hệ số đó, tượng bị thu nhỏ ~22 lần và biến mất khỏi
 * tầm nhìn. Nướng ma trận vào geometry cũng không cứu được, vì applyMatrix4 sẽ
 * ghi đè ngược vào mảng int16 và tràn số.
 *
 * Cách đúng là chép nguyên position/quaternion/scale của node sang mesh mới.
 * Khi đó geometry nằm đúng hệ toạ độ như model gốc chưa nén, nên các giá trị
 * căn chỉnh bên dưới giữ nguyên và code chạy đúng với cả hai bản.
 */
const PARTS = [
  { name: 'Material2', color: '#e8e4d8' },
  { name: 'Material3', color: '#dedac8' },
] as const;

export default function DetailedMonument() {
  const { nodes } = useGLTF('/assets/models/tuong_bac.glb') as unknown as {
    nodes: Record<string, THREE.Mesh | undefined>;
  };

  return (
    <group position={[0, -0.6, 0]}>
      {/* Bệ đỡ vuông vức bên dưới tượng */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.4, 1.5]} />
        <meshStandardMaterial color="#4a3222" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Tượng Chủ tịch Hồ Chí Minh - Đá Cẩm Thạch Trắng (White Marble PBR).
          Phép xoay -90° bù cho gốc toạ độ Z-up của bản quét Collada. */}
      <group position={[-0.78, 0.4, 0.64]} scale={0.045} rotation={[-Math.PI / 2, 0, 0]}>
        {PARTS.map(({ name, color }) => {
          const node = nodes[name];
          if (!node?.geometry) return null;
          return (
            <mesh
              key={name}
              geometry={node.geometry}
              position={node.position}
              quaternion={node.quaternion}
              scale={node.scale}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

useGLTF.preload('/assets/models/tuong_bac.glb');
