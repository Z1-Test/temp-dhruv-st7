# Web Performance Best Practices

## What is it?

A comprehensive guide to optimizing web application performance, focusing on the three Core Web Vitals metrics that directly impact user experience and SEO rankings.

## Why optimize performance?

- **User Experience**: Faster pages lead to higher engagement and lower bounce rates
- **SEO Impact**: Core Web Vitals are ranking factors for Google Search
- **Conversion Rate**: A 100ms delay can decrease conversions by 7%
- **Accessibility**: Performance disproportionately affects users on slower devices/networks

---

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor | What It Measures |
|--------|------|-------------------|------|------------------|
| **LCP** | ≤ 2.5s | 2.5s – 4.0s | > 4.0s | Loading performance |
| **INP** | ≤ 200ms | 200ms – 500ms | > 500ms | Interactivity/responsiveness |
| **CLS** | ≤ 0.1 | 0.1 – 0.25 | > 0.25 | Visual stability |

---

## Lighthouse Score Targets

| Category | Minimum | Target |
| --- | --- | --- |
| Performance | 90 | 95+ |
| Accessibility | 95 | 100 |
| Best Practices | 95 | 100 |
| SEO | 95 | 100 |

---

## Automating Lighthouse (Node CLI / Repeatable Audits)

Manual Lighthouse runs are useful for debugging, but automation is required for consistent, enforceable performance targets in CI.

> [!IMPORTANT]
> Lighthouse is **lab data**. Keep results stable by using the same config (device/throttling), auditing the same URLs, and running multiple times when gating.

### Install & Basic Usage

Lighthouse requires Node 22+.

```bash
npm i -g lighthouse
lighthouse https://example.com/
```

### Common CLI Flags

- `--preset=desktop` or `--preset=perf` (ignored if `--config-path` is set)
- `--only-categories=performance,seo,accessibility`
- `--output=html --output=json`
- `--output-path=./reports/lighthouse`
- `--save-assets` (saves trace/devtools logs)
- `--chrome-flags="--headless --no-sandbox --disable-gpu"`

### CI-Friendly Example

```bash
lighthouse https://example.com/ \
  --preset=desktop \
  --only-categories=performance,seo,accessibility \
  --chrome-flags="--headless --no-sandbox --disable-gpu" \
  --output=html --output=json \
  --output-path=./artifacts/lighthouse
```

**Output behavior:**
- If multiple outputs are specified, Lighthouse appends extensions to `--output-path`.
- `--output-path=stdout` prints the report to stdout (useful for piping).

### Config-Based Runs

Use a config file to lock settings (audits, throttling, emulation) across environments.

```bash
lighthouse https://example.com/ --config-path=./lighthouse.config.js
```

### CLI Help (minimal)

**Core usage:**
- `lighthouse <url>`
- `--preset=desktop|perf`
- `--only-categories=performance,seo,accessibility`
- `--output=html|json|csv` + `--output-path=./reports/run`
- `--chrome-flags="--headless --no-sandbox --disable-gpu"`

**Config & audits:**
- `--config-path=./lighthouse.config.js`
- `--only-audits=<list>` / `--skip-audits=<list>`
- `--save-assets` (trace + devtools logs)

**Help:**
- `lighthouse --help` (full list)

> [!TIP]
> For auth/stateful apps, use a deterministic public test route to avoid noisy results.

---

## LCP Optimization (Largest Contentful Paint)

LCP measures how long it takes for the largest visible content element to render.

### Common LCP Elements
- Hero images
- Large text blocks
- Background images
- Video posters

### Identifying the LCP Element

> [!IMPORTANT]
> The LCP element **differs by viewport size**. Always test both mobile and desktop.

**Step-by-step identification:**
1. Open Chrome DevTools > Performance panel
2. Run Lighthouse in **mobile emulation** (LCP often differs on mobile)
3. Check "Largest Contentful Paint element" in the Performance panel
4. Note: The element preloaded may not be the actual LCP

**LCP Optimization Decision Tree:**
```
What is the LCP element?
├── Hero image → preload + fetchpriority="high"
├── Text content → inline critical CSS
├── Product image → DON'T lazy-load first item
└── Video poster → preload poster image
```

**Critical lazy loading rules:**
- **Never** use `loading="lazy"` on potential LCP elements
- Use `loading="eager"` explicitly for critical above-fold images
- Test LCP in both mobile and desktop viewports

```html
<!-- WRONG: Lazy-loading the LCP element hurts performance -->
<img src="hero.jpg" alt="Hero" loading="lazy">

<!-- CORRECT: Eager load with high priority -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high">
```

### Best Practices

#### 1. Optimize the LCP Element

```html
<!-- Use fetchpriority="high" for LCP images -->
<img 
  src="hero.jpg" 
  alt="Hero image"
  width="1920" 
  height="1080"
  fetchpriority="high"
  decoding="async"
>
```

#### 2. Preload Critical Resources

```html
<head>
  <!-- Preload LCP image -->
  <link rel="preload" href="hero.jpg" as="image" fetchpriority="high">
  
  <!-- Preload critical fonts -->
  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- Preconnect to third-party origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://cdn.example.com" crossorigin>
</head>
```

#### 3. Inline Critical CSS

```html
<head>
  <!-- Critical CSS inline -->
  <style>
    :root { --color-bg: #fff; --color-text: #212529; }
    .hero { aspect-ratio: 16/9; background: #e0e0e0; }
  </style>
  
  <!-- Non-critical CSS loaded asynchronously -->
  <link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
</head>
```

#### 4. Server-side Optimization
- Use HTTP/2 or HTTP/3
- Enable Brotli/Gzip compression
- Implement CDN caching
- Use efficient cache headers

---

## CLS Prevention (Cumulative Layout Shift)

CLS measures unexpected layout shifts during page load.

### Common Causes
- Images without dimensions
- Ads/embeds without reserved space
- Web fonts causing FOIT/FOUT
- Dynamic content injected above existing content

### Best Practices

#### 1. Always Set Image Dimensions

```html
<!-- Explicit width and height prevent layout shifts -->
<img 
  src="photo.jpg" 
  alt="Description"
  width="800" 
  height="600"
  loading="lazy"
>

<!-- Or use aspect-ratio in CSS -->
<style>
  .image-container {
    aspect-ratio: 4 / 3;
    background-color: #e0e0e0;
  }
</style>
```

#### 2. Reserve Space for Dynamic Content

```css
/* Reserve space for ads */
.ad-slot {
  min-height: 250px;
  background-color: #f0f0f0;
}

/* Reserve space for embeds */
.embed-container {
  aspect-ratio: 16 / 9;
  contain: layout;
}
```

#### 3. Optimize Font Loading

```css
/* Prevent FOUT with font-display */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: optional; /* Best for CLS - no swap */
}

/* Or use font-display: swap with fallback metrics */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
  /* Match fallback font metrics */
  size-adjust: 100.6%;
  ascent-override: 90%;
  descent-override: 20%;
}
```

#### 4. Use CSS Transforms for Animations

```css
/* GOOD: Transforms don't cause layout shifts */
.animate {
  transition: transform 0.3s, opacity 0.3s;
}
.animate:hover {
  transform: scale(1.05);
}

/* BAD: Changing these properties causes layout shifts */
.animate-bad:hover {
  width: 110%; /* Causes CLS */
  margin: 10px; /* Causes CLS */
}
```

---

## INP Optimization (Interaction to Next Paint)

INP measures responsiveness to user interactions (clicks, taps, keyboard).

### Common Causes of Poor INP
- Long JavaScript tasks (>50ms)
- Main thread blocking
- Heavy event handlers
- Excessive re-renders

### Best Practices

#### 1. Break Up Long Tasks

```javascript
// BAD: Long synchronous task blocks main thread
function processData(items) {
  items.forEach(item => heavyOperation(item));
}

// GOOD: Yield to main thread between chunks
async function processDataChunked(items, chunkSize = 50) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(item => heavyOperation(item));
    
    // Yield to allow user interactions
    await scheduler.yield?.() ?? new Promise(r => setTimeout(r, 0));
  }
}
```

#### 2. Debounce and Throttle Event Handlers

```javascript
// Debounce: Wait until user stops typing
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((query) => {
  performSearch(query);
}, 300);

// Throttle: Limit scroll handler frequency
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
```

#### 3. Use `requestIdleCallback` for Non-Critical Work

```javascript
// Schedule non-critical work during idle time
function loadAnalytics() {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('./analytics.js').then(m => m.init());
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      import('./analytics.js').then(m => m.init());
    }, 100);
  }
}
```

#### 4. Optimize Event Handlers

```javascript
// Use passive listeners for scroll/touch
window.addEventListener('scroll', handler, { passive: true });
window.addEventListener('touchstart', handler, { passive: true });

// Move heavy work off the main thread
button.addEventListener('click', async () => {
  // Show immediate visual feedback
  button.classList.add('loading');
  
  // Defer heavy work
  await scheduler.yield?.();
  await heavyOperation();
  
  button.classList.remove('loading');
});
```

---

## Resource Loading Strategies

### Preload (Load Now, Use Soon)

```html
<!-- Critical resources needed immediately -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero.jpg" as="image">
<link rel="preload" href="app.js" as="script">
```

### Prefetch (Load Later, Use on Next Page)

```html
<!-- Resources for next navigation -->
<link rel="prefetch" href="/next-page.html">
<link rel="prefetch" href="/next-page-styles.css">
```

### Preconnect (Establish Connection Early)

```html
<!-- Third-party origins you'll need soon -->
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://analytics.example.com">
```

---

## Image Optimization

### Responsive Images

```html
<picture>
  <!-- Modern format for supporting browsers -->
  <source 
    srcset="image-400.avif 400w, image-800.avif 800w, image-1200.avif 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
    type="image/avif"
  >
  <source 
    srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
    type="image/webp"
  >
  <!-- Fallback -->
  <img 
    src="image-800.jpg" 
    alt="Description"
    width="800" 
    height="600"
    loading="lazy"
    decoding="async"
  >
</picture>
```

### Lazy Loading

```html
<!-- Native lazy loading for below-fold images -->
<img src="photo.jpg" alt="Description" loading="lazy" width="800" height="600">

<!-- Eager loading for above-fold (LCP) images -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high">
```

---

## JavaScript Optimization

### Defer Non-Critical Scripts

```html
<!-- Critical scripts in head with defer (parallel download, execute after HTML parse) -->
<script src="app.js" defer></script>

<!-- Non-critical scripts at end of body or dynamically loaded -->
<script>
  // Load analytics after page is interactive
  requestIdleCallback(() => {
    const script = document.createElement('script');
    script.src = 'analytics.js';
    document.body.appendChild(script);
  });
</script>
```

### Code Splitting

```javascript
// Dynamic import for route-based code splitting
const routes = {
  '/': () => import('./pages/Home.js'),
  '/about': () => import('./pages/About.js'),
  '/products': () => import('./pages/Products.js'),
};

async function loadPage(path) {
  const loader = routes[path];
  if (loader) {
    const module = await loader();
    module.render();
  }
}
```

---

## CSS Optimization

### Critical CSS Extraction

1. Extract above-the-fold CSS
2. Inline in `<head>`
3. Load remaining CSS asynchronously

```html
<head>
  <style>/* Critical CSS inline */</style>
  <link rel="preload" href="full.css" as="style">
  <link rel="stylesheet" href="full.css" media="print" onload="this.media='all'">
</head>
```

### Content-Visibility for Off-Screen Content

```css
/* Skip rendering of off-screen sections */
.below-fold-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* Estimated height */
}
```

---

## Performance Monitoring

### Measure Core Web Vitals

```javascript
import { onCLS, onINP, onLCP } from 'web-vitals';

function sendToAnalytics({ name, value, id, attribution }) {
  console.log({ name, value: Math.round(value), id });
  // Send to your analytics endpoint
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

### Tools

| Tool | Purpose |
|------|---------|
| Lighthouse | Lab testing, audits |
| PageSpeed Insights | Real-world data + lab data |
| Chrome DevTools Performance | Detailed profiling |
| web-vitals library | In-page measurement |
| Chrome UX Report (CrUX) | Real user data |

---

## Quick Reference Checklist

| Metric | Quick Wins |
|--------|------------|
| **LCP** | Preload LCP image, inline critical CSS, use CDN |
| **CLS** | Set image dimensions, reserve space for dynamic content, use font-display |
| **INP** | Break long tasks, debounce handlers, use passive listeners |
