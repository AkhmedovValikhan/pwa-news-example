// Very simple service worker implementation

var shellCacheName = 'news-app-shell';
var apiCacheName = 'news-app-api';
var appShellFiles = [
    // Cache chunks emitted by webpack. Got ijected by plugin.
    ...serviceWorkerOption.assets,
    '.', // entry document page
    'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700'
];

var contentToCache = appShellFiles;

// Installing Service Worker
self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(shellCacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache).catch(e => console.log(e));
        })
    );
    console.log('[Service Worker] Installed');
});

// Fetching content using Service Worker
// This is very naive implmentation of cache-first strategy
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(apiCacheName).then(function (cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone()).catch(er => console.log(er));
                    return response;
                });
            });
        })
    );
});

