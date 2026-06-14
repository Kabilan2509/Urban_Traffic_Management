const CACHE_NAME = "traffix-pwa-v1";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/pwa-192.svg",
  "/pwa-512.svg",
  "/pwa-screenshot-wide.svg",
  "/pwa-screenshot-mobile.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return Promise.resolve();
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match("/"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => Response.error());
    })
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data?.type !== "SHOW_NOTIFICATION") return;

  const title = data.title || "Traffix Alert";
  const options = {
    body: data.body || "",
    icon: "/pwa-192.svg",
    badge: "/pwa-192.svg",
    tag: data.tag || "traffix-alert",
    renotify: true,
    requireInteraction: data.requireInteraction ?? true,
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: "Traffix Alert", body: event.data?.text?.() || "" };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || "Traffix Alert", {
      body: payload.body || "",
      icon: "/pwa-192.svg",
      badge: "/pwa-192.svg",
      tag: payload.tag || "traffix-push",
      renotify: true,
      requireInteraction: payload.requireInteraction ?? true,
      data: payload.data || {},
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate?.(targetUrl).catch?.(() => {});
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
