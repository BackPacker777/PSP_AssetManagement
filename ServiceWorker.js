const VERSION = 'v1.14';

let cacheFirstFiles = [
    './',
    './public/views/index.ejs',
    './public/views/header.ejs',
    './public/views/footer.ejs',
    './public/views/BCReader.ejs',
    './public/views/itemEntry.ejs',
    './public/views/splash.ejs',
    './public/views/scanResults.ejs',
    './public/views/itemFind.ejs',
    './public/css/foundation.min.css',
    './public/css/overrides.css',
    './public/javascripts/main.js',
    './public/javascripts/quagga.js',
    './public/javascripts/EventHandler.js',
    './public/javascripts/SplashEventHandler.js',
    './public/javascripts/BCScan.js',
    './public/favicons/favicon.ico'
];

let networkFirstFiles = [
    '/data/asset_data.db'
];

// Below is the service worker code.

let cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(VERSION).then(cache => {
            // return cache.addAll(cacheFiles);
            cacheFiles.forEach((url) => {
                return cache.add(url);
            });
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') { return; }
    if (networkFirstFiles.indexOf(event.request.url) !== -1) {
        event.respondWith(networkElseCache(event));
    } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
        event.respondWith(cacheElseNetwork(event));
    }
    event.respondWith(fetch(event.request));
});

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork (event) {
    return caches.match(event.request).then(response => {
        function fetchAndCache () {
            return fetch(event.request).then(response => {
                // Update cache.
                caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
                return response;
            });
        }

        // If not exist in cache, fetch.
        if (!response) { return fetchAndCache(); }

        // If exists in cache, return from cache while updating cache in background.
        fetchAndCache();
        return response;
    });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
    return caches.match(event.request).then(match => {
        if (!match) { return fetch(event.request); }
        return fetch(event.request).then(response => {
            // Update cache.
            caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
            return response;
        }) || response;
    });
}