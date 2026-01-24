---
name: dev-native-web-app
description: Build production-ready web applications with PWA capabilities, SEO optimization, WCAG accessibility, internationalization, and performance tuning. Trigger when implementing service workers, meta tags, ARIA, i18n, Core Web Vitals, or preparing apps for global deployment.
metadata:
  category: development
---

# Native Web App Skill

## What is it?

A comprehensive skill for building production-ready web applications that excel in quality, performance, usability, scalability, and global readiness. This skill covers holistic application-level concerns beyond component development.

## Why use it?

- **Holistic quality**: Covers all facets of web app excellence in one place
- **Progressive enhancement**: PWA-first architecture with offline capability
- **Global reach**: SEO visibility + i18n for worldwide users
- **Inclusive design**: WCAG 2.2 AA compliance out of the box
- **Performance culture**: Core Web Vitals optimization built-in
- **Security mindset**: HTTPS, CSP, and secure defaults

---

## How to use it?

### Workflow (Quality-First)

1. **Start with SEO foundation**: Semantic HTML, meta tags, structured data
2. **Add accessibility**: ARIA where needed, keyboard navigation, focus management
3. **Enable i18n**: `lang` attributes, logical CSS properties, hreflang
4. **Optimize performance**: Core Web Vitals, lazy loading, resource hints
5. **Add PWA capabilities**: Manifest, service worker, offline support
6. **Harden security**: HTTPS, CSP headers, secure cookies
7. **Test thoroughly**: Cross-browser, accessibility, performance testing
8. **Deploy with best practices**: CDN, cache headers, monitoring

---

## Core Domains

### 1. Progressive Web Apps (PWA)

Enable installable, offline-capable, native-like web experiences.

**Key components:**
- Web App Manifest (`manifest.json`)
- Service Worker registration and lifecycle
- Caching strategies (Cache First, Network First, Stale-While-Revalidate)
- Offline fallback pages
- App installation prompts

**If using stayfront/pwa:**
- `generateServiceWorker(config)` to scaffold SW
- `registerServiceWorker(url, opts)` on app init
- `createLocalStore(name, store)` for IndexedDB-backed storage
- `hydrateElement(el)` to rehydrate DSD content

**Reference:** [pwa.md](references/pwa.md)

---

### 2. Search Engine Optimization (SEO)

Ensure discoverability and rich search presence.

**Key components:**
- Technical SEO (meta tags, canonical URLs, robots.txt, sitemaps)
- Structured data (JSON-LD, Schema.org)
- Social meta (Open Graph, Twitter Cards)
- Core Web Vitals impact on ranking
- Mobile-first indexing compliance
- URL structure: stable, human-readable, no session IDs
- E-E-A-T signals: author attribution, sources, updated dates

**Reference:** [seo.md](references/seo.md)

---

### 3. Web Accessibility (WCAG 2.2)

Build inclusive experiences for all users.

**Key components:**
- Semantic HTML foundation
- ARIA patterns for custom components
- Keyboard navigation and focus management
- Color contrast and motion preferences
- Screen reader compatibility
- Form accessibility patterns

**Target level:** WCAG 2.2 AA minimum; AA+ preferred when feasible.

**Reference:** [accessibility.md](references/accessibility.md)

---

### 4. Internationalization (i18n)

Support global audiences with localized experiences.

**Key components:**
- Language attributes (`lang`, `hreflang`)
- RTL layout with CSS logical properties
- Intl API for formatting (dates, numbers, plurals)
- Content localization strategies
- Unicode and character encoding
- Locale detection and fallback strategy
- 40% text expansion tolerance in layouts
- Multi-script font stack planning

**Reference:** [i18n.md](references/i18n.md)

---

## Extended Domains

### 5. Web Performance

Optimize for speed and Core Web Vitals.

**Key components:**
- LCP, INP, CLS optimization
- Resource loading (preload, prefetch, preconnect)
- Image optimization (responsive, modern formats)
- JavaScript/CSS optimization
- Lazy loading patterns

**Budgets & targets:**
- Lighthouse: Performance >= 90, Accessibility >= 95, SEO >= 95
- JS < 170KB gzipped on initial route
- CSS < 50KB gzipped on initial route
- Images: AVIF/WebP where supported

**Reference:** [performance.md](references/performance.md)

---

### 6. Security

Protect users and data with secure defaults.

**Key components:**
- HTTPS everywhere
- Content Security Policy (CSP)
- CORS configuration
- XSS and CSRF prevention
- Secure headers

**CSP guidance:** Prefer nonce-based policies. Avoid `unsafe-inline` and `unsafe-eval` by default; allow only with explicit documented exceptions.

**Reference:** [security.md](references/security.md)

---

### 7. Testing Strategies

Ensure quality through comprehensive testing.

**Primary reference:** Use the [playwright-testing](../playwright-testing/SKILL.md) skill for E2E testing.

**Additional testing:**
- Accessibility testing (axe-core, Lighthouse)
- Visual regression testing
- Performance testing
- Cross-browser testing

**Reference:** [testing.md](references/testing.md)

---

### 8. Deployment Best Practices

Deliver apps efficiently and reliably.

**Key components:**
- CDN configuration basics
- Cache headers and invalidation
- HTTPS and secure delivery
- Performance monitoring setup

**Reference:** [deployment.md](references/deployment.md)

---

## Checklists

### PWA Readiness Checklist

- [ ] Served over HTTPS (Required)
- [ ] Valid Web App Manifest (Required)
- [ ] Registered Service Worker (Required)
- [ ] Icons: 192x192 and 512x512 (Required)
- [ ] `favicon.ico` present at root (Required)
- [ ] All manifest icon URLs return 200 (Required)
- [ ] Responsive design (Required)
- [ ] Offline fallback page (Recommended)
- [ ] Maskable icons (Recommended)
- [ ] App shortcuts configured (Optional)
- [ ] Push notifications (Optional)

---

### SEO Technical Checklist

- [ ] Unique `<title>` per page (50-60 chars) — High
- [ ] Meta description (120-158 chars) — High
- [ ] Single `<h1>` per page — High (WCAG 1.3.1)
- [ ] Canonical URL set — High
- [ ] robots.txt configured — High
- [ ] XML sitemap submitted — High
- [ ] Structured data (JSON-LD) — Medium
- [ ] Open Graph meta tags — Medium
- [ ] Twitter Card meta tags — Medium
- [ ] `hreflang` for multi-language — Medium
- [ ] Image alt text — High (WCAG 1.1.1)
- [ ] Mobile-friendly viewport — High

---

### WCAG 2.2 Audit Checklist

- [ ] All images have `alt` text (1.1.1, Level A)
- [ ] Color not sole means of info (1.4.1, Level A)
- [ ] Contrast ratio >= 4.5:1 for text (1.4.3, Level AA)
- [ ] Text resizable to 200% (1.4.4, Level AA)
- [ ] All functionality via keyboard (2.1.1, Level A)
- [ ] No keyboard traps (2.1.2, Level A)
- [ ] Headings follow sequential order (H1→H2→H3) (2.4.6, Level AA)
- [ ] Focus order logical (2.4.3, Level A)
- [ ] Link purpose clear (2.4.4, Level A)
- [ ] `:focus-visible` styles (2.4.7, Level AA)
- [ ] Page language set (`lang`) (3.1.1, Level A)
- [ ] Error identification (3.3.1, Level A)
- [ ] Labels for inputs (3.3.2, Level A)
- [ ] Consistent navigation (3.2.3, Level AA)
- [ ] Valid HTML, no duplicate IDs (4.1.1, Level A)
- [ ] Name, role, value exposed (4.1.2, Level A)

---

### i18n Implementation Checklist

- [ ] `<html lang="xx">` set (HTML, Required)
- [ ] `<html dir="rtl">` for RTL (HTML, Required)
- [ ] `hreflang` links for alternates (HTML, Required)
- [ ] UTF-8 charset declared (HTML, Required)
- [ ] CSS logical properties used (CSS, High)
- [ ] No hardcoded text in JS (JS, High)
- [ ] Intl API for dates/numbers (JS, High)
- [ ] `translate="no"` for code (HTML, Medium)
- [ ] `:lang()` selectors for styling (CSS, Medium)
- [ ] RTL-aware icons and images (CSS, Medium)
- [ ] Layouts tolerate 40% text expansion (CSS, Medium)
- [ ] Locale detection + fallback implemented (JS, Medium)
- [ ] Multi-script font stack defined (CSS, Medium)

---

### Core Web Vitals Checklist

- [ ] **LCP** (Largest Contentful Paint) < 2.5s
- [ ] **INP** (Interaction to Next Paint) < 200ms
- [ ] **CLS** (Cumulative Layout Shift) < 0.1
- [ ] Preload critical resources
- [ ] Lazy load below-fold images
- [ ] Use `fetchpriority="high"` for LCP
- [ ] Minimize CLS from web fonts
- [ ] Avoid layout shifts from ads
- [ ] Optimize JavaScript execution
- [ ] Stay within JS/CSS payload budgets

---

### Security Hardening Checklist

- [ ] HTTPS enforced (Critical)
- [ ] HSTS header set (Critical)
- [ ] CSP header configured (High)
- [ ] X-Content-Type-Options: nosniff (Medium)
- [ ] X-Frame-Options: DENY (Medium)
- [ ] Referrer-Policy set (Medium)
- [ ] No inline scripts (CSP) unless nonce-based (High)
- [ ] CORS properly configured (High)
- [ ] Secure cookie flags (High)
- [ ] No sensitive data in URLs (Critical)

---

### Testing Coverage Checklist

- [ ] E2E functional tests (Playwright)
- [ ] Accessibility audit (axe-core / Lighthouse)
- [ ] Visual regression (Playwright snapshots)
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser testing (Playwright, 3 browsers)
- [ ] Mobile device testing (DevTools / Real devices)
- [ ] SEO audit (Lighthouse)
- [ ] PWA audit (Lighthouse)

---

### Deployment Best Practices Checklist

- [ ] CDN configured (Delivery)
- [ ] Cache-Control headers set (Caching)
- [ ] Immutable assets versioned (Caching)
- [ ] Gzip/Brotli compression (Delivery)
- [ ] HTTP/2 or HTTP/3 enabled (Delivery)
- [ ] Error monitoring configured (Monitoring)
- [ ] Performance monitoring (Monitoring)
- [ ] SSL certificate valid (Security)

---

## Decision Trees

### When to use which overlay?

```
Need to show content?
├── Is it blocking/modal? → Use <dialog>
├── Is it non-blocking? → Use popover
└── Is it inline disclosure? → Use <details>
```

### Caching strategy selection?

```
What type of resource?
├── Static assets (CSS/JS/images) → Cache First
├── API responses → Network First or Stale-While-Revalidate
├── HTML pages → Network First with offline fallback
└── User-specific data → Network Only
```

### SSR vs CSR vs SSG?

> [!NOTE]
> Architecture patterns will be added in a future update.

---

## Supporting References

| Reference | Description |
|-----------|-------------|
| [pwa.md](references/pwa.md) | PWA manifest, service workers, caching |
| [seo.md](references/seo.md) | Technical SEO, structured data, meta tags |
| [accessibility.md](references/accessibility.md) | WCAG 2.2, ARIA, focus management |
| [i18n.md](references/i18n.md) | hreflang, Intl API, RTL, logical properties |
| [performance.md](references/performance.md) | Core Web Vitals, loading strategies |
| [security.md](references/security.md) | CSP, HTTPS, secure headers |
| [testing.md](references/testing.md) | Testing strategies and tools |
| [deployment.md](references/deployment.md) | CDN, caching, monitoring |
| [css.md](references/css.md) | Token-based styling, container queries |
| [html.md](references/html.md) | Semantic HTML, ARIA patterns, structured data |

## Cross-References

| Skill | Purpose |
|-------|---------|
| [dev-native-web-components](../dev-native-web-components/SKILL.md) | Component-level patterns with DSD |
| [playwright-testing](../playwright-testing/SKILL.md) | E2E testing workflows |
| [dev-frontend](../dev-frontend/SKILL.md) | staystack-ts framework-specific guidance |

### When Using with dev-native-web-components

> [!TIP]
> Combine app-level quality (this skill) with component-level patterns for best results.

- **Heading hierarchy**: Manage in light DOM, not shadow DOM
- **DSD template size**: Consider build-time generation for repeated components
- **Combined testing**: Run Lighthouse on pages with both skills applied
- **Accessibility**: Both skills share WCAG patterns — use consistently

---

## Limitations

- Architecture patterns (SSR, SSG, Islands) will be added later
- Framework-specific patterns (React, Vue, Angular) not covered
- Backend/API development not covered
- Design system/token management covered in separate skill
