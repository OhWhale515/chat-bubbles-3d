# 🫧 Chat Bubbles 3D (BubbleChat)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOhWhale515%2Fchat-bubbles-3d)
[![Get the Source](https://img.shields.io/badge/Get%20the%20Source-Gumroad-orange)](https://gumroad.com/l/25days-full-bundle)

> 3D physics-based bubbles that pop on screen when viewers comment. Drop-in OBS browser source.

**Day 1 of the [25 Days of Code](https://github.com/OhWhale515/25days25-meta) sprint.** 
A viral-ready OBS overlay that brings your live stream chat to life with realistic 3D physics.


For TikTokers, Twitch streamers, and creators who want a stream overlay that feels alive without paying recurring SaaS fees.

## How it works

- React Three Fiber scene with bouncy bubbles, each carrying one chat message.
- Anonymous Twitch IRC over WebSocket. No OAuth, no API keys.
- Test feed mode for local preview without a Twitch channel.
- Free, fully open source. Self-host on your own Vercel or run locally.
- OBS browser source at `/overlay` with a transparent background, no UI chrome.

---

## Quick start

```bash
git clone https://github.com/OhWhale515/chat-bubbles-3d.git
cd chat-bubbles-3d
npm install
npm run dev
```

Open `http://localhost:3000`. The default platform is "Test feed" so you see synthetic bubbles immediately. Open settings to switch to your Twitch channel.

---

## Use as an OBS browser source

1. Deploy to your own Vercel. `vercel`
2. In OBS, add a Browser source.
3. URL: `https://your-deployment.vercel.app/overlay`
4. Width 1920, Height 1080.
5. Tick "Refresh browser when scene becomes active" so settings changes pick up automatically.

The `/overlay` route renders the same scene as the home page but with no header, no settings link, no debug strip, no camera controls, and a transparent body so it composites cleanly over your game capture.

---

## Settings

Stored in your browser's localStorage. The overlay route reads them on mount, so to change them while streaming open the settings page in another browser tab and click Save, then refresh the OBS browser source.

| Setting | Range | Use |
| :---- | :---- | :---- |
| Platform | Test or Twitch | Pick the chat source |
| Twitch channel | string | Your Twitch handle, no `#` |
| Bubble lifetime | 3 to 20 seconds | How long a bubble lives before popping |
| Max bubbles | 5 to 80 | Cap to keep FPS smooth |
| Bubble scale | 0.6 to 2.0 | Size multiplier |
| Spawn height | 2 to 12 | Where bubbles enter from above |
| Show username | toggle | Show the chatter's name on the bubble |
| Show message text | toggle | Show the message text on the bubble |

---

## What v0.1.0 covers

- Twitch chat (anonymous IRC over WebSocket)
- Test feed for local preview
- Bubble physics: gravity, floor bounce, side walls, click-to-pop
- Per-user color tags from Twitch IRCv3
- Stable per-user color fallback when no tag is set
- Username and message text on each bubble
- Configurable lifetime, max count, scale, spawn height
- OBS-friendly `/overlay` route with transparent background

## On the roadmap

- TikTok Live integration via a server-side proxy
- YouTube Live chat integration
- Sound effects per message and per pop
- Custom bubble emoji and image overlays
- Theme presets (cinematic, neon, vaporwave)
- Trigger threshold (pop only on bits, subs, or specific keywords)
- Tip integration for visualizing donations

---

## Tech stack

- Next.js 15 (App Router)
- React 19
- React Three Fiber 9 + drei 10
- Three.js 0.171
- Tailwind CSS 4
- TypeScript

---

## Documentation

- [`decisions.md`](./decisions.md) Architecture Decision Records
- [`llms.txt`](./llms.txt) LLM and human context map

---

## License

MIT. Bring your own deployment. Bring your own channel.

**Scaffolded**: 2026-05-02
