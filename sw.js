const CACHE_NAME = 'smart-cache-v1'; // هنا تم تصحيح c لـ سمول

// هنا بنحفظ بس رابط البداية عشان التثبيت يشتغل
const INITIAL_ASSETS = [
  './',
  './index.html', 
  './stayle.css', 
  './content.js', 
  './script.js'
];

// التثبيت المبدئي
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(INITIAL_ASSETS);
    })
  );
});

// هنا السحر: أي ملف يتفتح والنت شغال، بيتحفظ تلقائي للـ "أوفلاين"
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; 
      }

      return fetch(e.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        return caches.match('./index.html');
      });
    })
  );
});
