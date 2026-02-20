const CACHE_NAME = 'dignity-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'assets/images/logo.png',
  'assets/images/favicon.png',
  'assets/images/qr-code.png',
  'assets/images/members/member1.jpg',
  'assets/images/members/member2.jpg',
  'assets/images/members/member3.jpg',
  'assets/images/members/member4.jpg',
  'assets/images/members/member5.jpg',
  'assets/images/members/member6.jpg',
  'assets/images/members/member7.jpg',
  'assets/images/members/member8.jpg',
  'assets/images/members/member9.jpg',
  'assets/images/members/member10.jpg',
  'assets/images/members/member11.jpg',
  'assets/images/members/member12.jpg',
  'assets/images/members/member13.jpg',
  'assets/images/members/member14.jpg',
  'assets/images/members/member15.jpg',
  'assets/images/contributors/contributor1.jpg',
  'assets/images/contributors/contributor2.jpg',
  'assets/images/contributors/contributor3.jpg',
  'assets/images/contributors/contributor4.jpg',
  'assets/images/contributors/contributor5.jpg',
  'assets/images/contributors/ashraf_azmi.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-brands-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-regular-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-solid-900.woff2'
];

// Install service worker and cache all resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch resources from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // Don't cache external URLs like WhatsApp, Instagram, etc.
              if (!event.request.url.match(/^(https?:\/\/)?(wa\.me|www\.instagram\.com)/i)) {
                cache.put(event.request, responseToCache);
              }
            });
          
          return response;
        });
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});