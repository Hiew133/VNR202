import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const VolumetricLightMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("#ffcc88"),
    uAttenuation: 2.5,
    uAnglePower: 1.5,
    uOpacity: 0.06,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vNormalizedY;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      // Normalize Y position along cone height 10 (-5 to +5)
      vNormalizedY = (position.y + 5.0) / 10.0;

      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  /* glsl */ `
    uniform vec3 uColor;
    uniform float uAttenuation;
    uniform float uAnglePower;
    uniform float uOpacity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vNormalizedY;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uAnglePower);

      float heightFactor = smoothstep(0.0, 1.0, vNormalizedY);
      float alpha = fresnel * heightFactor * uOpacity;

      gl_FragColor = vec4(uColor, alpha);
    }
  `
);

extend({ VolumetricLightMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      volumetricLightMaterial: any;
    }
  }
}
