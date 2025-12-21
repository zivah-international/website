// Service Worker for caching strategies
// This file should be placed in the public directory as sw.js

const CACHE_NAME = 'zivah-v1'
const STATIC_CACHE = 'zivah-static-v1'
const DYNAMIC_CACHE = 'zivah-dynamic-v1'
const API_CACHE = 'zivah-api-v1'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  // Add critical CSS and JS files
  '/_next/static/css/app.css',
  // Add critical images
  '/assets/images/zivah-logo.svg',
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/categories',
  '/api/measures',
  '/api/countries',
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip external requests
  if (!url.origin.includes(self.location.origin)) return

  // API caching strategy
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    event.respondWith(apiCacheStrategy(request))
    return
  }

  // Static file caching strategy
  if (STATIC_FILES.some(file => url.pathname === file) || url.pathname.startsWith('/_next/static/')) {
    event.respondWith(staticCacheStrategy(request))
    return
  }

  // Dynamic content caching strategy
  event.respondWith(dynamicCacheStrategy(request))
})

// Static cache strategy - Cache First
async function staticCacheStrategy(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

// API cache strategy - Network First with fallback
async function apiCacheStrategy(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }

    // If network fails, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    return networkResponse
  } catch (error) {
    // Try cache as fallback
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Dynamic cache strategy - Stale While Revalidate
async function dynamicCacheStrategy(request) {
  try {
    const cachedResponse = await caches.match(request)

    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(DYNAMIC_CACHE)
        cache.then((cache) => cache.put(request, networkResponse.clone()))
      }
      return networkResponse
    })

    // Return cached version immediately if available
    if (cachedResponse) {
      // Update cache in background
      fetchPromise.catch(() => {
        // Ignore fetch errors for stale-while-revalidate
      })
      return cachedResponse
    }

    // No cache, wait for network
    return await fetchPromise
  } catch (error) {
    // Try cache as last resort
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    return new Response('Offline', { status: 503 })
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Implement background sync logic here
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/assets/images/icons/icon-192x192.png',
      badge: '/assets/images/icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    self.clients.openWindow('/')
  )
})
