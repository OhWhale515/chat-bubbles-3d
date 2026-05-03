import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Bubbles 3D",
  description: "3D physics-based bubbles that pop on screen when viewers comment. OBS browser source.",
  openGraph: {
    title: "Chat Bubbles 3D",
    description: "3D physics-based bubbles for streamer chat overlays.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
