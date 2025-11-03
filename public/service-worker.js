/* eslint-disable no-undef */
/* eslint-disable no-console */
const CACHE_NAME = 'city-art-walks-cache-v3';
const IMAGE_CACHE = 'images-cache-v1';
const HTML_CACHE = 'html-cache-v1';
const API_ENDPOINT = '/api';

// Routes to exclude from caching
const EXCLUDE_ROUTES = [
  '/api/auth',
  '/dashboard',
  '/profile',
  '/api/artist/favorite',
  '/api/artist/counts',
  '/api/art-piece/counts',
  '/api/art-piece/favorite',
]; 

const MAX_HTML_CACHE_AGE = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

// Install Event: Activate immediately
self.addEventListener('install', () => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Activate immediately after installation
});

// Activate Event: Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== CACHE_NAME &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== HTML_CACHE
          )
          .map((cacheName) => caches.delete(cacheName)) // Delete old caches
      );
    }).then(() => clients.claim()) // Take control of all open tabs
  );
});

// Fetch Event: Cache everything except excluded routes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip caching for excluded routes
  if (EXCLUDE_ROUTES.some((excludedRoute) => url.pathname.startsWith(excludedRoute))) {
    console.log(`Excluded from cache: ${url.pathname}`);
    return; // Skip caching for excluded routes
  }

  // Cache API requests
  if (url.pathname.startsWith(API_ENDPOINT)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Serve cached API response
        }
        return fetchAndCache(event.request, CACHE_NAME); // Fetch and cache API response
      })
    );
    return;
  }

  // Cache HTML pages and other assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        if (event.request.destination === 'document') {
          const cachedTime = new Date(cachedResponse.headers.get('sw-cache-timestamp'));
          const now = new Date();

          // Check if the cached HTML is expired
          if (now - cachedTime > MAX_HTML_CACHE_AGE) {
            console.log(`Cache expired for: ${url.pathname}`);
            return fetchAndCache(event.request, HTML_CACHE); // Fetch fresh HTML and cache it
          }
        }

        console.log(`Serving cached response for: ${url.pathname}`);
        return cachedResponse; // Serve valid cached response
      }

      return fetchAndCache(event.request, HTML_CACHE); // Fetch and cache the response
    })
  );
});

// Listen for messages
self.addEventListener('message', (event) => {
  if (!event.data) return;

  const { type } = event.data;

  switch (type) {
    case 'refresh-cache':
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        }).then(() => {
          console.log('All caches cleared successfully.');
        })
      );
      break;

    default:
      console.log(`Unknown message type: ${type}`);
  }
});

// Helper Function: Fetch and cache a request
async function fetchAndCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(cacheName);

    // Clone the response and add a custom timestamp header for HTML
    let responseToCache = networkResponse.clone();
    if (request.destination === 'document') {
      const responseHeaders = new Headers(responseToCache.headers);
      responseHeaders.append('sw-cache-timestamp', new Date().toISOString());

      responseToCache = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: responseHeaders,
      });
    }

    // Cache the response
    cache.put(request, responseToCache.clone());
    console.log(`Cached response for: ${request.url}`);
    return networkResponse; // Return the live network response
  } catch (error) {
    console.error(`Fetch failed for: ${request.url}`, error);
    throw error; // Rethrow the error for fallback handling
  }
}
