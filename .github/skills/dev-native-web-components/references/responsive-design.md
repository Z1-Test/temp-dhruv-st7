# Responsive Design Reference

> Use responsive units for all layout. **Never use `px` for layout** (only for borders/shadows).

---

## Container Query Strategy

### Two-Part Approach

| Technique                      | Purpose            | Syntax                                  |
| ------------------------------ | ------------------ | --------------------------------------- |
| **`@container` queries**       | Layout breakpoints | Changes structure at specific widths    |
| **`cqi` units with `clamp()`** | Fluid sizing       | Scales continuously with container size |

### Example: Combined Strategy

```css
.card-container {
  /* Named container prevents conflicts with nested containers */
  container-name: card;
  container-type: inline-size;
  /* Shorthand: container: card / inline-size; */
}

.card {
  /* Fluid sizing with cqi units */
  font-size: clamp(0.875rem, 0.875rem + 2cqi, 1.125rem);
  padding: clamp(0.5rem, 0.5rem + 2cqi, 1rem);

  /* Default: vertical stack */
  display: flex;
  flex-direction: column;
}

/* Query the named 'card' container */
@container card (min-width: 30rem) {
  .card {
    flex-direction: row;
  }
}
```

### Named Containers

Use `container-name` to avoid conflicts when components are nested:

```css
/* Define named containers */
.page-container {
  container: page / inline-size;
}

.section-container {
  container: section / inline-size;
}

.card-container {
  container: card / inline-size;
}

/* Query specific containers */
@container page (min-width: 80rem) {
  .sidebar {
    display: block;
  }
}

@container section (min-width: 60rem) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@container card (min-width: 30rem) {
  .card {
    flex-direction: row;
  }
}
```

`---

## Container Types

Choose the appropriate `container-type` based on what dimensions you need to query:

| Type          | Queries        | Use Case                                  |
| ------------- | -------------- | ----------------------------------------- |
| `inline-size` | Width only     | Most common - horizontal layout changes   |
| `size`        | Width + Height | Rare - when both dimensions affect layout |
| `normal`      | None           | Default - disables container queries      |

```css
/* ✅ RECOMMENDED: inline-size for most components */
.card {
  container: card / inline-size;
}

/* ⚠️ CAUTION: size applies layout containment in both axes */
.modal {
  container: modal / size;
  /* Size containment means children can't affect parent's height */
}
```

> **Note**: `size` containment prevents children from affecting the container's dimensions. Use only when you have explicit dimensions set.

---

## Nested Containers

Container queries work correctly with nesting. Each `@container` query targets the **nearest ancestor** container with a matching name.

```css
/* Outer container */
.page {
  container: page / inline-size;
}

/* Middle container */
.section {
  container: section / inline-size;
}

/* Inner container */
.card {
  container: card / inline-size;
}

/* Queries target their named containers */
@container page (min-width: 80rem) {
  .page-content {
    max-width: 75rem; /* Only responds to page container */
  }
}

@container section (min-width: 60rem) {
  .section-grid {
    grid-template-columns: repeat(3, 1fr); /* Only responds to section */
  }
}

@container card (min-width: 30rem) {
  .card-layout {
    flex-direction: row; /* Only responds to card container */
  }
}
```

**Key Rule**: Children query their **parent** container's size, not their own size.

---

## Best Practices

### Always Name Your Containers

```css
/* ❌ BAD: Anonymous containers can conflict */
.card {
  container-type: inline-size;
}

@container (min-width: 30rem) {
  /* Which container? Could be any ancestor! */
}

/* ✅ GOOD: Named containers are explicit */
.card {
  container: card / inline-size;
}

@container card (min-width: 30rem) {
  /* Clearly targets the 'card' container */
}
```

### Mobile-First Approach

```css
/* ✅ GOOD: Start with mobile styles */
.component {
  flex-direction: column;
}

@container component (min-width: 40rem) {
  .component {
    flex-direction: row;
  }
}

/* ❌ BAD: Desktop-first requires more overrides */
.component {
  flex-direction: row;
}

@container component (max-width: 39.99rem) {
  .component {
    flex-direction: column;
  }
}
```

### Use Logical Properties

```css
/* ✅ GOOD: Works with any writing mode */
.card {
  padding-inline: 2cqi;
  margin-block: 1rem;
}

/* ❌ BAD: Assumes left-to-right */
.card {
  padding-left: 2cqi;
  padding-right: 2cqi;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
```

### Combine with clamp() for Fluid Sizing

```css
/* ✅ GOOD: Fluid sizing + breakpoint changes */
.card {
  /* Scales smoothly between 0.875rem and 1.125rem */
  font-size: clamp(0.875rem, 0.875rem + 2cqi, 1.125rem);
  padding: clamp(0.5rem, 0.5rem + 2cqi, 1rem);

  flex-direction: column;
}

/* At 30rem, switch layout */
@container card (min-width: 30rem) {
  .card {
    flex-direction: row;
  }
}
```

---

## Common Pitfalls

### Querying Your Own Element

```css
/* ❌ WRONG: Can't query the element you're styling */
.card {
  container: card / inline-size;
  width: 50cqi; /* Paradox! Can't measure itself */
}

/* ✅ CORRECT: Wrapper pattern */
.card-container {
  container: card / inline-size;
}

.card {
  width: 50cqi; /* Measures parent container */
}
```

### Forgetting container-type

```css
/* ❌ WRONG: @container won't work without container-type */
.card {
  /* Missing container declaration! */
}

@container card (min-width: 30rem) {
  /* This won't match anything */
}

/* ✅ CORRECT */
.card {
  container: card / inline-size;
}
```

### Using px Instead of Responsive Units

```css
/* ❌ BAD: Hardcoded pixel values */
@container card (min-width: 480px) {
  .card {
    padding: 24px;
  }
}

/* ✅ GOOD: Responsive units */
@container card (min-width: 30rem) {
  .card {
    padding: var(--space-md); /* or clamp() */
  }
}
```

---

## Unit Hierarchy

| Priority | Unit         | Use Case                  |
| -------- | ------------ | ------------------------- |
| 1️⃣       | `cqi`, `cqw` | Container-relative        |
| 2️⃣       | `dvh`, `svh` | Viewport (dynamic)        |
| 3️⃣       | `rem`        | Root-relative spacing     |
| 4️⃣       | `em`         | Element-relative (icons)  |
| ⚠️       | `px`         | **ONLY** borders, shadows |

---

## Container Query Units

```css
.card-container {
  container-name: card;
  container-type: inline-size;
}

.card-title {
  font-size: clamp(1rem, 1rem + 4cqi, 2.5rem);
  padding-inline: 2cqi;
}

@container card (min-width: 40rem) {
  .card-title {
    text-align: left;
  }
}
```

| Unit  | Description                 |
| ----- | --------------------------- |
| `cqi` | 1% of container inline size |
| `cqw` | 1% of container width       |
| `cqb` | 1% of container block size  |

---

## Container Queries Example

```css
.product-grid {
  /* Named container for product grid scope */
  container-name: product-grid;
  container-type: inline-size;

  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
}

/* Query the specific 'product-grid' container */
@container product-grid (width < 30rem) {
  .product-card {
    display: block;
    text-align: center;
  }
}

@container product-grid (width >= 30rem) {
  .product-card {
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 1rem;
  }
}

@container product-grid (width >= 50rem) {
  .product-card {
    grid-template-columns: 12rem 1fr auto;
  }
}
```

---

## Dynamic Viewport Units

```css
/* ❌ WRONG: 100vh causes issues on mobile */
.hero {
  height: 100vh;
}

/* ✅ CORRECT: Dynamic viewport respects browser chrome */
.hero {
  min-height: 100dvh;
}
```

| Unit  | Description             |
| ----- | ----------------------- |
| `dvh` | Dynamic viewport height |
| `svh` | Small viewport height   |
| `lvh` | Large viewport height   |

---

## Fluid Typography with clamp()

```css
:root {
  --text-sm: clamp(0.875rem, 0.875rem + 2cqi, 1rem);
  --text-base: clamp(1rem, 1rem + 2.5cqi, 1.125rem);
  --text-lg: clamp(1.125rem, 1.125rem + 3cqi, 1.5rem);
  --text-xl: clamp(1.5rem, 1.5rem + 4cqi, 2.5rem);
  --text-2xl: clamp(2rem, 2rem + 5cqi, 4rem);

  --space-sm: clamp(0.5rem, 0.5rem + 1cqi, 0.75rem);
  --space-md: clamp(1rem, 1rem + 2cqi, 1.5rem);
  --space-lg: clamp(1.5rem, 1.5rem + 3cqi, 2.5rem);
}
```

---

## Container vs Media Queries

| Feature     | Container  | Media       |
| ----------- | ---------- | ----------- |
| Scope       | Component  | Page        |
| Responds to | Container  | Viewport    |
| Use for     | Components | Page layout |

```css
/* Media: Page layout only */
@media (width >= 64rem) {
  .page {
    grid-template-columns: 16rem 1fr;
  }
}

/* Container: Component layout with named container */
.card-container {
  container: card / inline-size;
}

@container card (width >= 30rem) {
  .card {
    flex-direction: row;
  }
}
```

---

## Responsive Images

```html
<img
  src="product-400.jpg"
  srcset="product-400.jpg 400w, product-800.jpg 800w"
  sizes="(max-width: 400px) 100vw, 50vw"
  alt="Product"
  loading="lazy"
/>
```

---

## Checklist

- [ ] No `px` for layout
- [ ] `clamp()` for fluid typography
- [ ] Container queries for components
- [ ] `dvh` instead of `vh` for mobile
- [ ] `aspect-ratio` for media
- [ ] `@container` for breakpoints, `cqi` for fluid sizing

_Reference: [web.dev/learn/css/container-queries](https://web.dev/learn/css/container-queries)_
