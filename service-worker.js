const CACHE_NAME = "pixel-player";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWidth(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});