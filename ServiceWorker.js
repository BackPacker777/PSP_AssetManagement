const VERSION = 'v1.01';

const cacheResources = async () => {
    let cacheFilesFirst = [
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
    const cache = await caches.open(VERSION);
    return cache.addAll(cacheFilesFirst);
};

self.addEventListener('install', (event) =>
    event.waitUntil(cacheResources())
);

const cachedResource = async (request) => {
    const cache = await caches.open(VERSION);
    return await cache.match(request)
};

self.addEventListener('fetch', event =>
    event.respondWith(cachedResource(event.request))
);