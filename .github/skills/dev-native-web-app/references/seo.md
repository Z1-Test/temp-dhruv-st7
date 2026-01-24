# SEO Best Practices

## What is it?

Search Engine Optimization (SEO) ensures your web application is discoverable, indexable, and ranks well in search engine results.

## Why prioritize SEO?

- **Discoverability**: Users find your content through search
- **Organic Traffic**: Free, high-intent visitors
- **Credibility**: Higher rankings signal authority
- **User Experience**: SEO best practices align with good UX
- **Core Web Vitals**: Performance is now a ranking factor

---

## Technical SEO Fundamentals

### Essential Meta Tags

```html
<head>
  <!-- Character encoding (must be first) -->
  <meta charset="UTF-8">
  
  <!-- Viewport for mobile -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Title: 50-60 characters, unique per page -->
  <title>Primary Keyword - Secondary Keyword | Brand Name</title>
  
  <!-- Meta description: 120-158 characters -->
  <meta name="description" content="Compelling description that includes keywords and encourages clicks. Should accurately summarize page content.">
  
  <!-- Canonical URL (prevents duplicate content) -->
  <link rel="canonical" href="https://example.com/page/">
  
  <!-- Robots directive -->
  <meta name="robots" content="index, follow">
</head>
```

### Title Tag Best Practices

| Guideline | Reason |
|-----------|--------|
| 50-60 characters | Truncated in search results beyond this |
| Unique per page | Helps search engines differentiate |
| Primary keyword first | Weighted more heavily |
| Brand at end | User recognition without wasting space |
| Compelling copy | Improves click-through rate |

### Meta Description Best Practices

| Guideline | Reason |
|-----------|--------|
| 120-158 characters | Truncated beyond this on mobile/desktop |
| Include target keywords | Bolded in search results |
| Clear value proposition | Increases CTR |
| Unique per page | Avoid duplicate content signals |
| Call to action | "Learn more", "Discover", etc. |

---

## Semantic HTML Structure

### Heading Hierarchy

```html
<!-- Single H1 per page -->
<h1>Main Page Title (Primary Keyword)</h1>

<section>
  <h2>Major Section Heading</h2>
  <p>Section content...</p>
  
  <h3>Subsection Heading</h3>
  <p>Subsection content...</p>
</section>

<section>
  <h2>Another Major Section</h2>
  <!-- Don't skip heading levels (h2 → h4) -->
</section>
```

### Semantic Landmark Elements

```html
<body>
  <header>
    <nav aria-label="Main navigation">...</nav>
  </header>
  
  <main>
    <article>
      <h1>Article Title</h1>
      <p>Content...</p>
    </article>
    
    <aside>
      <h2>Related Content</h2>
    </aside>
  </main>
  
  <footer>
    <nav aria-label="Footer navigation">...</nav>
  </footer>
</body>
```

---

## Structured Data (JSON-LD)

Structured data helps search engines understand your content and enables rich results.

### Article Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Brief article summary",
  "image": "https://example.com/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-20"
}
</script>
```

### Product Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": ["https://example.com/product.jpg"],
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/product",
    "priceCurrency": "USD",
    "price": "29.99",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "42"
  }
}
</script>
```

### Breadcrumb Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://example.com/products/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Widget",
      "item": "https://example.com/products/widget/"
    }
  ]
}
</script>
```

### Organization Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service"
  }
}
</script>
```

---

## Open Graph & Social Meta

### Open Graph (Facebook, LinkedIn)

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/page/">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description for social sharing">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Description of image">
<meta property="og:site_name" content="Site Name">
<meta property="og:locale" content="en_US">
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@username">
<meta name="twitter:creator" content="@author">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">
<meta name="twitter:image:alt" content="Description of image">
```

### Image Requirements

| Platform | Size | Ratio |
|----------|------|-------|
| Open Graph | 1200×630 | 1.91:1 |
| Twitter Large | 1200×628 | 1.91:1 |
| Twitter Summary | 144×144 | 1:1 |

---

## URLs and Site Structure

### URL Best Practices

```
# GOOD: Clean, readable, keyword-rich
https://example.com/products/blue-widget/

# BAD: Query strings, IDs, cryptic
https://example.com/p.php?id=123&cat=45
```

| Guideline | Example |
|-----------|---------|
| Use hyphens, not underscores | `blue-widget` not `blue_widget` |
| Lowercase only | `/Products/` → `/products/` |
| Trailing slash consistency | Pick one and redirect |
| Short and descriptive | `/blog/seo-tips/` not `/blog/2025/01/15/10-seo-tips-for-beginners/` |

### URL Structure Constraints

| ❌ Forbidden | ✅ Required |
| --- | --- |
| `/page?id=123&cat=foo` | `/products/category/product-name` |
| `/Products/Categories` | All lowercase |
| Underscores: `product_name` | Hyphens: `product-name` |
| 4+ subdirectory levels | Max 3 levels deep |

### Canonical URLs

```html
<!-- Self-referencing canonical on every page -->
<link rel="canonical" href="https://example.com/products/widget/">

<!-- For paginated content -->
<link rel="canonical" href="https://example.com/products/">
```

### Pagination

```html
<!-- On page 2 of paginated results -->
<link rel="canonical" href="https://example.com/products/?page=2">

<!-- Alternative: Link to view-all page -->
<link rel="canonical" href="https://example.com/products/all/">
```

---

## Robots and Indexing

### robots.txt

```
# /robots.txt

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml
```

### Meta Robots

```html
<!-- Allow indexing (default) -->
<meta name="robots" content="index, follow">

<!-- Prevent indexing -->
<meta name="robots" content="noindex, nofollow">

<!-- Index but don't follow links -->
<meta name="robots" content="index, nofollow">

<!-- No snippet in search results -->
<meta name="robots" content="nosnippet">
```

### XML Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/products/</loc>
    <lastmod>2025-01-14</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## Images

### Image SEO Checklist

```html
<img 
  src="blue-widget-product.jpg"
  alt="Blue widget showing the control panel and LED display"
  width="800"
  height="600"
  loading="lazy"
>
```

| Element | Best Practice |
|---------|---------------|
| File name | Descriptive: `blue-widget.jpg` not `IMG_001.jpg` |
| Alt text | Describe content, include keywords naturally |
| Dimensions | Always set width/height (prevents CLS) |
| Format | WebP/AVIF with fallback |
| Compression | Optimize without quality loss |
| Lazy loading | `loading="lazy"` for below-fold |

---

## E-E-A-T Signals

| Signal | Implementation |
| --- | --- |
| Author Info | Clear attribution with credentials |
| About Page | Comprehensive company info |
| Contact Info | Visible contact details |
| Privacy Policy | Accessible policy page |
| External References | Cite authoritative sources |
| Reviews | Social proof where applicable |

---

## International SEO (hreflang)

For multi-language/region sites:

```html
<head>
  <!-- Language alternatives -->
  <link rel="alternate" hreflang="en" href="https://example.com/en/">
  <link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/">
  <link rel="alternate" hreflang="de" href="https://example.com/de/">
  <link rel="alternate" hreflang="ja" href="https://example.com/ja/">
  
  <!-- Default fallback -->
  <link rel="alternate" hreflang="x-default" href="https://example.com/">
</head>
```

### URL Structures for i18n

| Pattern | Example | Best For |
|---------|---------|----------|
| Subdirectory | `example.com/de/` | Most sites |
| Subdomain | `de.example.com` | Large sites |
| ccTLD | `example.de` | Country-specific |

---

## Core Web Vitals Impact

Core Web Vitals are ranking factors:

| Metric | Target | SEO Impact |
|--------|--------|------------|
| LCP | < 2.5s | Major |
| INP | < 200ms | Major |
| CLS | < 0.1 | Major |

See [performance.md](./performance.md) for optimization strategies.

---

## Mobile-First Indexing

Google primarily uses mobile version for indexing:

- [ ] Mobile viewport meta tag
- [ ] Responsive design (same content on mobile/desktop)
- [ ] Tap targets ≥ 48×48px
- [ ] No horizontal scroll
- [ ] Readable font sizes (≥16px)
- [ ] Same structured data on mobile version

---

## SEO Checklist

### On-Page

- [ ] Unique, optimized title (50-60 chars)
- [ ] Compelling meta description (120-158 chars)
- [ ] Single H1 with primary keyword
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Semantic HTML structure
- [ ] Internal links with descriptive anchor text
- [ ] Image alt text

### Technical

- [ ] HTTPS enabled
- [ ] Canonical URLs on all pages
- [ ] robots.txt configured
- [ ] XML sitemap submitted
- [ ] Mobile-friendly (responsive)
- [ ] Core Web Vitals passing
- [ ] No broken links (404s)

### Structured Data

- [ ] Relevant Schema.org types implemented
- [ ] JSON-LD format (preferred over microdata)
- [ ] Tested with Rich Results Test
- [ ] No validation errors

### Social

- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Social images at correct dimensions

---

## Testing Tools

| Tool | Purpose |
|------|---------|
| Google Search Console | Indexing status, issues |
| Rich Results Test | Structured data validation |
| Mobile-Friendly Test | Mobile usability |
| PageSpeed Insights | Performance + SEO |
| Lighthouse | SEO audit |
| Screaming Frog | Site crawl analysis |
