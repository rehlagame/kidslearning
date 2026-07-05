const CACHE_NAME = 'kids-learning-v2';

// قائمة بجميع الملفات التي يحتاجها التطبيق ليعمل بدون إنترنت (بما فيها الملفات المتقدمة)
const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './css/canvas.css',
    './js/app.js',
    './js/canvas.js',
    './js/tracking.js',
    './data/arabic_letters.json',
    './data/arabic_numbers.json',
    './data/english_letters.json',
    './data/english_numbers.json',
    './data/arabic_words.json',
    './data/math_equations.json',
    './data/english_words.json',
    './data/english_advanced.json',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// حدث التثبيت: حفظ الملفات في الذاكرة
self.addEventListener('install', event => {
    // تفعيل الـ Service Worker الجديد فوراً
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('تم حفظ الملفات بنجاح في الذاكرة (Cache)');
                return cache.addAll(urlsToCache);
            })
    );
});

// حدث الجلب: عند تشغيل التطبيق، ابحث عن الملفات في الذاكرة أولاً
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد الملف في الذاكرة، استخدمه. وإلا، اطلبه من الشبكة.
                return response || fetch(event.request);
            })
    );
});

// حدث التفعيل: تنظيف أي ملفات قديمة (مثل v1) إذا قمنا بتحديث التطبيق مستقبلاً
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // السيطرة على الصفحات المفتوحة فوراً
    return self.clients.claim();
});