"use client";

import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";

import type { ChatMessage } from "@/lib/types";
import { DEFAULT_COLORS } from "@/lib/types";

type Props = {
  message: ChatMessage;
  spawnHeight: number;
  scale: number;
  lifetimeMs: number;
  showText: boolean;
  showUsername: boolean;
  onExpire: (id: string) => void;
};

const FLOOR_Y = -3;
const GRAVITY = -9.8;
const DAMPING = 0.78;
const HORIZONTAL_BOUND = 6;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function pickColor(message: ChatMessage): string {
  if (message.color && /^#[0-9a-fA-F]{6}$/.test(message.color)) {
    return message.color;
  }
  // Stable pick from username hash so the same user gets a consistent color.
  let hash = 0;
  for (let i = 0; i < message.username.length; i++) {
    hash = (hash * 31 + message.username.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % DEFAULT_COLORS.length;
  return DEFAULT_COLORS[idx];
}

export function Bubble({
  message,
  spawnHeight,
  scale,
  lifetimeMs,
  showText,
  showUsername,
  onExpire,
}: Props) {
  const groupRef = useRef<{
    position: { x: number; y: number; z: number };
    rotation: { y: number };
    scale: { setScalar: (value: number) => void };
    traverse: (visitor: (child: unknown) => void) => void;
  } | null>(null);
  const velocity = useRef({
    x: (Math.random() - 0.5) * 4,
    y: (Math.random() - 0.5) * 1,
    z: (Math.random() - 0.5) * 1,
  });
  const spawnTime = useRef<number>(Date.now());
  const initialX = useMemo(() => (Math.random() - 0.5) * 8, []);
  const color = useMemo(() => pickColor(message), [message]);
  const radius = useMemo(() => 0.55 * scale + Math.min(message.text.length, 60) * 0.005, [
    message.text.length,
    scale,
  ]);

  const [popping, setPopping] = useState(false);
  const popStart = useRef<number>(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (popping) {
      const elapsed = (Date.now() - popStart.current) / 250;
      group.scale.setScalar(lerp(1, 1.6, elapsed));
      const opacity = clamp(1 - elapsed, 0, 1);
      group.traverse((child) => {
        const mesh = child as { material?: unknown };
        if (mesh.material) {
          const mat = mesh.material as { transparent: boolean; opacity: number };
          mat.transparent = true;
          mat.opacity = opacity;
        }
      });
      if (elapsed >= 1) {
        onExpire(message.id);
      }
      return;
    }

    const age = Date.now() - spawnTime.current;
    if (age >= lifetimeMs) {
      setPopping(true);
      popStart.current = Date.now();
      return;
    }

    // Apply gravity and integrate.
    velocity.current.y += GRAVITY * delta * 0.35;
    group.position.x += velocity.current.x * delta;
    group.position.y += velocity.current.y * delta;
    group.position.z += velocity.current.z * delta;

    // Floor bounce.
    if (group.position.y - radius <= FLOOR_Y && velocity.current.y < 0) {
      group.position.y = FLOOR_Y + radius;
      velocity.current.y = -velocity.current.y * DAMPING;
      velocity.current.x *= 0.92;
      velocity.current.z *= 0.92;
    }

    // Side walls.
    if (Math.abs(group.position.x) > HORIZONTAL_BOUND) {
      group.position.x = Math.sign(group.position.x) * HORIZONTAL_BOUND;
      velocity.current.x = -velocity.current.x * DAMPING;
    }
    if (Math.abs(group.position.z) > 2.5) {
      group.position.z = Math.sign(group.position.z) * 2.5;
      velocity.current.z = -velocity.current.z * DAMPING;
    }

    // Slight rotation for life.
    group.rotation.y += delta * 0.4;
  });

  const handlePop = () => {
    if (popping) return;
    setPopping(true);
    popStart.current = Date.now();
  };

  return (
    <group ref={groupRef} position={[initialX, spawnHeight, 0]} onClick={handlePop}>
      <mesh castShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.15}
          envMapIntensity={1.3}
          transparent
          opacity={0.92}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>
      {(showUsername || showText) && (
        <Billboard position={[0, 0, radius + 0.02]}>
          {showUsername && (
            <Text
              fontSize={0.18 * scale}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              position={[0, 0.18 * scale, 0]}
              outlineWidth={0.012}
              outlineColor="#000000"
            >
              {message.username}
            </Text>
          )}
          {showText && (
            <Text
              fontSize={0.14 * scale}
              color="#fef3c7"
              anchorX="center"
              anchorY="middle"
              maxWidth={radius * 2.4}
              textAlign="center"
              position={[0, showUsername ? -0.05 * scale : 0, 0]}
              outlineWidth={0.008}
              outlineColor="#000000"
            >
              {message.text}
            </Text>
          )}
        </Billboard>
      )}
    </group>
  );
}
