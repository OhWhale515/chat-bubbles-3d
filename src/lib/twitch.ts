"use client";

/**
 * Anonymous Twitch IRC over WebSocket. No OAuth required.
 *
 * Twitch documents this as the chat-only public read endpoint:
 *   wss://irc-ws.chat.twitch.tv:443
 *
 * Auth as a guest by sending NICK justinfanXXXXX and a literal pass:
 *   PASS SCHMOOPIIE
 *   NICK justinfanXXXXX
 *
 * Then JOIN #channel. PRIVMSG events arrive with IRCv3 tags including
 * the user's preferred chat color.
 */

import { useEffect, useRef, useState } from "react";

import type { ChatMessage } from "./types";

const TWITCH_WS_URL = "wss://irc-ws.chat.twitch.tv:443";

function randomNick(): string {
  return `justinfan${Math.floor(10000 + Math.random() * 89999)}`;
}

function parseIrcv3Tags(raw: string): Record<string, string> {
  // raw looks like: "@badge-info=;color=#FF7F50;display-name=foo"
  const out: Record<string, string> = {};
  const inner = raw.startsWith("@") ? raw.slice(1) : raw;
  for (const pair of inner.split(";")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    const key = pair.slice(0, eq);
    const value = pair.slice(eq + 1);
    out[key] = value;
  }
  return out;
}

type ParsedPrivmsg = {
  tags: Record<string, string>;
  username: string;
  channel: string;
  text: string;
};

/**
 * Parse a single IRC line into a PRIVMSG record. Returns null for non-PRIVMSG.
 *
 * Sample line:
 *   @color=#FF7F50;display-name=Foo :foo!foo@foo.tmi.twitch.tv PRIVMSG #channel :hello world
 */
function parsePrivmsg(line: string): ParsedPrivmsg | null {
  let rest = line;
  let tags: Record<string, string> = {};
  if (rest.startsWith("@")) {
    const space = rest.indexOf(" ");
    tags = parseIrcv3Tags(rest.slice(0, space));
    rest = rest.slice(space + 1);
  }
  if (!rest.startsWith(":")) return null;
  const space = rest.indexOf(" ");
  const prefix = rest.slice(1, space);
  rest = rest.slice(space + 1);

  if (!rest.startsWith("PRIVMSG ")) return null;
  rest = rest.slice("PRIVMSG ".length);

  const channelEnd = rest.indexOf(" :");
  if (channelEnd === -1) return null;
  const channel = rest.slice(0, channelEnd);
  const text = rest.slice(channelEnd + 2);

  const bang = prefix.indexOf("!");
  const username = bang === -1 ? prefix : prefix.slice(0, bang);

  return { tags, username, channel, text };
}

export function useTwitchChat(channel: string, enabled: boolean): {
  messages: ChatMessage[];
  connected: boolean;
  error: string | null;
} {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled || !channel) {
      setConnected(false);
      return;
    }
    setError(null);
    const ws = new WebSocket(TWITCH_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send("CAP REQ :twitch.tv/tags");
      ws.send("PASS SCHMOOPIIE");
      ws.send(`NICK ${randomNick()}`);
      ws.send(`JOIN #${channel.toLowerCase()}`);
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const lines = String(event.data).split("\r\n").filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("PING ")) {
          ws.send(line.replace(/^PING/, "PONG"));
          continue;
        }
        const msg = parsePrivmsg(line);
        if (!msg) continue;
        const display = msg.tags["display-name"] || msg.username;
        const color = msg.tags.color || undefined;
        const id = msg.tags.id || `${Date.now()}-${Math.random()}`;
        setMessages((prev) => {
          const next = [
            ...prev,
            {
              id,
              username: display,
              text: msg.text,
              color,
              timestamp: Date.now(),
            },
          ];
          return next.slice(-200); // cap memory
        });
      }
    };

    ws.onerror = () => {
      setError("Twitch chat WebSocket error");
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [channel, enabled]);

  return { messages, connected, error };
}
