const CACHE_NAME = 'ev-life-cache-v5';
const ASSETS_TO_CACHE = ['./', './index.html', './manifest.json', './achievements.js'];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
        for (const asset of ASSETS_TO_CACHE) {
            try { await cache.add(asset); } catch (err) { console.warn('[SW] 快取失敗已略過:', asset, err); }
        }
    }));
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (!request.url.startsWith('http') || request.method !== 'GET') return;
    event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            const cachedResponse = await cache.match(request);
            const fetchPromise = fetch(request).then(networkResponse => {
                if (networkResponse?.status === 200) cache.put(request, networkResponse.clone());
                return networkResponse;
            }).catch(() => cachedResponse);
            return cachedResponse || fetchPromise;
        })
    );
});