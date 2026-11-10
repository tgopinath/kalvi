// Kalvi offline shell: app files are cached as they are fetched (network first, cache fallback);
// Wikimedia pictures are cached on first view.
const SHELL = 'kalvi-shell-v1', IMG = 'kalvi-img-v1';
const CORE = ['./', 'index.html', 'styles.css', 'kolam/tokens.css', 'kolam/kolam.css', 'manifest.json', 'icon.svg', 'icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL && k !== IMG).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(SHELL).then(s => s.put(e.request, c)); } return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  } else if (/upload\.wikimedia\.org/.test(u.host)) {
    e.respondWith(caches.open(IMG).then(async c => (await c.match(e.request)) || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; })));
  }
});
