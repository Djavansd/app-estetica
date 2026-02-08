// service-worker.js

const CACHE_NAME = "app-estetica-v4"; // 🔴 MUDE SEMPRE QUE ALTERAR CÓDIGO

// ⚠️ Cache APENAS arquivos estáticos
const FILES_TO_CACHE = [
  

  "./css/base.css",
  "./css/components.css",
  "./css/layout.css",

  "./manifest.json",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

// ========================
// INSTALL
// ========================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ========================
// ACTIVATE
// ========================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );

  self.clients.claim();
});

// ========================
// FETCH
// ========================
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // 🔐 Painel e Firebase SEM CACHE
  if (
    url.includes("painel.html") ||
    url.includes("login.html") ||
    url.includes("planos.html") ||
    url.includes("/js/") ||            // 🔥 JS sempre da rede
    url.includes("firebase") ||
    url.includes("firestore")
  ) {
    return;
  }

  // 🌐 HTML / CSS / ICONS → cache com fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
