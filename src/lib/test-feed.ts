"use client";

import { useEffect, useState } from "react";
import type { ChatMessage } from "./types";

const FAKE_USERS = [
  "neon_dad",
  "ravenclaw_42",
  "sterlingg",
  "midnight_arcade",
  "popcorn_btw",
  "wave_gun",
  "ohwhale",
  "circuitvibe",
  "aurora_glo",
  "byte_widget",
];

const FAKE_LINES = [
  "first time chatting!",
  "this looks insane",
  "GG",
  "love the visuals",
  "lmaooo",
  "send it",
  "wave to the chat",
  "let's go",
  "drop the playlist",
  "incredible",
  "fire fire",
  "where is this from",
  "who built this",
  "i need it",
  "subscribed",
  "what tier is this",
];

const COLORS = ["#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#3b82f6"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useTestFeed(
  enabled: boolean,
  intervalMs = 1500
): {
  messages: ChatMessage[];
  connected: boolean;
  error: null;
} {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        username: pick(FAKE_USERS),
        text: pick(FAKE_LINES),
        color: pick(COLORS),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev.slice(-199), msg]);
    };
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);

  return { messages, connected: enabled, error: null };
}
