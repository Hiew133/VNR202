"use client";

import { EffectComposer, Bloom, Vignette, DepthOfField, ChromaticAberration, SMAA } from "@react-three/postprocessing";
import { Vector2 } from "three";
import { useStore } from "@/store/useStore";
import { RadialFocusMask } from "@/components/shaders/RadialFocusMaskEffect";
import { useThree } from "@react-three/fiber";

export default function PostProcessingPipeline() {
  const activeArtifactId = useStore((state) => state.activeArtifactId);
  const activeArtifact = useStore((state) => state.getActiveArtifact());
  const size = useThree((state) => state.size);
  const isMobile = size.width <= 768;

  const isMonument = activeArtifact?.type === 'monument';
  // Dynamic focal plane: 4.6m for monuments, 2.9m for standard artifacts, 3.5m for ambient hall view
  const focusDistance = activeArtifact ? (isMonument ? 0.046 : 0.029) : 0.035;

  // On mobile devices, disable all post-processing to guarantee stability and prevent GPU flickering
  if (isMobile) return null;

  return (
    <EffectComposer multisampling={0}>
      {/* High-Resolution Soft Depth of Field */}
      <DepthOfField
        focusDistance={focusDistance}
        focalLength={0.015}
        bokehScale={activeArtifactId ? 1.5 : 0.5}
        height={720}
      />

      {/* Feathered Radial Focus Mask Effect on Active Artifact */}
      <RadialFocusMask
        center={[0.38, 0.5]}
        innerRadius={0.28}
        outerRadius={0.68}
        blurIntensity={activeArtifactId ? 1.0 : 0}
        darkness={activeArtifactId ? 0.25 : 0}
      />

      {/* Warm Golden Bloom Glow */}
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.75}
        luminanceSmoothing={0.85}
        mipmapBlur
      />

      {/* Cinematic Scene-Wide Vignette Frame */}
      <Vignette
        eskil={false}
        offset={0.18}
        darkness={0.62}
      />

      {/* Subtle Camera Lens Edge Chromatic Aberration */}
      <ChromaticAberration
        offset={new Vector2(0.0008, 0.0008)}
        radialModulation={true}
        modulationOffset={0.4}
      />

      {/* Anti-aliasing pass for crisp edges (Desktop only to prevent Android flickering) */}
      {isMobile ? (null as any) : <SMAA />}
    </EffectComposer>
  );
}
