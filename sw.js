importScripts("https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet-controller@0.0.9/dist/controller.sw.js");

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

addEventListener("fetch", (e) => {
    if ($scramjetController.shouldRoute(e)) {
        e.respondWith($scramjetController.route(e));
    }
});
