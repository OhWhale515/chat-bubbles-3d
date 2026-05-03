"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";

import type { ChatMessage, Settings } from "@/lib/types";
import { Bubble } from "./Bubble";

type Props = {
  messages: ChatMessage[];
  settings: Settings;
  /** Set true on the OBS overlay route to hide camera controls. */
  obsMode?: boolean;
};

/**
 * Holds the live set of bubbles. New chat messages fall into this set
 * and ride the physics until they expire by lifetime or are popped.
 */
export function Scene({ messages, settings, obsMode = false }: Props) {
  const [activeBubbles, setActiveBubbles] = useState<ChatMessage[]>([]);

  // When new messages arrive, push them into the active set, capped at maxBubbles.
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    setActiveBubbles((prev) => {
      if (prev.find((m) => m.id === last.id)) return prev;
      const next = [...prev, last];
      if (next.length > settings.maxBubbles) {
        next.splice(0, next.length - settings.maxBubbles);
      }
      return next;
    });
  }, [messages, settings.maxBubbles]);

  const handleExpire = (id: string) => {
    setActiveBubbles((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: obsMode ? "transparent" : undefined }}
      camera={{ position: [0, 0, 10], fov: 55 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.5} />
      <Environment preset="city" />

      {activeBubbles.map((m) => (
        <Bubble
          key={m.id}
          message={m}
          spawnHeight={settings.spawnHeight}
          scale={settings.bubbleScale}
          lifetimeMs={settings.bubbleLifetimeMs}
          showText={settings.showText}
          showUsername={settings.showUsername}
          onExpire={handleExpire}
        />
      ))}

      {!obsMode && <OrbitControls enablePan={false} maxDistance={18} minDistance={5} />}
    </Canvas>
  );
}
