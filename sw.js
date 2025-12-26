const CACHE = 'billiard-cash-v1';

const FILES = [
  './',
  './index.html',
  './game.html',
  './result.html',
  './manifest.json',

  './assets/css/main.css',
  './assets/js/data.js',
  './assets/js/game.js',
  './assets/js/result.js',

  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
