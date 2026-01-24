# Child Page Discovery Reference

Guidelines for discovering and researching child pages from a parent URL.

---

## Sitemap Discovery

### Discovery Order

1. Try `{origin}/sitemap.xml`
2. Parse `robots.txt` for `Sitemap:` directive
3. Try `{origin}/sitemap_index.xml` (for sitemap indexes)

### Filtering Logic

```
parentPath = new URL(parentUrl).pathname
// Normalize parent path by removing specific end segments
const cleanParent = parentPath.replace(/(\/index\.[^/]+|\/)$/, '');
// Filter: child URL path starts with clean parent path
childUrl.pathname.startsWith(cleanParent)
```

**Exclude:**

- Anchor links (`#section`)
- Query parameters (`?page=2`)
- External domains
- Asset files (`.css`, `.js`, `.png`, etc.)

### Example

Parent: `https://web.dev/learn/css`

| URL                                   | Include? | Reason              |
| ------------------------------------- | -------- | ------------------- |
| `https://web.dev/learn/css/box-model` | ✅       | Matches path prefix |
| `https://web.dev/learn/css/selectors` | ✅       | Matches path prefix |
| `https://web.dev/learn/html`          | ❌       | Different section   |
| `https://web.dev/blog/...`            | ❌       | Different section   |

---

## Link Crawling Fallback

When sitemap is unavailable, extract links from the parent page.

### Extraction Rules

1. Parse all `<a href="...">` elements from parent page
2. Resolve relative URLs against parent (e.g., `./box-model` → full URL)
3. Filter by same-origin + path prefix match
4. Remove duplicates (normalize trailing slashes)

### Depth Limiting

- **Default**: 1 level (direct children only)
- **Max**: 2 levels (only for nested documentation with explicit need)

### Navigation Exclusions

Skip common non-content links:

- Footer links (privacy, terms, contact)
- Header navigation to unrelated sections
- Pagination links (next/prev)
- Language/locale switchers

---

## Rate Limiting

Prevent blocks and respect server resources.

| Parameter        | Value | Rationale                     |
| ---------------- | ----- | ----------------------------- |
| Request delay    | 500ms | Avoid burst traffic           |
| Max concurrent   | 3     | Parallel without overwhelming |
| Timeout per page | 30s   | Handle slow responses         |
| Max retries      | 1     | Don't hammer failed pages     |

---

## Output Integration

### Metadata Block Addition

```markdown
> **Mode:** Deep Research  
> **Pages Discovered:** [Number found]  
> **Pages Analyzed:** [Number successfully fetched]
```

### Hierarchical Facet Organization

Organize facets by URL path structure:

```
Parent: /learn/css
├── 1. Box Model (/learn/css/box-model)
├── 2. Selectors (/learn/css/selectors)
├── 3. Nesting (/learn/css/nesting)
├── 4. Layout (/learn/css/layout)
│   └── 4.1 Grid (/learn/css/layout/grid)
│   └── 4.2 Flexbox (/learn/css/layout/flexbox)
```

### Sources Table Extension

Add "Page" column to show which child URL each source came from:

| #   | Source                    | Type | Page       | Covers Facets |
| --- | ------------------------- | ---- | ---------- | ------------- |
| 1   | [Box Model Guide](url)    | docs | /box-model | 1             |
| 2   | [Selector Reference](url) | docs | /selectors | 2             |
