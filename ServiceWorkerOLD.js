'use strict';

const CACHE_NAME = "1.00";
let cacheFiles = [
    '/data/asset_data.db',
    '/public/views/index.ejs',
    '/public/views/header.ejs',
    '/public/views/footer.ejs',
    '/public/views/BCReader.ejs',
    '/public/views/itemEntry.ejs',
    '/public/views/itemList.ejs',
    '/public/views/splash.ejs',
    '/public/views/scanResults.ejs',
    '/public/views/itemFind.ejs',
    '/public/css/foundation.min.css',
    '/public/css/overrides.css',
    '/public/javascripts/main.js',
    '/public/javascripts/quagga.js',
    '/public/javascripts/EventHandler.js',
    '/public/javascripts/SplashEventHandler.js',
    '/public/favicons/favicon.ico',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
          caches.open(CACHE_NAME).then(function(cache) {
            // return cache.addAll(cacheFiles);
              cacheFiles.forEach((url) => {
                  return cache.add(url);
              });
          })
     );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return true;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

/*self.addEventListener('activate', function(event) {
    let cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});*/

/*self.addEventListener('activate', (event) => {
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
});*/

/*self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    return response || fetch(event.request)
                        .then(response => {
                            const responseClone = response.clone();
                            cache.put(event.request, responseClone);
                        })
                })
            }
        )
    );
});*/

/*self.addEventListener('fetch', (event) => {
     event.respondWith(
          caches.match(event.request).then((res) => {
               if (res) {
                    return res || fetch(event.request);
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
});*/
