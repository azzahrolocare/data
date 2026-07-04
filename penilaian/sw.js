const CACHE_NAME = 'azzahro-offline-v1';
// Aset yang wajib disimpan untuk mode offline
const ASSETS_TO_CACHE = [
  'offline.html'
];

// Install Service Worker dan simpan halaman offline ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivasi dan bersihkan cache lama jika ada update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategi Network First, Fallback to Offline Page
self.addEventListener('fetch', (event) => {
  // Hanya tangani permintaan dokumen (halaman HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Jika jaringan gagal/offline, buka cache offline.html
        return caches.match('offline.html');
      })
    );
  }
});
