/* eslint-disable no-restricted-globals */
const CACHE_VERSION = 'reflecta-pwa-v2';
const APP_SHELL_URLS = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/icons/favicon.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_SHELL_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(cacheNames
                .filter((cacheName) => cacheName !== CACHE_VERSION)
                .map((cacheName) => caches.delete(cacheName))))
            .then(() => self.clients.claim())
    );
});

const isApiRequest = (url) => url.pathname.startsWith('/api/');

const networkFirstNavigation = async (request) => {
    const cache = await caches.open(CACHE_VERSION);

    try {
        const response = await fetch(request);
        cache.put('/index.html', response.clone());

        return response;
    } catch (error) {
        return caches.match('/index.html');
    }
};

const staleWhileRevalidate = async (request) => {
    const cache = await caches.open(CACHE_VERSION);
    const cachedResponse = await cache.match(request);
    const networkResponsePromise = fetch(request).then((response) => {
        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    });

    return cachedResponse || networkResponsePromise;
};

self.addEventListener('fetch', (event) => {
    const {
        request
    } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        return;
    }

    if (url.origin !== self.location.origin || isApiRequest(url)) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(networkFirstNavigation(request));

        return;
    }

    event.respondWith(staleWhileRevalidate(request));
});
