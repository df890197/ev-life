const CACHE_NAME = 'ev-life-cache-v5';

// 預先快取清單：若 splash.png 尚未推播到 GitHub，請先不要放在這裡
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './achievements.js'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            // 使用個別快取容錯機制，避免單一檔案 404 造成整組 addAll 爆掉
            for (const asset of ASSETS_TO_CACHE) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.warn(`[SW] 快取失敗已略過: ${asset}`, err);
                }
            }
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
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // 1. 只處理 http 和 https 協定（徹底排除 chrome-extension:// 報錯）
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // 2. 只快取 GET 請求
    if (request.method !== 'GET') {
        return;
    }

    // 3. 忽略第三方外部 API / 地圖（避免污染本機快取）
    if (!url.origin.includes(self.location.origin)) {
        return;
    }

    // 4. 快取優先 / 背景更新策略
    event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            const cachedResponse = await cache.match(request);
            
            const fetchPromise = fetch(request).then(networkResponse => {
                // 只有成功取得 200 狀態碼才寫入快取，避免 404 檔案被存入
                if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            }).catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
