/*
  LASBILU CLICK TRACKER

  1) Cloudflare Worker deployen.
  2) Die URL unten ersetzen.
     Beispiel:
     https://lasbilu-link-tracker.DEINNAME.workers.dev
*/

const TRACKER_BASE_URL = "https://DEIN-WORKER.workers.dev";

function trackLink(platform, source) {
  if (!TRACKER_BASE_URL || TRACKER_BASE_URL.includes("DEIN-WORKER")) {
    console.warn("Tracker ist noch nicht konfiguriert. TRACKER_BASE_URL in tracker.js setzen.");
    return;
  }

  const endpoint = `${TRACKER_BASE_URL}/track`;
  const data = new URLSearchParams({
    platform,
    source
  });

  // sendBeacon stört das Öffnen des eigentlichen Links nicht.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, data);
    return;
  }

  // Fallback für ältere Browser.
  fetch(endpoint, {
    method: "POST",
    body: data,
    keepalive: true,
    mode: "no-cors"
  }).catch(() => {});
}

document.querySelectorAll("[data-track]").forEach((link) => {
  link.addEventListener("click", () => {
    trackLink(
      link.dataset.track,
      link.dataset.trackSource || "unknown"
    );
  });
});
