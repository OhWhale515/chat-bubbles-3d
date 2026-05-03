import Link from "next/link";
import { SettingsForm } from "@/components/SettingsForm";

export default function SettingsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.3em] text-zinc-500 transition hover:text-zinc-300"
        >
          Back to overlay
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Chat Bubbles 3D
        </h1>
        <p className="text-sm text-zinc-400">
          Stream-overlay settings. Saved to your browser. Use the OBS browser source URL to add
          this scene to your stream.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <SettingsForm />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 text-sm text-zinc-400">
        <p className="text-xs font-bold uppercase tracking-wide text-zinc-300">
          OBS browser source
        </p>
        <ol className="mt-3 list-decimal pl-5 text-xs leading-relaxed">
          <li>In OBS, add a Browser source.</li>
          <li>
            Set the URL to{" "}
            <code className="rounded bg-zinc-950 px-1.5 py-0.5 text-zinc-200">
              {"http://localhost:3000/overlay"}
            </code>{" "}
            during local testing, or your Vercel deployment URL plus{" "}
            <code className="rounded bg-zinc-950 px-1.5 py-0.5 text-zinc-200">/overlay</code>.
          </li>
          <li>Width 1920, Height 1080 is the typical canvas size.</li>
          <li>
            Tick &quot;Refresh browser when scene becomes active&quot; so the page re-reads
            settings whenever you switch back.
          </li>
        </ol>
      </div>
    </main>
  );
}
