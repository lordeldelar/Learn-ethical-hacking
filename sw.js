const CACHE_NAME = 'smart-cache-v1';

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
        return cachedResponse; // لو الملف محفوظ قبل كده افتحه علطول
      }

      // لو مش محفوظ، هاته من النت واحفظ نسخة منه للمستقبل
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
        // لو مفيش نت خالص والملف مش متكاش، تقدر تخليه يفتح الصفحة الرئيسية
        return caches.match('./index.html');
      });
    })
  );
});
