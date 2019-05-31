const VERSION = 'v1.00.1';
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const cacheResources = async () => {
    let cacheFilesFirst = [
        './',
        './manifest.json',
        './public/favicons/favicon.ico',
        './public/favicons/android-chrome-192x192.png',
        './public/images/apple-touch-icon.png',
        './public/views/assetEntry.ejs',
        './public/views/assetFind.ejs',
        './public/views/footer.ejs',
        './public/views/header.ejs',
        './public/views/index.ejs',
        './public/views/scanResults.ejs',
        './public/views/splash.ejs',
        './public/css/foundation.min.css',
        './public/css/overrides.css',
        './public/javascripts/main.js',
        './public/javascripts/quagga.min.js',
        './public/javascripts/EventHandler.js',
        './public/javascripts/FadeStuff.js',
        './public/javascripts/BCScan.js'
    ];
    const cache = await caches.open(VERSION);
    return cache.addAll(cacheFilesFirst);
};

self.addEventListener('install', async (event) => {
    event.waitUntil(cacheResources());
    await self.skipWaiting();
});

const cachedResource = async (request) => {
    const cache = await caches.open(VERSION);
    return await cache.match(request);
};

self.addEventListener('activate', async (event) => {
    console.log(`SW activated:  ${event}`);
    await self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
    console.log(`Fetch event: ${event.request.url}`);
    await event.respondWith(cachedResource(event.request));
});

self.addEventListener('push', async (event) => {

});

self.addEventListener('sync', async (event) => {

});