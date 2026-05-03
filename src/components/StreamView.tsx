"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { loadSettings } from "@/lib/storage";
import { useTwitchChat } from "@/lib/twitch";
import { useTestFeed } from "@/lib/test-feed";
import type { Settings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { Scene } from "./Scene";

type Props = { obsMode?: boolean };

export function StreamView({ obsMode = false }: Props) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  const isTwitch = settings.platform === "twitch" && Boolean(settings.channel);
  const isTest = settings.platform === "test";

  const twitch = useTwitchChat(settings.channel, isTwitch);
  const fake = useTestFeed(isTest);

  const messages = isTwitch ? twitch.messages : fake.messages;
  const connected = isTwitch ? twitch.connected : fake.connected;
  const error = isTwitch ? twitch.error : null;

  if (!hydrated) {
    return <div className="h-screen w-screen bg-zinc-950" />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-transparent">
      <Scene messages={messages} settings={settings} obsMode={obsMode} />

      {!obsMode && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
          <div className="pointer-events-auto flex items-start justify-between gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-2 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                25days25 / Day 1 / Tier 3 Viral / Group A
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-100">Chat Bubbles 3D</p>
              <p className="mt-1 text-xs text-zinc-400">
                {settings.platform === "twitch"
                  ? `Twitch / #${settings.channel || "(no channel)"}`
                  : "Test feed (synthetic)"}
                {" / "}
                <span className={connected ? "text-emerald-400" : "text-zinc-500"}>
                  {connected ? "live" : "idle"}
                </span>
                {error ? ` / ${error}` : ""}
              </p>
            </div>
            <Link
              href="/settings"
              className="pointer-events-auto rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-2 text-xs font-bold uppercase tracking-wide text-zinc-300 backdrop-blur hover:border-zinc-600 hover:text-zinc-100"
            >
              Settings
            </Link>
          </div>

          <div className="pointer-events-auto self-end rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-2 font-mono text-[10px] text-zinc-500 backdrop-blur">
            {messages.length} msg / {settings.bubbleLifetimeMs / 1000}s lifetime / max{" "}
            {settings.maxBubbles}
            {" / "}
            <Link href="/overlay" className="text-amber-400 hover:underline">
              OBS overlay URL
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
