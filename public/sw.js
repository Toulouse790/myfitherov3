
// Service Worker avec stratégies de cache avancées
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGES_CACHE = `images-${CACHE_VERSION}`;

// URLs à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Stratégies de cache par type de ressource
const CACHE_STRATEGIES = {
  // API: Network First (données fraîches prioritaires)
  api: 'networkFirst',
  // Pages: Stale While Revalidate (affichage rapide + mise à jour)
  pages: 'staleWhileRevalidate',
  // Assets statiques: Cache First (performance)
  static: 'cacheFirst',
  // Images: Cache First avec fallback
  images: 'cacheFirst'
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation en cours...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Mise en cache des ressources statiques...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker installé avec succès');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Erreur installation Service Worker:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Supprime les anciens caches
              return cacheName.includes('static-') && 
                     cacheName !== STATIC_CACHE ||
                     cacheName.includes('dynamic-') && 
                     cacheName !== DYNAMIC_CACHE ||
                     cacheName.includes('api-') && 
                     cacheName !== API_CACHE ||
                     cacheName.includes('images-') && 
                     cacheName !== IMAGES_CACHE;
            })
            .map(cacheName => {
              console.log(`🗑️ Suppression ancien cache: ${cacheName}`);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activé');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes avec stratégies intelligentes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignore les requêtes non-GET
  if (request.method !== 'GET') return;
  
  // Détermine la stratégie selon le type de ressource
  let strategy;
  let cacheName;
  
  if (url.pathname.startsWith('/api/')) {
    strategy = CACHE_STRATEGIES.api;
    cacheName = API_CACHE;
  } else if (url.pathname.match(/\.(js|css|woff2?|ttf)$/)) {
    strategy = CACHE_STRATEGIES.static;
    cacheName = STATIC_CACHE;
  } else if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
    strategy = CACHE_STRATEGIES.images;
    cacheName = IMAGES_CACHE;
  } else {
    strategy = CACHE_STRATEGIES.pages;
    cacheName = DYNAMIC_CACHE;
  }
  
  event.respondWith(handleRequest(request, strategy, cacheName));
});

// Gestion des requêtes selon la stratégie
async function handleRequest(request, strategy, cacheName) {
  try {
    switch (strategy) {
      case 'networkFirst':
        return await networkFirst(request, cacheName);
      case 'cacheFirst':
        return await cacheFirst(request, cacheName);
      case 'staleWhileRevalidate':
        return await staleWhileRevalidate(request, cacheName);
      default:
        return await fetch(request);
    }
  } catch (error) {
    console.error('❌ Erreur Service Worker:', error);
    return await handleOfflineFallback(request);
  }
}

// Stratégie Network First (API)
async function networkFirst(request, cacheName) {
  try {
    console.log(`🌐 Network First: ${request.url}`);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`📦 Fallback cache: ${request.url}`);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stratégie Cache First (Assets statiques)
async function cacheFirst(request, cacheName) {
  console.log(`📦 Cache First: ${request.url}`);
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Stratégie Stale While Revalidate (Pages)
async function staleWhileRevalidate(request, cacheName) {
  console.log(`🔄 Stale While Revalidate: ${request.url}`);
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(error => {
    console.warn('Network failed, using cache only:', error);
    return cachedResponse;
  });
  
  // Retourne immédiatement le cache si disponible
  return cachedResponse || networkResponsePromise;
}

// Fallback hors ligne
async function handleOfflineFallback(request) {
  if (request.destination === 'document') {
    const cachedPage = await caches.match('/');
    if (cachedPage) return cachedPage;
  }
  
  return new Response('Contenu non disponible hors ligne', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Nettoyage périodique du cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanupCache();
  }
});

async function cleanupCache() {
  console.log('🧹 Nettoyage du cache...');
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const cacheDate = new Date(response.headers.get('date'));
      const now = new Date();
      
      // Supprime les entrées de plus de 7 jours
      if (now - cacheDate > 7 * 24 * 60 * 60 * 1000) {
        await cache.delete(request);
        console.log(`🗑️ Supprimé du cache: ${request.url}`);
      }
    }
  }
}
