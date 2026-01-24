# Progressive Web App (PWA) Best Practices

## What is it?

A Progressive Web App (PWA) is a web application that uses modern web capabilities to deliver app-like experiences. PWAs are installable, work offline, and can receive push notifications.

## Why build a PWA?

- **Installable**: Users can add to home screen without app store
- **Offline Support**: Works without network connection
- **Native Feel**: Less browser UI, app-like experience
- **Push Notifications**: Re-engage users (optional)
- **Cost Effective**: Single codebase for web and "app"

---

## Core PWA Requirements

| Requirement | Description | How to Check |
|-------------|-------------|--------------|
| HTTPS | Served over secure connection | Browser address bar |
| Manifest | Web app manifest file | Lighthouse PWA audit |
| Service Worker | Registered and functional | Chrome DevTools > Application |
| Icons | 192x192 and 512x512 PNG | Manifest configuration |
| Responsive | Works on all screen sizes | Responsive design testing |

### Favicon Requirements

> [!TIP]
> Use SVG for favicons as they are supported across all modern browsers.

```html
<head>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
```

**Required favicon files:**
- `favicon.svg`: The primary vector icon.

### Icon Format Requirements

> [!IMPORTANT]
> Manifest icons **must** be PNG or WebP format. SVG is **not** universally supported for PWA icons.

| Icon Type | Format | Sizes |
|-----------|--------|-------|
| Manifest icons | PNG or WebP | 192x192, 512x512 (required) |
| Maskable icons | PNG | 512x512 (recommended) |
| Apple touch icon | PNG | 180x180 |
| Favicon | SVG | any (SVG) |

---

## Web App Manifest

The manifest tells the browser how your app should behave when installed.

### Complete Manifest Example

```json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A full-featured Progressive Web App",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a73e8",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "New Task",
      "short_name": "New",
      "url": "/new",
      "icons": [{"src": "/icons/new-192.png", "sizes": "192x192"}]
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

### Manifest Properties Reference

| Property | Required | Description |
|----------|----------|-------------|
| `name` | Yes | Full app name (install prompt, launcher) |
| `short_name` | Yes | Displayed on home screen |
| `start_url` | Yes | URL opened when app launches |
| `display` | Yes | `standalone`, `fullscreen`, `minimal-ui`, `browser` |
| `icons` | Yes | 192x192 and 512x512 required |
| `theme_color` | Recommended | Status bar, title bar color |
| `background_color` | Recommended | Splash screen background |
| `description` | Optional | App description |
| `scope` | Optional | Navigation scope |
| `shortcuts` | Optional | Quick actions from icon |
| `screenshots` | Optional | Install dialog previews |

### Connecting the Manifest

```html
<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1a73e8">
  
  <!-- iOS Safari support -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="MyPWA">
  <link rel="apple-touch-icon" href="/icons/icon-192.png">
</head>
```

---

## Service Worker

The service worker enables offline functionality and caching.

### Registration

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('SW registered:', registration.scope);
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  });
}
```

### Service Worker Lifecycle

```javascript
// sw.js

const CACHE_NAME = 'my-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html'
];

// INSTALL: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH: Respond to network requests
self.addEventListener('fetch', (event) => {
  // Strategy implementation
});
```

---

## Caching Strategies

### Cache First (Static Assets)

Best for versioned assets that rarely change.

```javascript
self.addEventListener('fetch', (event) => {
  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetchAndCache(event.request))
    );
  }
});

function fetchAndCache(request) {
  return fetch(request).then(response => {
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
    }
    return response;
  });
}
```

### Network First (Fresh Content)

Best for HTML and API data that should be fresh.

```javascript
self.addEventListener('fetch', (event) => {
  if (isHTMLRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request) || caches.match('/offline.html'))
    );
  }
});
```

### Stale-While-Revalidate

Best for content that should be fast but updated in background.

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      
      // Return cached immediately, update in background
      return cachedResponse || fetchPromise;
    })
  );
});
```

### Strategy Selection Guide

| Resource Type | Strategy | Reason |
|---------------|----------|--------|
| CSS, JS (versioned) | Cache First | Immutable with hash |
| HTML pages | Network First | Always fresh |
| API responses | Stale-While-Revalidate | Balance fresh/fast |
| User data | Network Only | Must be current |
| Images | Cache First | Rarely changes |

---

## Offline Support

### Offline Page

```html
<!-- offline.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're Offline</title>
</head>
<body>
  <h1>You're Offline</h1>
  <p>Please check your internet connection.</p>
  <button onclick="location.reload()">Retry</button>
</body>
</html>
```

### Fallback for Navigation

```javascript
// In service worker fetch handler
.catch(() => {
  if (request.mode === 'navigate') {
    return caches.match('/offline.html');
  }
  // Or return a fallback image for images
  if (request.destination === 'image') {
    return caches.match('/offline-image.svg');
  }
});
```

---

## Install Prompt

### Custom Install Button

```javascript
let deferredPrompt = null;
const installBtn = document.getElementById('install-btn');

// Capture the install prompt
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false; // Show custom button
});

// Handle install button click
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('Install:', outcome);
  
  deferredPrompt = null;
  installBtn.hidden = true;
});

// Detect successful installation
window.addEventListener('appinstalled', () => {
  installBtn.hidden = true;
  console.log('App installed');
});
```

### Best Practices for Install Prompts

| Do | Don't |
|----|-------|
| Show after user engagement | Show immediately on load |
| Explain the benefits | Auto-trigger the prompt |
| Use contextual timing | Be too aggressive |
| Provide dismiss option | Block content |

---

## Push Notifications

### Request Permission

```javascript
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}
```

### Subscribe to Push

```javascript
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  
  // Send subscription to your server
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Handle Push in Service Worker

```javascript
// sw.js
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
```

---

## Background Sync

### Register Sync

```javascript
async function saveForLater(data) {
  // Save to IndexedDB
  await saveToQueue(data);
  
  // Register sync
  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register('sync-queue');
}
```

### Handle Sync in Service Worker

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-queue') {
    event.waitUntil(processQueue());
  }
});

async function processQueue() {
  const items = await getQueueFromIndexedDB();
  
  for (const item of items) {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(item)
      });
      await removeFromQueue(item.id);
    } catch (error) {
      // Will retry on next sync
      break;
    }
  }
}
```

---

## PWA Checklist

### Required

- [ ] Served over HTTPS
- [ ] Valid web app manifest
- [ ] Registered service worker
- [ ] Icons: 192x192 and 512x512 PNG
- [ ] Responsive design

### Recommended

- [ ] Offline fallback page
- [ ] Maskable icon for Android
- [ ] Theme color matches brand
- [ ] App shortcuts configured
- [ ] Focus on user engagement before install prompt

### Optional Enhancements

- [ ] Push notifications
- [ ] Background sync
- [ ] Periodic background sync
- [ ] Share target
- [ ] File handling

---

## Testing PWA

### Chrome DevTools

1. Open DevTools > Application
2. Check Manifest section
3. Check Service Workers section
4. Test offline in Network tab

### Lighthouse PWA Audit

```bash
npx lighthouse https://example.com --only-categories=pwa --view
```

### Manual Testing

- [ ] Install on Android/Chrome
- [ ] Install on iOS (Add to Home Screen)
- [ ] Test offline behavior
- [ ] Verify splash screen
- [ ] Check app shortcuts

---

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Not installable | Missing manifest/SW | Check Lighthouse PWA audit |
| Offline not working | Cache not populated | Check install event |
| Old cache served | SW not updated | Increment cache version |
| iOS issues | Safari limitations | Add apple-* meta tags |
| Icons wrong size | Missing sizes | Add 192x192 and 512x512 |
