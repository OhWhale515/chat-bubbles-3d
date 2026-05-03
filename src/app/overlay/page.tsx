import { StreamView } from "@/components/StreamView";

/**
 * The OBS browser source URL. Same scene as the home page but with all
 * UI chrome (header, settings link, debug strip, camera controls) hidden
 * and a transparent body so the canvas composites on top of game capture.
 *
 * Add as an OBS browser source pointing at this route, e.g.:
 *   http://your-deployment.vercel.app/overlay
 *
 * Set the source size to match the OBS canvas (1920x1080 typical).
 */
export default function OverlayPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: "html,body{background:transparent !important;}",
        }}
      />
      <StreamView obsMode />
    </>
  );
}
