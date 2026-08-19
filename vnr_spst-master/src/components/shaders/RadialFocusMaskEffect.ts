import { Effect } from "postprocessing";
import { wrapEffect } from "@react-three/postprocessing";
import { Uniform } from "three";
import * as THREE from "three";

const fragmentShader = /* glsl */ `
  uniform vec2 uCenter;
  uniform float uInnerRadius;
  uniform float uOuterRadius;
  uniform float uAspect;
  uniform float uBlurIntensity;
  uniform float uDarkness;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 st = uv - uCenter;
    st.x *= uAspect;
    float dist = length(st);

    // Smooth feathered transition mask (0.0 inside innerRadius, 1.0 outside outerRadius)
    float feather = smoothstep(uInnerRadius, uOuterRadius, dist);

    vec4 color = inputColor;
    if (feather > 0.001) {
      // Isotropic 9-tap Gaussian blur sampling (no directional ghosting / text duplication)
      vec2 texel = vec2(0.0015) * feather * uBlurIntensity;
      vec4 blurColor = texture2D(inputBuffer, uv) * 0.28;
      blurColor += texture2D(inputBuffer, uv + vec2(texel.x, 0.0)) * 0.14;
      blurColor += texture2D(inputBuffer, uv - vec2(texel.x, 0.0)) * 0.14;
      blurColor += texture2D(inputBuffer, uv + vec2(0.0, texel.y)) * 0.14;
      blurColor += texture2D(inputBuffer, uv - vec2(0.0, texel.y)) * 0.14;
      blurColor += texture2D(inputBuffer, uv + texel) * 0.04;
      blurColor += texture2D(inputBuffer, uv - texel) * 0.04;
      blurColor += texture2D(inputBuffer, uv + vec2(texel.x, -texel.y)) * 0.04;
      blurColor += texture2D(inputBuffer, uv + vec2(-texel.x, texel.y)) * 0.04;

      color = mix(inputColor, blurColor, feather);

      // Feathered darkening vignette around the focus area
      color.rgb = mix(color.rgb, color.rgb * (1.0 - uDarkness), feather);
    }

    outputColor = color;
  }
`;

export class RadialFocusMaskEffectImpl extends Effect {
  constructor({
    center = [0.38, 0.5],
    innerRadius = 0.28,
    outerRadius = 0.65,
    aspect = 1.77,
    blurIntensity = 1.5,
    darkness = 0.35,
  }: {
    center?: [number, number];
    innerRadius?: number;
    outerRadius?: number;
    aspect?: number;
    blurIntensity?: number;
    darkness?: number;
  } = {}) {
    super("RadialFocusMaskEffect", fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ["uCenter", new Uniform(new THREE.Vector2(center[0], center[1]))],
        ["uInnerRadius", new Uniform(innerRadius)],
        ["uOuterRadius", new Uniform(outerRadius)],
        ["uAspect", new Uniform(aspect)],
        ["uBlurIntensity", new Uniform(blurIntensity)],
        ["uDarkness", new Uniform(darkness)],
      ]),
    });
  }
}

export const RadialFocusMask = wrapEffect(RadialFocusMaskEffectImpl);
