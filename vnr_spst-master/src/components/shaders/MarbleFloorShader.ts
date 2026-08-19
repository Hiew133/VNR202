import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

export const MarbleFloorMaterial = shaderMaterial(
  {
    uColorBase: new THREE.Color("#16100c"),
    uColorVein: new THREE.Color("#4a3b2c"),
    uColorHighlight: new THREE.Color("#281c14"),
    uTime: 0,
    uScale: 2.0,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  /* glsl */ `
    uniform vec3 uColorBase;
    uniform vec3 uColorVein;
    uniform vec3 uColorHighlight;
    uniform float uTime;
    uniform float uScale;

    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(
        mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 st = vWorldPosition.xz * uScale * 0.03;
      
      float q = fbm(st);
      float r = fbm(st + q * 1.5);
      
      float marblePattern = sin((st.x + st.y + r * 2.5) * 3.0);
      float veinIntensity = smoothstep(0.1, 0.9, abs(marblePattern));

      vec3 color = mix(uColorBase, uColorHighlight, q * 0.5 + 0.5);
      color = mix(color, uColorVein, (1.0 - veinIntensity) * 0.12);

      // Subtle edge vignette
      float dist = length(vWorldPosition.xz) * 0.015;
      color = mix(color, color * 0.6, smoothstep(0.3, 1.0, dist));

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ MarbleFloorMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      marbleFloorMaterial: any;
    }
  }
}
