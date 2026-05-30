// sw.js - Service Worker Purnawiyata Az-Zahro
const CACHE_NAME = 'purnawiyata-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './data-siswa.json',
  'https://azzahrolocare.github.io/data/purnawiyata/files/opening3.mp4',
  'https://azzahrolocare.github.io/data/purnawiyata/graduation-anthem.mp3',
  'https://github.com/masrahmat-id/absensi-barcode-online-smp-smk-azzahro/raw/main/logo-smp-azzahro.png',
  'https://azzahrolocare.github.io/media/logo/PPSS-Az-Zahro.png'
];

// Install Service Worker dan Simpan Aset Utama ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Mengunci aset utama ke dalam Cache Storage...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Aktivasi dan Pembersihan Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi Fetch: Cache First, Fallback to Network
// Khusus video/audio besar, menggunakan strategi bawaan browser atau cache match dasar
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Jika file berupa foto siswa baru yang belum terdaftar di awal, masukkan ke cache otomatis
        if (event.request.url.includes('.jpg') || event.request.url.includes('.png') || event.request.url.includes('data-siswa.json')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    })
  );
});
