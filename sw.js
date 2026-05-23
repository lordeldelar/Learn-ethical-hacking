const CACHE_NAME = 'v1_cache';
const ASSETS = [
  './',
  './index.html',
  './stayle.css',
  './content.js',
  './script.js'
];


// تثبيت السيرفيس وركر وحفظ الملفات الأساسية في الكاش
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// تشغيل التطبيق حتى لو مفيش إنترنت
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
