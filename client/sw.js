const OFFLINE = 'offline';
const PRECACHE_URLS = [
	"/",
  '/index.html',
	"/main.bundle.js",
	"/remembrall.png",
  "/vendors~main.bundle.js",
  "/main.css",
];

self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open(OFFLINE)
		.then(cache => cache.addAll(PRECACHE_URLS))
		.then(self.skipWaiting())
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});
