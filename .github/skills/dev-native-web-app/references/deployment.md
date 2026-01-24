# Deployment Best Practices

## What is it?

A guide to deploying web applications with optimal performance, security, and reliability.

## Why follow deployment best practices?

- **Performance**: CDN and caching reduce latency globally
- **Security**: HTTPS and secure headers protect users
- **Reliability**: Proper monitoring catches issues early
- **Cost Efficiency**: Caching reduces origin requests

---

## CDN Configuration

### Benefits of Using a CDN

| Benefit | Impact |
|---------|--------|
| Edge caching | Reduced latency worldwide |
| Automatic SSL | Free, managed certificates |
| DDoS protection | Absorbs attack traffic |
| Compression | Automatic Brotli/Gzip |
| HTTP/2 & HTTP/3 | Faster connections |

### Popular CDN Platforms

| Platform | Strengths | Best For |
|----------|-----------|----------|
| Vercel | Zero-config, Next.js native | React/Next.js apps |
| Cloudflare Pages | Fast, generous free tier | Static sites, performance |
| Netlify | Git integration, serverless | JAMstack, static sites |
| AWS CloudFront | Customizable, global | Enterprise, custom needs |

### Basic CDN Setup Checklist

- [ ] Point domain DNS to CDN
- [ ] Enable HTTPS/SSL
- [ ] Configure cache rules
- [ ] Enable compression
- [ ] Set up custom error pages

---

## Caching Strategy

### Cache-Control Headers

| Directive | Use Case | Example |
|-----------|----------|---------|
| `public, max-age=31536000, immutable` | Versioned static assets (JS, CSS with hash) | `main.a1b2c3.js` |
| `public, max-age=86400` | Non-versioned static assets | `logo.png` |
| `no-cache` | HTML pages (always revalidate) | `index.html` |
| `no-store` | Sensitive/personalized content | `/api/user/profile` |
| `private, max-age=3600` | User-specific, cacheable | `/api/cart` |

### Header Configuration Examples

#### Static Assets (Hashed Filenames)

```
# Assets with content hash: cache forever
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

#### HTML Pages

```
# HTML: always revalidate
/*.html
  Cache-Control: no-cache

# Or with stale-while-revalidate for faster loads
/*.html
  Cache-Control: public, max-age=0, s-maxage=3600, stale-while-revalidate=86400
```

#### API Responses

```
# Dynamic API: no caching
/api/*
  Cache-Control: no-store

# Semi-static API: short cache
/api/products
  Cache-Control: public, max-age=300, stale-while-revalidate=3600
```

### Versioning Strategy

```
# BAD: Same filename, different content
/scripts/app.js    ← Can't cache long-term

# GOOD: Content hash in filename
/scripts/app.a1b2c3d4.js   ← Cache forever, new content = new hash
```

Build tools (Vite, webpack) generate hashed filenames automatically.

---

## Compression

### Enable Server Compression

Most CDNs and servers support automatic compression:

| Format | Browser Support | Compression Ratio |
|--------|-----------------|-------------------|
| Brotli | All modern | Best (15-25% smaller) |
| Gzip | Universal | Good |

### Verify Compression

```bash
# Check if Brotli is enabled
curl -H "Accept-Encoding: br" -I https://example.com

# Response should include:
# content-encoding: br
```

### Pre-Compress Static Assets

```bash
# Brotli pre-compression at build time
find dist -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) \
  -exec brotli -q 11 {} \;

# Gzip fallback
find dist -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) \
  -exec gzip -k -9 {} \;
```

---

## HTTPS Configuration

### SSL/TLS Checklist

- [ ] Valid certificate (not expired)
- [ ] Auto-renewing (Let's Encrypt, CDN-managed)
- [ ] TLS 1.2+ only (disable older protocols)
- [ ] Strong cipher suites
- [ ] HSTS header enabled

### HSTS Configuration

```
# Production HSTS
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### HTTP to HTTPS Redirect

```
# Nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

# Apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## HTTP/2 and HTTP/3

### Benefits

| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---------|----------|--------|--------|
| Multiplexing | ❌ | ✅ | ✅ |
| Header compression | ❌ | ✅ | ✅ |
| Connection setup | Slow | Medium | Fast (QUIC) |
| Head-of-line blocking | Yes | Partial | No |

### Enable HTTP/2 (Nginx)

```nginx
server {
    listen 443 ssl http2;
    # ...
}
```

### Best Practices for HTTP/2+

- **Stop concatenating files**: Multiplexing makes bundling less important
- **Use granular caching**: Ship smaller modules, cache individually
- **Avoid domain sharding**: Single connection is more efficient
- **Use preload/push wisely**: Server Push for critical resources

---

## Performance Monitoring

### Real User Monitoring (RUM)

```javascript
// Send Core Web Vitals to analytics
import { onLCP, onINP, onCLS } from 'web-vitals';

function sendToAnalytics({ name, value, id, attribution }) {
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({
      metric: name,
      value: Math.round(value),
      id: id,
      url: window.location.href,
      // attribution provides debugging info
      element: attribution?.element,
    }),
    keepalive: true,
  });
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

### Monitoring Services

| Service | Type | Best For |
|---------|------|----------|
| PageSpeed Insights | Synthetic | Quick checks |
| Chrome UX Report (CrUX) | Real user | Production metrics |
| Sentry | Error tracking | Bug detection |
| LogRocket | Session replay | UX debugging |
| Datadog RUM | Full observability | Enterprise |

### Alerting Thresholds

| Metric | Warning | Critical |
|--------|---------|----------|
| LCP | > 2.5s | > 4.0s |
| INP | > 200ms | > 500ms |
| CLS | > 0.1 | > 0.25 |
| Error rate | > 1% | > 5% |

---

## Error Monitoring

### Client-Side Error Tracking

```javascript
// Global error handler
window.addEventListener('error', (event) => {
  sendError({
    type: 'uncaught',
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
    stack: event.error?.stack,
  });
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  sendError({
    type: 'unhandledrejection',
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
  });
});
```

### Error Reporting Best Practices

- Include user session ID for correlation
- Capture breadcrumbs (recent user actions)
- Group similar errors to reduce noise
- Set up alerts for new error types
- Redact sensitive data (passwords, tokens)

---

## Pre-Deploy Checklist

### Before Every Deploy

- [ ] Build succeeds without errors
- [ ] All tests passing
- [ ] Lighthouse audit scores meet thresholds
- [ ] No console errors on critical pages
- [ ] Environment variables configured

### Production Readiness

- [ ] **Performance**
  - [ ] LCP < 2.5s
  - [ ] INP < 200ms
  - [ ] CLS < 0.1
  - [ ] JavaScript bundle optimized

- [ ] **SEO**
  - [ ] Unique titles and meta descriptions
  - [ ] Structured data validated
  - [ ] sitemap.xml submitted
  - [ ] robots.txt configured

- [ ] **Security**
  - [ ] HTTPS enforced
  - [ ] Security headers configured
  - [ ] No exposed secrets
  - [ ] CSP in place

- [ ] **Accessibility**
  - [ ] Lighthouse accessibility ≥ 90
  - [ ] axe-core audit passing
  - [ ] Keyboard navigation working

- [ ] **PWA** (if applicable)
  - [ ] Manifest configured
  - [ ] Service worker registered
  - [ ] Offline page working
  - [ ] Icons all sizes present

---

## Rollback Strategy

### Instant Rollback

```bash
# Vercel: Revert to previous deployment
vercel rollback [deployment-url]

# Netlify: Publish previous deploy
netlify deploy --prod --dir=previous-build
```

### Feature Flags

```javascript
// Control features without deploy
const features = {
  newCheckout: false,  // Disabled: rollback without deploy
  darkMode: true,
};

if (features.newCheckout) {
  renderNewCheckout();
} else {
  renderLegacyCheckout();
}
```

---

## Environment Configuration

### Environment Variables Best Practices

| Variable | Dev | Staging | Production |
|----------|-----|---------|------------|
| `NODE_ENV` | development | production | production |
| `API_URL` | localhost:3001 | staging.api.com | api.com |
| `DEBUG` | true | false | false |
| Secrets | .env (gitignored) | CI/CD secrets | CI/CD secrets |

### Never Commit

```gitignore
# .gitignore
.env
.env.local
.env.*.local
*.pem
```

---

## Quick Reference

| Task | Command/Config |
|------|----------------|
| Check headers | `curl -I https://example.com` |
| Test compression | `curl -H "Accept-Encoding: br" -I https://example.com` |
| SSL check | `openssl s_client -connect example.com:443` |
| Performance audit | `npx lighthouse https://example.com --view` |
| Security scan | `https://observatory.mozilla.org` |
