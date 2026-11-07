const CACHE_NAME = "sevana-shell-v3";
const PRECACHE_URLS = ["/manifest.json", "/logo.png"];

self.addEventListener("install", (event) => {
  // Keep service-worker installation lightweight. Do not block it on the full homepage.
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "reload" });
            if (response.ok) await cache.put(url, response);
          } catch {
            // A single optional asset should not prevent the worker from installing.
          }
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("sevana-shell-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML pages: network first, cached page only as an offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            );
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) || (await caches.match("/"));
        })
    );
    return;
  }

  // Next.js hashed assets and common public assets: cache first for faster repeat visits.
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:png|jpe?g|webp|svg|ico|woff2?)$/i.test(url.pathname);

  if (!isStaticAsset) return;

  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        );
      }
      return response;
    })
  );
});
