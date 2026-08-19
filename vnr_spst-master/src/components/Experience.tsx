"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Text, Float, Sparkles, MeshReflectorMaterial, Environment, CubicBezierLine, Image, ContactShadows, useTexture, PerformanceMonitor, BakeShadows } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { ARTIFACTS, ROOMS } from "@/data/museumData";
import type { ArtifactData } from "@/data/museumData";

import DetailedTypewriter from "./models/DetailedTypewriter";
import DetailedPen from "./models/DetailedPen";
import DetailedHammerSickle from "./models/DetailedHammerSickle";
import DetailedMonument from "./models/DetailedMonument";
import ArtifactModel from "./models/ArtifactModel";

/**
 * Hiện vật nào dùng model tải về, và hiển thị ở cỡ nào.
 * targetSize là cạnh dài nhất sau khi chuẩn hoá - bệ rộng 1.5 nên khoảng 1.0-1.3
 * là vừa; xe tăng để lớn hơn cho ra dáng hiện vật cỡ lớn.
 */
const ARTIFACT_MODELS: Record<string, { url: string; targetSize?: number; rotation?: [number, number, number] }> = {
  "tong-tuyen-cu-1946": { url: "/assets/models/ballot_box.glb", targetSize: 1.0 },
  "den-dau-chien-khu": { url: "/assets/models/oil_lamp.glb", targetSize: 1.1 },
  "sung-ppsh": { url: "/assets/models/ppsh41.glb", targetSize: 1.3, rotation: [0, Math.PI / 5, 0] },
  "xe-tang-m24": { url: "/assets/models/m24_chaffee.glb", targetSize: 1.8, rotation: [0, Math.PI / 5, 0] },
  "may-bay-c47": { url: "/assets/models/c47.glb", targetSize: 1.9, rotation: [0, -Math.PI / 6, 0] },
  "dien-thoai-da-chien": { url: "/assets/models/field_telephone.glb", targetSize: 1.1 },
  "bi-dong-bo-doi": { url: "/assets/models/military_canteen.glb", targetSize: 0.9 },
  "xeng-dao-hao": { url: "/assets/models/shovel.glb", targetSize: 1.3, rotation: [0, Math.PI / 4, 0] },
};

import PostProcessingPipeline from "./PostProcessingPipeline";
import "@/components/shaders/MarbleFloorShader";
import "@/components/shaders/VolumetricLightShader";
import "@/components/shaders/GoldenAuraMaterial";
import { FireworksSystem } from "./effects/FireworksSystem";

// ==========================================
// CAMERA CONTROLLER
// ==========================================
function CameraController() {
  const activeRoomId = useStore((state) => state.activeRoomId);
  const activeArtifactId = useStore((state) => state.activeArtifactId);
  const zoomPercentage = useStore((state) => state.zoomPercentage);
  const isTourMode = useStore((state) => state.isTourMode);
  const setActiveArtifact = useStore((state) => state.setActiveArtifact);
  const setActiveRoom = useStore((state) => state.setActiveRoom);
  const setTourMode = useStore((state) => state.setTourMode);
  const controlsRef = useRef<any>(null);

  // Tour logic
  useEffect(() => {
    if (!isTourMode) return;

    let currentIdx = 0;

    // Bắt đầu tour ngay lập tức với artifact đầu tiên
    setActiveRoom(ARTIFACTS[0].roomId);
    setActiveArtifact(ARTIFACTS[0].id);

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx >= ARTIFACTS.length) {
        setTourMode(false);
        clearInterval(interval);
        return;
      }
      const nextArtifact = ARTIFACTS[currentIdx];
      setActiveRoom(nextArtifact.roomId);
      setActiveArtifact(nextArtifact.id);
    }, 7000); // 7 seconds per artifact

    return () => clearInterval(interval);
  }, [isTourMode, setActiveArtifact, setActiveRoom, setTourMode]);

  useEffect(() => {
    if (!controlsRef.current) return;

    const activeArtifact = activeArtifactId ? ARTIFACTS.find(a => a.id === activeArtifactId) : null;
    const currentRoom = ROOMS.find((r) => r.id === activeRoomId) || ROOMS[0];

    if (activeArtifact) {
      const [x, y, z] = activeArtifact.position;
      const isMonument = activeArtifact.type === 'monument';

      // Position camera closer to object (camZ closer, camX offset for right modal)
      const camX = isMonument ? x + 1.3 : x + 1.1;
      const camY = isMonument ? y + 1.6 : y + 0.95;
      const camZ = isMonument ? z + 4.6 : z + 2.9;

      const targetX = x - 0.25;
      const targetY = isMonument ? y + 1.1 : y + 0.55;

      controlsRef.current.setLookAt(
        camX, camY, camZ,
        targetX, targetY, z,
        true
      );
    } else {
      const [cx, cy, cz] = currentRoom.cameraPosition;
      const [tx, ty, tz] = currentRoom.targetPosition;
      controlsRef.current.setLookAt(
        cx, cy, cz,
        tx, ty, tz,
        true
      );
    }
  }, [activeRoomId, activeArtifactId]);

  useEffect(() => {
    if (!controlsRef.current) return;
    const zoomFactor = zoomPercentage / 100;
    controlsRef.current.zoomTo(zoomFactor, true);
  }, [zoomPercentage]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      maxPolarAngle={Math.PI / 2 - 0.1}
      minPolarAngle={Math.PI / 3.6}
      minDistance={1.8}
      maxDistance={16}
    />
  );
}

// ==========================================
// ARCHITECTURAL ELEMENTS
// ==========================================

// 1. Cột bảo tàng cổ điển (Grand Pillars)
function ArchitecturalPillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Bệ cột (Base) */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Thân cột (Shaft) */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.45, 8, 32]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Đầu cột (Capital) */}
      <mesh position={[0, 8.2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 8.5, 0]} castShadow>
        <boxGeometry args={[1.4, 0.4, 1.4]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}

// 1b. Ngôi Sao Vàng 5 Cánh 3D Thật (Golden 5-Pointed Star)
function Golden5PointStar({ position = [0, 5.8, 0.05] }: { position?: [number, number, number] }) {
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 0.85;
    const innerRadius = 0.34;
    const points = 5;
    const step = Math.PI / points;
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const a = i * step + Math.PI / 2; // Straight up
      const x = r * Math.cos(a);
      const y = r * Math.sin(a);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  }), []);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.9}
          roughness={0.15}
          emissive="#ffaa00"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

// 2. Bức Tường Khánh Tiết (Grand Wall Panels)
function GrandWall({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base Wall Backdrop */}
      <mesh position={[0, 3.5, -0.3]} receiveShadow>
        <boxGeometry args={[18, 9, 0.4]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.8} />
      </mesh>
      
      {/* Gold Frame (Viền vàng phía sau lót) */}
      <mesh position={[0, 4, 0.01]}>
        <boxGeometry args={[6.4, 7.4, 0.04]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Red Velvet Center Panel (Nền cờ đỏ) */}
      <mesh position={[0, 4, 0.03]} receiveShadow>
        <boxGeometry args={[6, 7, 0.02]} />
        <meshStandardMaterial color="#d00000" roughness={0.9} />
      </mesh>

      {/* Side Marble Panels */}
      <mesh position={[-5, 3.5, 0.01]} receiveShadow>
        <boxGeometry args={[3, 5, 0.05]} />
        <meshStandardMaterial color="#f4e5c8" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[5, 3.5, 0.01]} receiveShadow>
        <boxGeometry args={[3, 5, 0.05]} />
        <meshStandardMaterial color="#f4e5c8" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Top Cornice (Phào đỉnh) */}
      <mesh position={[0, 7.8, 0.1]} castShadow>
        <boxGeometry args={[18.4, 0.6, 0.8]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 7.4, 0.12]}>
        <boxGeometry args={[18.2, 0.1, 0.85]} />
        <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
      </mesh>

      {/* Ngôi Sao Vàng 5 Cánh Kim Loại Rực Rỡ */}
      <Golden5PointStar position={[0, 5.8, 0.05]} />
    </group>
  );
}

// 3. Cột chắn nhung đỏ (Velvet Rope Stanchions)
function Stanchions({ position, size = 1.6 }: { position: [number, number, number], size?: number }) {
  const [x, y, z] = position;
  const p = [
    [x - size, y, z - size],
    [x + size, y, z - size],
    [x + size, y, z + size],
    [x - size, y, z + size],
  ];

  return (
    <group>
      {/* 4 Brass Posts */}
      {p.map((pos, i) => (
        <group key={i} position={[pos[0], pos[1], pos[2]]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.04, 1.2, 16]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.98, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 0.05, 16]} />
            <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* Velvet Ropes (CubicBezierLine) */}
      <CubicBezierLine start={[p[0][0], 0.1, p[0][2]]} end={[p[1][0], 0.1, p[1][2]]} midA={[p[0][0], -0.2, p[0][2]]} midB={[p[1][0], -0.2, p[1][2]]} color="#aa0000" lineWidth={4} />
      <CubicBezierLine start={[p[1][0], 0.1, p[1][2]]} end={[p[2][0], 0.1, p[2][2]]} midA={[p[1][0], -0.2, p[1][2]]} midB={[p[2][0], -0.2, p[2][2]]} color="#aa0000" lineWidth={4} />
      <CubicBezierLine start={[p[2][0], 0.1, p[2][2]]} end={[p[3][0], 0.1, p[3][2]]} midA={[p[2][0], -0.2, p[2][2]]} midB={[p[3][0], -0.2, p[3][2]]} color="#aa0000" lineWidth={4} />
      <CubicBezierLine start={[p[3][0], 0.1, p[3][2]]} end={[p[0][0], 0.1, p[0][2]]} midA={[p[3][0], -0.2, p[3][2]]} midB={[p[0][0], -0.2, p[0][2]]} color="#aa0000" lineWidth={4} />
    </group>
  );
}

// 4. Bậc Tam Cấp (Stepped Podium) cho Sảnh Chính
function SteppedPodium({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.85, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6.2, 0.3, 64]} />
        <meshStandardMaterial color="#3a281d" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5.2, 0.3, 64]} />
        <meshStandardMaterial color="#5c4230" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4.2, 0.3, 64]} />
        <meshStandardMaterial color="#7a5a44" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 4, 64]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// 4b. Bức tường ngăn phòng (Partition Wall with Door)
function WallWithDoor({ position, rotation, width, height = 12, doorWidth = 6, doorHeight = 8 }: { position: [number, number, number], rotation: [number, number, number], width: number, height?: number, doorWidth?: number, doorHeight?: number }) {
  const wallWidth = (width - doorWidth) / 2;
  return (
    <group position={position} rotation={rotation}>
      {/* Left Wall */}
      <mesh position={[-width/2 + wallWidth/2, height/2 - 1, 0]} receiveShadow>
        <boxGeometry args={[wallWidth, height, 0.5]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[width/2 - wallWidth/2, height/2 - 1, 0]} receiveShadow>
        <boxGeometry args={[wallWidth, height, 0.5]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.9} />
      </mesh>
      {/* Top Lintel */}
      <mesh position={[0, height - (height - doorHeight)/2 - 1, 0]} receiveShadow>
        <boxGeometry args={[doorWidth, height - doorHeight, 0.5]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.9} />
      </mesh>
      {/* Gold Arch Trim */}
      <mesh position={[0, doorHeight - 1, 0.26]}>
        <boxGeometry args={[doorWidth + 0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-doorWidth/2 - 0.1, doorHeight/2 - 1, 0.26]}>
        <boxGeometry args={[0.2, doorHeight, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[doorWidth/2 + 0.1, doorHeight/2 - 1, 0.26]}>
        <boxGeometry args={[0.2, doorHeight, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Gold Arch Trim (Back) */}
      <mesh position={[0, doorHeight - 1, -0.26]}>
        <boxGeometry args={[doorWidth + 0.4, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-doorWidth/2 - 0.1, doorHeight/2 - 1, -0.26]}>
        <boxGeometry args={[0.2, doorHeight, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[doorWidth/2 + 0.1, doorHeight/2 - 1, -0.26]}>
        <boxGeometry args={[0.2, doorHeight, 0.1]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ==========================================
// ARTIFACT COMPONENTS & MODELS
// ==========================================

function FlagImage({ url }: { url: string }) {
  const texture = useTexture(url);
  const img = texture.image as any;
  const aspect = img ? img.width / img.height : 1.5;
  return (
    <mesh>
      <planeGeometry args={[1.5, 1.5 / aspect]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} transparent={false} />
    </mesh>
  );
}

function DocumentFrameWithImage({ url }: { url: string }) {
  const texture = useTexture(url);
  const img = texture.image as any;
  const aspect = img ? img.width / img.height : 1.2 / 1.6;
  const innerWidth = 1.5; // Tăng gấp 1.5 lần
  const innerHeight = innerWidth / aspect;
  const frameWidth = innerWidth + 0.3; // Tăng viền lên tương ứng
  const frameHeight = innerHeight + 0.3;
  
  return (
    <group rotation={[-Math.PI / 6, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.1]} />
        <meshStandardMaterial color="#3a1f0b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
         <planeGeometry args={[innerWidth, innerHeight]} />
         <meshStandardMaterial color="#f0e6d2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[innerWidth * 0.9, innerHeight * 0.9]} />
        {/* Sử dụng meshBasicMaterial để ảnh không bị tối đi do ánh sáng/đổ bóng, giúp ảnh rõ nét nhất */}
        <meshBasicMaterial map={texture} transparent={false} />
      </mesh>
    </group>
  );
}

/**
 * Bìa văn kiện dựng bằng code cho những hiện vật chưa có ảnh tư liệu.
 *
 * Mục đích là để 8 văn kiện không còn là 8 khung nâu giống hệt nhau khi đứng
 * cạnh nhau trong phòng. Mọi chi tiết đều suy ra từ dữ liệu hiện vật (màu, năm,
 * id) nên mỗi bìa một khác mà không cần thêm asset nào.
 */
function DocumentFrameGenerated({ artifact }: { artifact: ArtifactData }) {
  const { title, year, color, id } = artifact;
  const allPlaced = useStore((state) => state.isAllPlaced());

  const innerWidth = 1.5;
  const innerHeight = 2.1;
  const frameWidth = 1.8;
  const frameHeight = 2.4;

  // Băm id thành một số ổn định để chọn biến thể - cùng hiện vật luôn ra cùng bìa.
  const variant = useMemo(() => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return {
      seal: h % 3,          // kiểu con dấu
      rules: 5 + (h % 4),   // số dòng kẻ giả lập chữ
      tilt: ((h % 7) - 3) * 0.012, // nghiêng nhẹ cho đỡ đều tăm tắp
    };
  }, [id]);

  const paper = "#f2e8d5";

  return (
    <group rotation={[-Math.PI / 6, 0, variant.tilt]}>
      {/* Khung gỗ */}
      <mesh castShadow receiveShadow position={[0, 0, -0.05]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.1]} />
        <meshStandardMaterial color="#3a1f0b" roughness={0.8} />
      </mesh>

      {/* Nền giấy */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[innerWidth, innerHeight]} />
        <meshStandardMaterial color={paper} roughness={0.95} />
      </mesh>

      {/* Dải màu đầu trang - thứ tạo khác biệt rõ nhất giữa các văn kiện */}
      <mesh position={[0, innerHeight / 2 - 0.28, 0.02]}>
        <planeGeometry args={[innerWidth, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, innerHeight / 2 - 0.51, 0.02]}>
        <planeGeometry args={[innerWidth, 0.02]} />
        <meshStandardMaterial color="#8a6a2f" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Năm ban hành, in nổi trên dải màu. Bị che tới khi xếp xong toàn bộ bảo
          tàng: đọc được mốc thời gian ngay trong cảnh là suy ra luôn phòng đó
          thuộc giai đoạn nào, hỏng phần chơi. */}
      <Text
        position={[0, innerHeight / 2 - 0.28, 0.03]}
        fontSize={0.17}
        color="#fdf6e3"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {allPlaced ? year : "??"}
      </Text>

      {/* Các dòng kẻ giả lập khối chữ trên văn kiện */}
      {Array.from({ length: variant.rules }).map((_, i) => (
        <mesh key={i} position={[0, 0.35 - i * 0.15, 0.02]}>
          <planeGeometry args={[innerWidth * (i % 3 === 2 ? 0.5 : 0.78), 0.028]} />
          <meshStandardMaterial color="#9c8b70" roughness={1} />
        </mesh>
      ))}

      {/* Con dấu đỏ ở góc dưới */}
      <mesh position={[innerWidth / 2 - 0.3, -innerHeight / 2 + 0.3, 0.02]} rotation={[0, 0, 0.3]}>
        {variant.seal === 0 ? (
          <ringGeometry args={[0.13, 0.17, 32]} />
        ) : variant.seal === 1 ? (
          <circleGeometry args={[0.15, 5]} />
        ) : (
          <ringGeometry args={[0.1, 0.17, 5]} />
        )}
        <meshStandardMaterial color="#a51c1c" roughness={0.8} transparent opacity={0.85} />
      </mesh>

      {/* Tên hiện vật ở chân trang, chữ nhỏ như dòng chú thích lưu trữ */}
      <Text
        position={[0, -innerHeight / 2 + 0.12, 0.02]}
        fontSize={0.058}
        color="#4a3520"
        maxWidth={innerWidth * 0.85}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}

function ArtifactShape({ artifact }: { artifact: ArtifactData }) {
  const { type, color, id, imageUrl } = artifact;

  switch (type) {
    case 'monument':
      if (id === 'main-symbol') return <DetailedHammerSickle color={color} />;
      if (id === 'tuong-dai-bac') return <DetailedMonument />;
      return (
        <mesh castShadow>
          <octahedronGeometry args={[1.2]} />
          <meshStandardMaterial color={color} metalness={1} roughness={0.1} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      );
    case 'object': {
      if (id === 'may-chu-bac-ho') return <DetailedTypewriter />;
      if (id === 'but-ky-geneve') return <DetailedPen />;
      // Các hiện vật dùng model tải về đều đi qua ArtifactModel, nó tự chuẩn
      // hoá tỉ lệ nên chỉ cần khai báo đường dẫn và cỡ hiển thị mong muốn.
      const model = ARTIFACT_MODELS[id];
      if (model) {
        // Suspense riêng cho từng model. Cảnh chỉ có một Suspense bọc ngoài
        // cùng, nên nếu không chặn ở đây thì lúc người chơi xếp một hiện vật,
        // model tải về sẽ làm treo cả bảo tàng chứ không riêng bệ đó.
        return (
          <Suspense fallback={null}>
            <ArtifactModel {...model} />
          </Suspense>
        );
      }
      return (
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      );
    }
    case 'flag':
      return (
        <group>
          <mesh position={[-0.8, 0, 0]} castShadow>
             <cylinderGeometry args={[0.04, 0.04, 3.5]} />
             <meshStandardMaterial color="#aa5500" roughness={0.8} />
          </mesh>
          <group position={[-0.05, 0.75, 0]}>
            {imageUrl ? (
              <FlagImage url={imageUrl} />
            ) : (
              <mesh>
                 <planeGeometry args={[1.5, 1]} />
                 <meshStandardMaterial color={color} side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        </group>
      );
    case 'document':
      if (imageUrl) {
        return <DocumentFrameWithImage url={imageUrl} />;
      }
      return <DocumentFrameGenerated artifact={artifact} />;
    default:
      return (
        <mesh castShadow>
          <torusKnotGeometry args={[0.5, 0.15, 128, 32]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      );
  }
}

// 6. Đèn rọi vật lý (Spotlight Fixture)
function ArtifactSpotlight({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const isNightMode = useStore((state) => state.isNightMode);

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
      lightRef.current.target.updateMatrixWorld();
    }
  }, []);

  return (
    <group position={position}>
      {/* Dây treo đèn (Cable) */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Thân đèn (Housing) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      {/* Chao đèn (Cone) */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      {/* Bóng đèn phát sáng */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffcc88" />
      </mesh>



      {/* 3D Volumetric Sunlight Beam (Tia nắng vàng 3D) */}
      <mesh position={[0, -6, 0]}>
        <coneGeometry args={[1.6, 12, 32, 1, true]} />
        <volumetricLightMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uOpacity={isNightMode ? 0.18 : 0.09}
          uColor={new THREE.Color("#ffb855")}
        />
      </mesh>

      <spotLight
        ref={lightRef}
        position={[0, -0.4, 0]}
        angle={0.4}
        penumbra={0.6}
        intensity={isNightMode ? 750 : 400}
        decay={2}
        distance={25}
        color="#ffcc88"
      />
      <object3D ref={targetRef} position={[0, -20, 0]} />
    </group>
  );
}

function PedestalArtifact({ artifact }: { artifact: ArtifactData }) {
  const [hovered, setHovered] = useState(false);
  const activeArtifactId = useStore((state) => state.activeArtifactId);
  const setActiveArtifact = useStore((state) => state.setActiveArtifact);
  const placedIds = useStore((state) => state.placedIds);
  const openSlotId = useStore((state) => state.openSlotId);
  const openSlot = useStore((state) => state.openSlot);

  const isSelected = activeArtifactId === artifact.id;
  const isMonument = artifact.type === 'monument';

  // Bệ chỉ có hiện vật sau khi người chơi xếp đúng. Khi còn trống, biển đồng
  // hiện gợi ý và bấm vào bệ sẽ mở túi đồ thay vì mở bảng chi tiết.
  const isPlaced = placedIds.includes(artifact.id);
  const allPlaced = useStore((state) => state.isAllPlaced());
  const isOpen = openSlotId === artifact.id;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (isPlaced) {
      setActiveArtifact(artifact.id);
    } else {
      openSlot(isOpen ? null : artifact.id);
    }
  };

  return (
    <group position={artifact.position}>
      {/* Cozy Golden Aura Ring on Hover or Selection */}
      {(hovered || isSelected || isOpen) && (
        <mesh position={[0, isMonument ? 0.02 : -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[isMonument ? 4.2 : 1.25, isMonument ? 4.6 : 1.5, 64]} />
          <goldenAuraMaterial
            transparent
            uColor={new THREE.Color("#ffd700")}
            uGlowColor={new THREE.Color("#ff8800")}
            uPower={2.0}
            uIntensity={2.5}
          />
        </mesh>
      )}

      {!isMonument ? (
        <>
          {/* Grand Pedestal */}
          <mesh position={[0, -0.4, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.5, 1.2, 1.5]} />
            <meshStandardMaterial color="#cbbba8" roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.9, 0]} receiveShadow castShadow>
            <boxGeometry args={[1.8, 0.2, 1.8]} />
            <meshStandardMaterial color="#8c7865" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[1.6, 0.08, 1.6]} />
            <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.28, 0]} receiveShadow>
            <boxGeometry args={[1.4, 0.05, 1.4]} />
            <meshStandardMaterial color="#9a0000" roughness={0.9} />
          </mesh>
          
          {/* Cột chắn nhung xung quanh */}
          <Stanchions position={[0, 0, 0]} size={1.8} />
        </>
      ) : (
        <SteppedPodium position={[0, 0, 0]} />
      )}

      {/* Vùng bấm của bệ. Luôn tồn tại kể cả khi chưa có hiện vật, nếu không
          thì bệ trống sẽ không bấm vào đâu được để mở túi đồ. */}
      <group
        position={[0, isMonument ? 0.6 : 0.8, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {isPlaced ? (
          <group scale={hovered || isSelected ? 1.08 : 1}>
            <ArtifactShape artifact={artifact} />
          </group>
        ) : (
          <>
            {/* Khối trong suốt để raycast bắt được cú bấm vào bệ trống */}
            <mesh visible={false}>
              <boxGeometry args={isMonument ? [3, 3, 3] : [1.6, 1.8, 1.6]} />
            </mesh>
            {/* Dấu hỏi lơ lửng báo đây là chỗ còn thiếu hiện vật */}
            <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
              <Text
                position={[0, isMonument ? 0.6 : 0.25, 0]}
                fontSize={isMonument ? 0.9 : 0.5}
                color={isOpen || hovered ? "#ffd700" : "#8a7a5c"}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#2a1a08"
              >
                ?
              </Text>
            </Float>
          </>
        )}
      </group>

      {/* Bảng Tên Khắc Đồng Kim Loại Nẹp Gụ (Luxury Museum Brass Plaque) */}
      <group 
        position={isMonument ? [0, 0.45, 1.8] : [0, 0.32, 0.78]} 
        rotation={[-Math.PI / 7, 0, 0]}
      >
        {/* Khung đế gỗ mun sẫm màu bên dưới */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.3, 0.32, 0.03]} />
          <meshStandardMaterial color="#1f140e" roughness={0.7} metalness={0.1} />
        </mesh>
        
        {/* Mặt biển đồng mạ vàng bóng bẩy. Bệ trống thì để đồng xỉn màu, xếp
            đúng rồi mới sáng lên - một tín hiệu tiến độ đọc được ngay trong cảnh. */}
        <mesh position={[0, 0, 0.018]}>
          <boxGeometry args={[1.22, 0.26, 0.01]} />
          <meshStandardMaterial
            color={isPlaced ? "#c59b27" : "#6b5a35"}
            roughness={isPlaced ? 0.25 : 0.6}
            metalness={0.85}
          />
        </mesh>
        
        {/* Viền nổi mạ vàng sáng bóng xung quanh mặt biển */}
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[1.24, 0.28, 0.005]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.95} />
        </mesh>

        {/* 2 Đinh tán kim loại 2 bên góc */}
        <mesh position={[-0.56, 0, 0.025]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
          <meshStandardMaterial color="#4a3517" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0.56, 0, 0.025]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
          <meshStandardMaterial color="#4a3517" roughness={0.3} metalness={0.9} />
        </mesh>

        {/* Bệ trống khắc gợi ý, xếp đúng rồi mới khắc tên thật của hiện vật.
            Gợi ý dài hơn tên nên phải để cỡ chữ nhỏ hơn cho vừa mặt biển. */}
        <Text
          position={[0, allPlaced && isPlaced ? 0.035 : 0, 0.026]}
          fontSize={isPlaced ? 0.062 : 0.042}
          color={isPlaced ? "#1a0f05" : "#2a2011"}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.15}
          textAlign="center"
          letterSpacing={isPlaced ? 0.05 : 0}
        >
          {isPlaced ? artifact.title.toUpperCase() : artifact.hint}
        </Text>

        {/* Niên đại khắc thêm dưới tên, chỉ hiện khi đã xếp xong toàn bộ bảo
            tàng - nhìn quanh phòng là đọc ra khoảng thời gian của cả phòng. */}
        {allPlaced && isPlaced && (
          <Text
            position={[0, -0.072, 0.026]}
            fontSize={0.05}
            color="#5a3d12"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.15}
            textAlign="center"
            letterSpacing={0.04}
          >
            {artifact.year}
          </Text>
        )}
      </group>

      {/* Đèn chiếu rọi riêng cho từng hiện vật (treo từ trần nhà xuống) */}
      <ArtifactSpotlight position={[0, 12, 0]} />
    </group>
  );
}

// 5. Tường bao quanh bảo tàng (Perimeter Walls)
function PerimeterWalls() {
  return (
    <group>
      {/* Tường phía sau (Back Wall) */}
      <mesh position={[0, 5.5, -32]} receiveShadow>
        <boxGeometry args={[64, 13, 1]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.9} />
      </mesh>
      {/* Tường phía trước (Front Wall) */}
      <mesh position={[0, 5.5, 32]} receiveShadow>
        <boxGeometry args={[64, 13, 1]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.9} />
      </mesh>
      {/* Tường bên trái (Left Wall) */}
      <mesh position={[-32, 5.5, 0]} receiveShadow>
        <boxGeometry args={[1, 13, 64]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.9} />
      </mesh>
      {/* Tường bên phải (Right Wall) */}
      <mesh position={[32, 5.5, 0]} receiveShadow>
        <boxGeometry args={[1, 13, 64]} />
        <meshStandardMaterial color="#e8d5b5" roughness={0.9} />
      </mesh>

      {/* Phào chỉ chân tường (Baseboards) */}
      <mesh position={[0, -0.5, -31.4]}>
         <boxGeometry args={[64, 1, 0.2]} />
         <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.5, 31.4]}>
         <boxGeometry args={[64, 1, 0.2]} />
         <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
      <mesh position={[-31.4, -0.5, 0]}>
         <boxGeometry args={[0.2, 1, 64]} />
         <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
      <mesh position={[31.4, -0.5, 0]}>
         <boxGeometry args={[0.2, 1, 64]} />
         <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
      
      {/* Phào chỉ vàng chạy dọc chân tường */}
      <mesh position={[0, 0.1, -31.4]}>
         <boxGeometry args={[64, 0.1, 0.25]} />
         <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 31.4]}>
         <boxGeometry args={[64, 0.1, 0.25]} />
         <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-31.4, 0.1, 0]}>
         <boxGeometry args={[0.25, 0.1, 64]} />
         <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[31.4, 0.1, 0]}>
         <boxGeometry args={[0.25, 0.1, 64]} />
         <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Trần nhà chính (Architectural Museum Ceiling with Warm Glow) */}
      <mesh position={[0, 12.0, 0]} receiveShadow>
        <boxGeometry args={[64, 0.5, 64]} />
        <meshStandardMaterial color="#5a402d" roughness={0.7} emissive="#2b1a0d" emissiveIntensity={0.2} />
      </mesh>
      {/* Phào vòm trần (Ceiling Cornice) */}
      <mesh position={[0, 11.7, 0]}>
        <boxGeometry args={[62, 0.2, 62]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 11.5, 0]}>
        <boxGeometry args={[60, 0.2, 60]} />
        <meshStandardMaterial color="#3a2214" roughness={0.8} />
      </mesh>
      {/* Mạng lưới dầm gỗ trần cao cấp (Coffered Ceiling Beams) */}
      {[...Array(9)].map((_, i) => (
        <mesh key={`grid-x-${i}`} position={[-24 + i * 6, 11.75, 0]}>
          <boxGeometry args={[0.3, 0.2, 64]} />
          <meshStandardMaterial color="#4a2c17" roughness={0.8} />
        </mesh>
      ))}
      {[...Array(9)].map((_, i) => (
        <mesh key={`grid-z-${i}`} position={[0, 11.75, -24 + i * 6]}>
          <boxGeometry args={[64, 0.2, 0.3]} />
          <meshStandardMaterial color="#4a2c17" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// SCENE ASSEMBLY
// ==========================================
function MuseumArchitecture() {
  const setActiveRoom = useStore((state) => state.setActiveRoom);
  const activeRoomId = useStore((state) => state.activeRoomId);

  // Hệ thống cột đá (Được bố trí dọc theo các bức tường để không chắn tầm nhìn)
  const pillars: [number, number, number][] = [
    // Dọc tường trái của Sảnh Chính (x = -12)
    [-12, 0, -8], [-12, 0, 4], [-12, 0, 16], [-12, 0, 28],
    // Dọc tường phải của Sảnh Chính (x = 12)
    [12, 0, -8], [12, 0, 4], [12, 0, 16], [12, 0, 28],
    // Dọc tường ngăn phía sau (z = -8) - Tránh các cửa ra vào ở x=-22, x=0, x=22
    [-31, 0, -8], [-28, 0, -8], [-16, 0, -8],
    [-8, 0, -8], [8, 0, -8],
    [16, 0, -8], [28, 0, -8], [31, 0, -8],
    // Cột góc tường sau cùng
    [-31, 0, -31], [31, 0, -31]
  ];

  return (
    <group>
      {/* Tường bao quanh tòa nhà */}
      <PerimeterWalls />
      {/* Sàn đá cẩm thạch đen bóng cao cấp */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1c1410" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Hoa văn sàn trung tâm (Lotus Grid) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]}>
        <circleGeometry args={[7, 64]} />
        <meshBasicMaterial color="#7a0000" transparent opacity={0.3} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, i * Math.PI / 4]} position={[0, -0.98, 0]}>
          <ringGeometry args={[6.8, 7, 64]} />
          <meshBasicMaterial color="#ffd700" />
        </mesh>
      ))}

      {/* Thảm đỏ (Red Carpets) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, -0.98, 0]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#550000" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.98, 0]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#550000" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.98, -10]}>
        <planeGeometry args={[4, 14]} />
        <meshStandardMaterial color="#550000" roughness={0.9} />
      </mesh>

      {/* Tường Khánh Tiết */}
      <GrandWall position={[0, -1, -31.5]} rotation={[0, 0, 0]} />
      <GrandWall position={[-31.5, -1, 0]} rotation={[0, Math.PI / 2, 0]} />
      <GrandWall position={[31.5, -1, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Cột đá */}
      {pillars.map((pos, idx) => (
        <ArchitecturalPillar key={idx} position={pos} />
      ))}

      {/* Tường chia phòng (Partition Walls) */}
      {/* 1. Ngăn cách Sảnh Chính & Phòng 1 (Dọc bên trái) */}
      <WallWithDoor position={[-12, 0, 12]} rotation={[0, Math.PI / 2, 0]} width={40} />
      {/* 2. Ngăn cách Sảnh Chính & Phòng 3 (Dọc bên phải) */}
      <WallWithDoor position={[12, 0, 12]} rotation={[0, Math.PI / 2, 0]} width={40} />
      {/* 3. Ngăn cách dãy phòng trước và Phòng 2 (Ngang ở giữa) */}
      <WallWithDoor position={[-22, 0, -8]} rotation={[0, 0, 0]} width={20} /> {/* Phòng 1 ra Phòng 2 */}
      <WallWithDoor position={[0, 0, -8]} rotation={[0, 0, 0]} width={24} doorWidth={8} /> {/* Sảnh Chính ra Phòng 2 */}
      <WallWithDoor position={[22, 0, -8]} rotation={[0, 0, 0]} width={20} /> {/* Phòng 3 ra Phòng 2 */}


    </group>
  );
}

export default function Experience() {
  const setActiveArtifact = useStore((state) => state.setActiveArtifact);
  const isNightMode = useStore((state) => state.isNightMode);
  const visitedArtifactIds = useStore((state) => state.visitedArtifactIds);
  const [dpr, setDpr] = useState(1.5);

  const bg = isNightMode ? "#050302" : "#0c0806";

  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={dpr}
      camera={{ position: [0, 5.5, 28], fov: 55 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isNightMode ? 0.7 : 0.85,
      }}
      onPointerMissed={() => setActiveArtifact(null)}
    >
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, isNightMode ? 25 : 45, isNightMode ? 100 : 120]} />

      <Suspense fallback={null}>
        <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)} />
        <BakeShadows />
        {/* Environment Map */}
        <Environment preset={isNightMode ? "night" : "sunset"} />

        {/* Global Lights - Dynamic Day / Night Exhibition Mode */}
        <ambientLight intensity={isNightMode ? 0.08 : 0.25} color="#fff0db" />
        <hemisphereLight intensity={isNightMode ? 0.12 : 0.35} color="#ffcc88" groundColor="#150a04" />
        <directionalLight
          position={[0, 22, 18]}
          intensity={isNightMode ? 0.35 : 1.2}
          color="#fff2db"
          castShadow
          shadow-mapSize={typeof window !== 'undefined' && window.innerWidth > 768 ? [2048, 2048] : [1024, 1024]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-bias={-0.0001}
          shadow-normalBias={0.01}
        />
        <directionalLight position={[-15, 15, -15]} intensity={isNightMode ? 0.15 : 0.3} color="#ffe4cc" />

        {/* Layer 1: Hạt sương mạ vàng lơ lửng lung linh (Gold Dust Sparkles) */}
        <Sparkles count={isNightMode ? 800 : 600} scale={[65, 24, 65]} size={isNightMode ? 4.0 : 3.2} speed={0.25} color="#ffd700" opacity={isNightMode ? 0.85 : 0.7} />
        {/* Layer 2: Hạt đom đốm cam ấm lơ lửng tầng thấp (Warm Amber Embers) */}
        <Sparkles count={isNightMode ? 500 : 350} scale={[45, 14, 45]} size={isNightMode ? 5.5 : 4.5} speed={0.4} color="#ff9933" opacity={isNightMode ? 0.75 : 0.5} />
        {/* Layer 3: Hạt kim tuyến ánh bạc lấp lánh tầng cao (Silver Light Dust) */}
        <Sparkles count={250} scale={[55, 20, 55]} size={2.0} speed={0.15} color="#ffffff" opacity={0.4} />

        {/* Cấu trúc Bảo tàng & Hiện vật */}
        <MuseumArchitecture />
        {ARTIFACTS.map((artifact) => (
          <PedestalArtifact key={artifact.id} artifact={artifact} />
        ))}
        
        {/* Pháo hoa khi hoàn thành 15/15 */}
        <FireworksSystem isActive={visitedArtifactIds.length === 15} />

        {/* Camera */}
        <CameraController />

        {/* Post Processing Pipeline */}
        <PostProcessingPipeline />
      </Suspense>
    </Canvas>
  );
}
