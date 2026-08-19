import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Dựng một hiện vật từ file .glb bất kỳ, tự chuẩn hoá kích thước cho vừa bệ.
 *
 * Model tải từ Sketchfab có tỉ lệ hoàn toàn tuỳ tác giả: chiếc C-47 dài 26.000
 * đơn vị trong khi khẩu Mosin chỉ 1,7. Component này đo hộp bao rồi co giãn về
 * `targetSize`, nên thêm model mới chỉ cần khai báo đường dẫn, không phải dò
 * scale bằng tay cho từng cái.
 *
 * Hai điểm phải cẩn thận:
 *
 * 1. KHÔNG sửa trực tiếp `scene` của useGLTF - nó được cache và dùng chung theo
 *    URL, sửa vào đó thì lần mount sau sẽ cộng dồn phép biến đổi. Ở đây luôn
 *    làm việc trên bản clone.
 *
 * 2. Đo bằng Box3.setFromObject (toán số thực trên ma trận) chứ không nướng ma
 *    trận vào geometry: file đã nén meshopt lưu toạ độ đỉnh dạng int16 chuẩn
 *    hoá, ghi ngược vào đó sẽ tràn số.
 *
 * Đáy hiện vật được canh về y = -0.5 để nằm đúng mặt bệ, khớp với hình khối mặc
 * định (hộp 1x1x1 đặt tại tâm) mà ArtifactShape dùng khi không có model.
 */
export default function ArtifactModel({
  url,
  targetSize = 1.1,
  rotation = [0, 0, 0],
}: {
  url: string;
  /** Cạnh dài nhất của hiện vật sau khi chuẩn hoá, tính bằng đơn vị cảnh. */
  targetSize?: number;
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url);

  const object = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    clone.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = targetSize / maxDim;

    // Dời tâm hộp bao về gốc, rồi bọc trong group để áp scale và độ cao.
    clone.position.sub(center);

    const group = new THREE.Group();
    group.add(clone);
    group.scale.setScalar(scale);
    group.position.y = -0.5 + (size.y * scale) / 2;

    return group;
  }, [scene, targetSize]);

  return (
    <group rotation={rotation}>
      <primitive object={object} />
    </group>
  );
}
