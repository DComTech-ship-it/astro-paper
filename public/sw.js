// Cache name and version
const CACHE_NAME = 'bigger-minds-cache-v1';
const CACHE_VERSION = 1;

// Files to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/posts/',
  '/authors/',
  '/tags/',
  '/search/',
  '/about/',
  '/submit',
  '/offline'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(() => {
    // Pre-cache essential pages
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CACHE_URLS.map(url => new Request(url, { cache: 'force-cache' })));
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error('Failed to pre-cache cache:', error);
      });
  });
});

// Fetch event with network-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if request failed (offline)
            if (!networkResponse.ok && networkResponse.status === 0) {
              // Return offline page for navigation requests
              if (event.request.mode === 'navigate') {
                return caches.match('/offline.astro').then(offlineResponse => {
                  return offlineResponse || new Response('Offline page not found', { status: 404 });
                });
              }
            }
            
            // Cache the new response
            return caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, networkResponse.clone()))
              .then(() => networkResponse);
          });
      })
      .catch((error) => {
        console.error('Fetch failed:', error);
        
        // Return offline page for failed requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.astro').then(offlineResponse => {
            return offlineResponse || new Response('Offline', { status: 503 });
          });
        }
        
        return new Response('Network error', { status: 500 });
      });
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(() => {
    // Clean up old caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    });
  });
});
