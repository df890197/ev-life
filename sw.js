const CACHE_NAME = 'ev-life-cache-v2';
const ASSETS_TO_CACHE = ['./', './index.html', './manifest.json', './splash.png'];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
    }));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});