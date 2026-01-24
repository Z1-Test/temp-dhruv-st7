# PWA Example

Progressive Web App with manifest, service worker, caching strategies, and offline support.

> [!IMPORTANT]
> **Baseline Status:** Web App Manifest is marked as "limited" in webstatus.dev, meaning it doesn't have full cross-browser support. However, **manifest files are required for PWA installation** and are used here due to this necessity.

## Files

| File | Purpose |
|------|---------|
| `index.html` | App shell with SW registration |
| `manifest.webmanifest` | Install metadata |
| `sw.js` | Service worker (Cache First + Network First) |
| `offline.html` | Offline fallback page |
| `icon.svg` | Maskable icon |

## Run

Serve from localhost or HTTPS (service workers require secure context):

```bash
npx serve .
```

## Caching Strategies

| Resource Type | Strategy | Reason |
|--------------|----------|--------|
| Static assets (CSS, JS, images) | Cache First | Fast loads, versioned |
| HTML pages | Network First | Fresh content, offline fallback |

## Key Patterns

### Service Worker Registration

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
```

### Offline Fallback (Network First)

```js
if (request.headers.get("Accept")?.includes("text/html")) {
  event.respondWith(
    fetch(request).catch(() => caches.match("./offline.html"))
  );
}
```

### Cache First for Assets

```js
event.respondWith(
  caches.match(request).then((cached) => cached || fetch(request))
);
```
