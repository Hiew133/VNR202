import { ThreeElement } from "@react-three/fiber";
import { MarbleFloorMaterial } from "@/components/shaders/MarbleFloorShader";
import { VolumetricLightMaterial } from "@/components/shaders/VolumetricLightShader";
import { GoldenAuraMaterial } from "@/components/shaders/GoldenAuraMaterial";

declare module "@react-three/fiber" {
  interface ThreeElements {
    marbleFloorMaterial: ThreeElement<typeof MarbleFloorMaterial>;
    volumetricLightMaterial: ThreeElement<typeof VolumetricLightMaterial>;
    goldenAuraMaterial: ThreeElement<typeof GoldenAuraMaterial>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      marbleFloorMaterial: any;
      volumetricLightMaterial: any;
      goldenAuraMaterial: any;
    }
  }
}
