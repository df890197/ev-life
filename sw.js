// EV Life - LUXGEN n7 行駛日誌 PWA 離線快取快遞員
const CACHE_NAME = 'ev-life-cache-v2'; // 🌟 升級至 v2 確保資源能主動覆蓋更新 🌟
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// 1. 安裝 Service Worker：主動將重要套件與本體網頁存入快取記憶體
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] 正在建立快取寶箱，確保離線行車記錄可用...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. 啟用階段：清除舊版本的過時快取，保持輕量
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] 清理舊版過時快取資源:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 截獲請求：確保您在無訊號的山區或高速公路上仍可載入行車日誌
self.addEventListener('fetch', event => {
  // 略過雲端 API 同步 POST/GET 的請求，由實時網路發送
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // 在背景發送請求取得最新版本，更新快取，保證下次開啟是最新
        fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* 離線時忽略錯誤 */});
        
        return cachedResponse; // 立即返還快取，零秒極速載入
      }
      
      // 若快取無資源，改由網路載入並塞入快取
      return fetch(event.request).then(networkResponse => {
        if (networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
        // 全線斷網且無快取資源
      });
    })
  );
});