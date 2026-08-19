import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const GoldenAuraMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("#ffd700"),
    uGlowColor: new THREE.Color("#ff8800"),
    uPower: 2.5,
    uIntensity: 1.5,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  /* glsl */ `
    uniform vec3 uColor;
    uniform vec3 uGlowColor;
    uniform float uPower;
    uniform float uIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), uPower);

      vec3 finalColor = mix(uColor, uGlowColor, fresnel);
      finalColor *= (1.0 + fresnel * uIntensity);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ GoldenAuraMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      goldenAuraMaterial: any;
    }
  }
}
