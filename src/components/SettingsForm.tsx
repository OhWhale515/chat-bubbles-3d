"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { loadSettings, saveSettings } from "@/lib/storage";
import type { Platform, Settings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";

export function SettingsForm() {
  const router = useRouter();
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setS(loadSettings());
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]): void {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveSettings(s);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function preview() {
    saveSettings(s);
    router.push("/");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Field label="Platform" hint="Twitch chat works without auth. Test feed simulates messages locally.">
        <select
          value={s.platform}
          onChange={(e) => update("platform", e.target.value as Platform)}
          className={inputClass}
        >
          <option value="test">Test feed (synthetic messages)</option>
          <option value="twitch">Twitch (anonymous read)</option>
        </select>
      </Field>

      {s.platform === "twitch" && (
        <Field label="Twitch channel" hint="Just the channel name, no # and no URL.">
          <input
            type="text"
            value={s.channel}
            onChange={(e) => update("channel", e.target.value.trim().replace(/^#/, ""))}
            placeholder="ohwhale515"
            className={inputClass}
            autoComplete="off"
            spellCheck={false}
          />
        </Field>
      )}

      <Field label="Bubble lifetime" hint="How long a bubble lives before it pops.">
        <RangeRow
          min={3000}
          max={20000}
          step={500}
          value={s.bubbleLifetimeMs}
          onChange={(v) => update("bubbleLifetimeMs", v)}
          format={(v) => `${(v / 1000).toFixed(1)}s`}
        />
      </Field>

      <Field label="Max bubbles on screen" hint="Cap to keep the FPS smooth.">
        <RangeRow
          min={5}
          max={80}
          step={1}
          value={s.maxBubbles}
          onChange={(v) => update("maxBubbles", v)}
          format={(v) => String(v)}
        />
      </Field>

      <Field label="Bubble scale">
        <RangeRow
          min={0.6}
          max={2.0}
          step={0.05}
          value={s.bubbleScale}
          onChange={(v) => update("bubbleScale", v)}
          format={(v) => v.toFixed(2)}
        />
      </Field>

      <Field label="Spawn height" hint="Where bubbles enter the scene from above.">
        <RangeRow
          min={2}
          max={12}
          step={0.5}
          value={s.spawnHeight}
          onChange={(v) => update("spawnHeight", v)}
          format={(v) => v.toFixed(1)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Toggle
          label="Show username"
          checked={s.showUsername}
          onChange={(v) => update("showUsername", v)}
        />
        <Toggle
          label="Show message text"
          checked={s.showText}
          onChange={(v) => update("showText", v)}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-400"
        >
          {savedFlash ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={preview}
          className="rounded-lg border border-zinc-700 bg-transparent px-5 py-3 text-sm font-bold text-zinc-200 transition hover:border-zinc-500"
        >
          Save and view
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">{label}</span>
      {children}
      {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}

function RangeRow({
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-amber-500"
      />
      <span className="w-16 text-right font-mono text-xs text-zinc-300">{format(value)}</span>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-zinc-700 bg-zinc-900 accent-amber-500"
      />
      <span className="text-sm text-zinc-200">{label}</span>
    </label>
  );
}
