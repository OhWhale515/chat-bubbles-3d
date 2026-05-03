export type ChatMessage = {
  id: string;
  username: string;
  text: string;
  /** Optional hex color from chat tags. */
  color?: string;
  timestamp: number;
};

export type Platform = "twitch" | "test";

export type Settings = {
  platform: Platform;
  channel: string;
  bubbleLifetimeMs: number;
  maxBubbles: number;
  showText: boolean;
  showUsername: boolean;
  spawnHeight: number;
  bubbleScale: number;
};

export const DEFAULT_SETTINGS: Settings = {
  platform: "test",
  channel: "",
  bubbleLifetimeMs: 8000,
  maxBubbles: 30,
  showText: true,
  showUsername: true,
  spawnHeight: 7,
  bubbleScale: 1,
};

/** Default bubble palette, adjusted to viewer color tag when present. */
export const DEFAULT_COLORS = [
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
];
