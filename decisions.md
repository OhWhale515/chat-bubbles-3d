# Architecture Decision Records - Chat Bubbles 3D

Architectural and technical decisions for Chat Bubbles 3D.

Format based on Michael Nygard's ADR template.

---

## Active Decisions

### ADR-001: Browser-only architecture, no server runtime

**Date**: 2026-05-02

**Status**: Accepted

**Context**

A Tier 3 viral widget for streamers with a $15 to $35 price target. Streamers expect to drop the URL into OBS as a browser source and have it work. Any server component (Node, Python, Go) means hosting, ops, and a billable API surface that does not match the price point.

**Decision**

Run entirely in the browser. The Next.js project is effectively static for the chat-rendering route. Twitch chat connects directly via the public anonymous IRC WebSocket from the browser. Settings persist in localStorage. No server endpoints are required for the core feature.

**Consequences**

Positive. Zero ops overhead. Zero recurring infra cost. Free Vercel tier covers it indefinitely. No API keys for users to manage.

Negative. Some platforms (TikTok Live, YouTube Live) do not expose anonymous read-only WebSocket endpoints. Adding them requires a server-side proxy, which we are deferring to v0.2.

Alternatives Considered. WebSocket gateway server (rejected: ongoing hosting cost). Vercel Edge function as IRC proxy (rejected: edge runtime does not support raw WebSocket clients well, and Twitch's public IRC works fine direct from browsers).

---

### ADR-002: Anonymous Twitch IRC, not the Helix API

**Date**: 2026-05-02

**Status**: Accepted

**Context**

To read Twitch chat the official Helix API requires app registration, OAuth, and refresh tokens. That is significant friction for a $15 product where users want to paste their channel name and be done.

**Decision**

Use the documented anonymous read pattern: connect to `wss://irc-ws.chat.twitch.tv:443`, authenticate as `justinfanXXXXX` with the literal pass `SCHMOOPIIE`, and JOIN the user's channel. Twitch supports this for public chat, and IRCv3 tags include the user's preferred display color.

**Consequences**

Positive. No app registration. No OAuth. No tokens to rotate. Works for any public Twitch channel.

Negative. We cannot send chat messages, only read. We cannot access subscriber-only chat, follower-only chat, or moderator metadata beyond what IRCv3 tags expose.

Alternatives Considered. Helix API + EventSub WebSocket (rejected: requires app registration per user, breaks self-hosted simplicity). tmi.js library (rejected: 60kb dependency that wraps the same anonymous pattern we can do in 80 lines).

---

### ADR-003: Custom integrator instead of cannon physics

**Date**: 2026-05-02

**Status**: Accepted

**Context**

The original spec called for `@react-three/cannon` for bubble physics. Cannon is heavy, takes time to set up, and the bubble interactions we need are simple: gravity, floor bounce, side walls, click-to-pop. No bubble-bubble collisions, no torque, no continuous deformation.

**Decision**

Implement gravity and bounce in a `useFrame` integrator inside the `Bubble` component. Each bubble owns its velocity vector and clamps to floor and walls per frame. No physics world.

**Consequences**

Positive. Smaller initial bundle. Simpler mental model. Easier to tune feel without fighting a physics engine.

Negative. Bubbles do not collide with each other. They overlap when many spawn at once. Acceptable for a chat overlay where messages flow rather than pile up.

Alternatives Considered. `@react-three/cannon` (rejected: heavyweight). `@react-three/rapier` (rejected: same reason, plus newer compatibility surface). CSS-only animation (rejected: no real 3D depth and no per-bubble physics).

---

## Superseded Decisions

(None yet.)

---

## Decision Categories

Use these categories when adding new ADRs: Infrastructure, Data, Security, API Design, Frontend, Backend, Integration, Process, Deployment.

---

## Adding a New ADR

1. Copy an ADR block above and increment the number.
2. Set the date to today in ISO format (YYYY-MM-DD).
3. Status starts at Accepted. Move to Superseded when a later ADR replaces it.
4. Keep Context tight. Decision should be one or two sentences. Consequences should name a real tradeoff, not a vague benefit.

---

**Last Updated**: 2026-05-02
