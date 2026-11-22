// Offline-Fähigkeit: App-Dateien und die Bibliothek von jsdelivr werden zwischengespeichert.
// Die Whisper-Modelldateien speichert transformers.js selbst im Browser-Cache.
const CACHE = 'hablemos-v6';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'audio.js', 'asr.js', 'worker.js', 'store.js',
  'core/compare.js', 'core/scenes.js', 'core/bromas.js', 'core/srs.js', 'core/vocab.js', 'core/vocab-a1.js', 'core/vocab-a2.js', 'core/vocab-b1.js', 'core/vocab-b2.js', 'core/vocab-c1.js', 'manifest.webmanifest', 'icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // eigene Dateien: erst Netz (damit Änderungen ankommen), sonst Cache
    e.respondWith(fetch(req).then(r => { caches.open(CACHE).then(c => c.put(req, r.clone())); return r; }).catch(() => caches.match(req)));
  } else if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { caches.open(CACHE).then(c => c.put(req, r.clone())); return r; })));
  }
});
