/* Service worker for offline support.
 *
 * Strategy:
 * - On install, precache the app shell (index.html, manifest, icon) *and*
 *   the hashed build assets it references. The asset filenames are unknown
 *   ahead of time (Vite hashes them), so we fetch index.html and parse out
 *   every "/assets/..." URL. This makes the app offline-capable from the
 *   very first visit, before the SW controls the page.
 * - At runtime, same-origin GET requests use stale-while-revalidate so
 *   anything not precached still gets cached on first use and stays fresh.
 * - Navigation requests fall back to the cached app shell so client-side
 *   routes keep working offline (SPA).
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `memory-tools-${CACHE_VERSION}`;
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/icon.svg'];

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  const urls = new Set(APP_SHELL);

  // Discover hashed build assets referenced by the entry HTML.
  try {
    const res = await fetch('/index.html', { cache: 'no-cache' });
    if (res.ok) {
      const html = await res.text();
      const matches = html.match(/\/assets\/[A-Za-z0-9._-]+/g) || [];
      matches.forEach((u) => urls.add(u));
    }
  } catch {
    // Offline during install (unlikely) — cache whatever we can below.
  }

  await Promise.all(
    [...urls].map((url) =>
      cache.add(new Request(url, { cache: 'no-cache' })).catch(() => {
        // Skip individual assets that fail so install never rejects.
      })
    )
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: try network, fall back to the cached app shell so
  // deep links and refreshes keep working offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches
          .match(request, { ignoreVary: true })
          .then((cached) => cached || caches.match('/index.html', { ignoreVary: true }))
      )
    );
    return;
  }

  // Everything else: stale-while-revalidate.
  //
  // `ignoreVary` is important: the dev/preview server (and some hosts) send
  // `Vary: Origin`, and crossorigin module/style requests carry an `Origin`
  // header that a plain precache fetch does not — without this the cache
  // would miss those assets offline.
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request, { ignoreVary: true }).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && response.ok && response.type === 'basic') {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);

        return cached || network;
      })
    )
  );
});
