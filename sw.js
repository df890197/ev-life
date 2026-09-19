const CACHE_NAME = 'ev-life-cache-v4'; // 升級版本號強制觸發更新
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './splash.png',
    './achievements.js'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        )).then(() => self.clients.claim()) // 立即接管所有頁面
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;

    // 1. 只快取 GET 請求（忽略 POST 雲端同步請求，避免 Cache API 拋出錯誤）
    if (request.method !== 'GET') {
        return;
    }

    // 2. 忽略外部 API / 地圖資源（避免阻礙天氣、地址解析與地圖載入）
    const url = new URL(request.url);
    if (!url.origin.includes(self.location.origin)) {
        return;
    }

    // 3. Stale-While-Revalidate 策略：先用快取快速顯示，背景更新快取，斷網亦可離線瀏覽
    event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            const cachedResponse = await cache.match(request);
            
            const fetchPromise = fetch(request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
