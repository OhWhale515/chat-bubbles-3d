import type { ReactNode, Ref } from "react";

type GroupHandle = {
  position: { x: number; y: number; z: number };
  rotation: { y: number };
  scale: { setScalar: (value: number) => void };
  traverse: (visitor: (child: unknown) => void) => void;
};

type R3FIntrinsicElements = {
  group: {
    children?: ReactNode;
    onClick?: () => void;
    position?: [number, number, number];
    ref?: Ref<GroupHandle>;
  };
  mesh: {
    castShadow?: boolean;
    children?: ReactNode;
  };
  sphereGeometry: {
    args?: [number, number, number];
  };
  meshStandardMaterial: {
    color?: string;
    emissive?: string;
    emissiveIntensity?: number;
    envMapIntensity?: number;
    metalness?: number;
    opacity?: number;
    roughness?: number;
    transparent?: boolean;
  };
  ambientLight: {
    intensity?: number;
  };
  directionalLight: {
    castShadow?: boolean;
    intensity?: number;
    position?: [number, number, number];
    "shadow-mapSize-height"?: number;
    "shadow-mapSize-width"?: number;
  };
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends R3FIntrinsicElements {}
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends R3FIntrinsicElements {}
  }
}

export {};
