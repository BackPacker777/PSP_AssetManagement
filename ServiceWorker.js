// TODO:

'use strict';

const CACHE_NAME = "1.03";
let cacheFiles = [
    '/public/views/index.ejs',
    '/public/views/header.ejs',
    '/public/views/footer.ejs',
    '/public/views/BCReader.ejs',
    '/public/views/itemEntry.ejs',
    '/public/views/itemList.ejs',
    '/public/views/splash.ejs',
    '/public/views/scanResults.ejs',
    '/public/css/foundation.min.css',
    '/public/css/overrides.css',
    '/public/javascripts/main.js',
    '/public/javascripts/quagga.js',
    '/public/javascripts/EventHandler.js',
    '/public/javascripts/SplashEventHandler.js',
    '/public/favicons/favicon.ico'
];

self.addEventListener('install', (event) => {
     event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
               return cache.addAll(cacheFiles);
          })
     );
});

self.addEventListener('activate', (event) => {
     event.waitUntil(
          caches.keys().then(keys => {
               return Promise.all(
                    keys
                         .filter((key) => {
                              return !key.startsWith(CACHE_NAME);
                    })
                    .map((key) => {
                         return caches.delete(key);
                    })
               );
          })
     );
});

self.addEventListener('fetch', (event) => {
     event.respondWith(
          caches.match(event.request).then((res) => {
               if (res) {
                    return res;
               }
               let requestClone = event.request.clone();
               fetch(requestClone).then((res) => {
                    if (!res) {
                         return res;
                    }
                    let responseClone = res.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                         cache.put(event.request, responseClone);
                         return res;
                    });
               })
          })
     );
});