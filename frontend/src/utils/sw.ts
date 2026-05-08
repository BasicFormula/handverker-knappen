
// This is a basic service worker.
// It allows the app to be installed and provides some basic offline capabilities.

const CACHE_NAME = 'hjelpknappen-cache-v1';
const urlsToCache = [
  '/',
  // We can add more critical assets here later (like CSS, main JS bundles, etc.)
];

// Install event: open a cache and add the core assets to it.
self.addEventListener('install', (event) => {
  // @ts-ignore
  event.waitUntil(
    // @ts-ignore
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve assets from the cache first.
// If the asset is not in the cache, it will be fetched from the network.
self.addEventListener('fetch', (event) => {
  // @ts-ignore
  event.respondWith(
    // @ts-ignore
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        // @ts-ignore
        return fetch(event.request);
      }
    )
  );
});
