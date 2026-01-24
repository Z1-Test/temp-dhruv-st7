# Web Accessibility Best Practices

## What is it?

Web accessibility ensures your application is usable by everyone, including people with disabilities. The Web Content Accessibility Guidelines (WCAG) 2.2 provide the standard for accessible web content.

## Why prioritize accessibility?

- **Inclusivity**: 15% of world population has a disability
- **Legal Compliance**: ADA, EAA, Section 508 requirements
- **Better UX**: Accessible design benefits all users
- **SEO Benefits**: Semantic HTML improves search rankings
- **Larger Audience**: More users can access your content

---

## WCAG 2.2 Overview

### Conformance Levels

| Level | Description | Target |
|-------|-------------|--------|
| A | Minimum accessibility | Basic |
| AA | Addresses major barriers | **Standard target** |
| AAA | Highest accessibility | Enhanced (situational) |

### POUR Principles

| Principle | Meaning | Examples |
|-----------|---------|----------|
| **Perceivable** | Content can be perceived | Alt text, captions, contrast |
| **Operable** | Interface is operable | Keyboard, timing, navigation |
| **Understandable** | Content is understandable | Readable, predictable, errors |
| **Robust** | Works with assistive tech | Valid HTML, ARIA |

---

## Semantic HTML Foundation

### Use Native Elements First

```html
<!-- GOOD: Native semantic elements -->
<button type="submit">Submit</button>
<a href="/about">About Us</a>
<input type="checkbox" id="agree">
<nav aria-label="Main">...</nav>

<!-- BAD: Divs with click handlers -->
<div onclick="submit()">Submit</div>
<span class="link" onclick="navigate()">About Us</span>
<div class="checkbox" onclick="toggle()"></div>
<div class="nav">...</div>
```

### Heading Hierarchy

> [!WARNING]
> Lighthouse will fail accessibility audits if headings skip levels (e.g., H1 → H4).

**Core Rules:**
- Single `<h1>` per page (the page title)
- Never skip heading levels (H1 → H2 → H3, not H1 → H3)
- Footer/sidebar headings must follow the document flow
- Consider `role="heading" aria-level="X"` for visual-only headings

```html
<!-- CORRECT: Logical hierarchy -->
<h1>Page Title</h1>

<section>
  <h2>Main Section</h2>
  <p>Content...</p>
  
  <h3>Subsection</h3>
  <p>More content...</p>
</section>

<!-- DON'T skip heading levels -->
<!-- BAD: h1 → h3 (skipped h2) -->

<footer>
  <!-- Footer headings continue from last main heading level -->
  <h2>Footer Navigation</h2>
  <!-- Or use styled spans if visual-only -->
  <span class="footer-heading">Quick Links</span>
</footer>
```

**Common Anti-Patterns:**

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Skipping levels (H1 → H4) | Confuses screen reader users | Use sequential H1 → H2 → H3 |
| H4/H5/H6 in footer after H2 | Skips levels | Use H2/H3 or styled `<span>` |
| Multiple H1s per page | Unclear document structure | Single H1 only |
| Heading for styling only | Incorrect semantics | Use CSS classes instead |
| Empty headings | No accessible name | Add content or remove |

```css
/* Style text like a heading without semantic meaning */
.footer-heading {
  font-size: 1.125rem;
  font-weight: 600;
  margin-block-end: 0.5rem;
}
```

### Landmark Regions

```html
<body>
  <header>
    <nav aria-label="Main navigation">...</nav>
  </header>
  
  <main>
    <article>
      <h1>Article Title</h1>
    </article>
    
    <aside aria-label="Related links">...</aside>
  </main>
  
  <footer>...</footer>
</body>
```

---

## Images and Media

### Alt Text Guidelines

```html
<!-- Informative image: Describe content -->
<img 
  src="chart.png" 
  alt="Sales chart showing 25% growth in Q4 2024"
>

<!-- Decorative image: Empty alt -->
<img src="decorative-border.png" alt="">

<!-- Image of text: Include the text -->
<img 
  src="logo.png" 
  alt="Acme Corporation"
>

<!-- Complex image: Link to long description -->
<figure>
  <img src="infographic.png" alt="Product comparison infographic">
  <figcaption>
    <a href="#infographic-description">Full description</a>
  </figcaption>
</figure>
```

### Alt Text Decision Tree

```
Is the image purely decorative?
├── Yes → alt=""
└── No → Is it an image of text?
    ├── Yes → Include the text as alt
    └── No → Does it convey information?
        ├── Yes → Describe the information (not the image)
        └── No → Describe what it links to (if linked)
```

### Video and Audio

```html
<!-- Video with captions and audio description -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
  <track kind="descriptions" src="descriptions.vtt" srclang="en" label="Audio Descriptions">
</video>

<!-- Audio with transcript -->
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
</audio>
<a href="transcript.html">Read transcript</a>
```

---

## Keyboard Accessibility

### Focus Management

```css
/* Always provide visible focus indicator */
:focus-visible {
  outline: 2px solid #1a73e8;
  outline-offset: 2px;
}

/* Don't remove focus styles */
/* BAD: *:focus { outline: none; } */
```

### Focus Order

```html
<!-- Natural focus order follows DOM order -->
<!-- Use tabindex sparingly -->

<!-- tabindex="0": Add to focus order (rarely needed) -->
<div tabindex="0" role="button">Custom Interactive</div>

<!-- tabindex="-1": Programmatically focusable only -->
<div id="modal" tabindex="-1">Modal content</div>

<!-- NEVER use tabindex > 0 -->
```

### Skip Links

```html
<!-- First focusable element -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<header>...</header>
<nav>...</nav>

<main id="main-content" tabindex="-1">
  <!-- Main content -->
</main>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
}

.skip-link:focus {
  left: 0;
  top: 0;
  padding: 1rem;
  background: #000;
  color: #fff;
}
```

### Keyboard Traps

```javascript
// Modal: Trap focus inside while open
function trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}
```

---

## Forms

### Labels and Instructions

```html
<!-- Explicit label (preferred) -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required>

<!-- Group with fieldset/legend -->
<fieldset>
  <legend>Shipping Address</legend>
  
  <label for="street">Street</label>
  <input type="text" id="street" name="street">
  
  <label for="city">City</label>
  <input type="text" id="city" name="city">
</fieldset>

<!-- Provide format hints -->
<label for="phone">Phone Number</label>
<input 
  type="tel" 
  id="phone" 
  aria-describedby="phone-hint"
>
<span id="phone-hint">Format: (555) 123-4567</span>
```

### Error Handling

```html
<!-- Accessible error messages -->
<label for="email">Email</label>
<input 
  type="email" 
  id="email" 
  aria-invalid="true"
  aria-describedby="email-error"
>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
```

```javascript
// Focus first error on submit
form.addEventListener('submit', (e) => {
  const firstError = form.querySelector('[aria-invalid="true"]');
  if (firstError) {
    e.preventDefault();
    firstError.focus();
  }
});
```

### Required Fields

```html
<!-- Programmatically required -->
<label for="name">
  Name <span aria-hidden="true">*</span>
</label>
<input 
  type="text" 
  id="name" 
  required
  aria-required="true"
>

<!-- Legend for required indicator -->
<p class="required-note">
  <span aria-hidden="true">*</span> Required fields
</p>
```

---

## Color and Contrast

### Minimum Contrast Ratios

| Element | AA | AAA |
|---------|-----|-----|
| Normal text (< 18pt) | 4.5:1 | 7:1 |
| Large text (≥ 18pt or 14pt bold) | 3:1 | 4.5:1 |
| UI components, graphics | 3:1 | — |

### Don't Rely on Color Alone

```html
<!-- BAD: Color only -->
<span class="error" style="color: red;">Error</span>

<!-- GOOD: Color + icon + text -->
<span class="error" style="color: red;">
  ⚠ Error: Email is required
</span>

<!-- GOOD: Links with underline, not just color -->
<a href="/about" style="text-decoration: underline;">About</a>
```

### Dark Mode Support

```css
/* System preference dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #121212;
    --color-text: #e0e0e0;
  }
}

/* Ensure contrast in both modes */
```

---

## ARIA Patterns

### When to Use ARIA

1. **First**: Use native HTML elements
2. **Second**: Add ARIA only when HTML isn't sufficient
3. **Never**: Use ARIA to override native semantics

### Common ARIA Patterns

#### Buttons and Links

```html
<!-- Native button (preferred) -->
<button type="button">Click me</button>

<!-- Custom button (when necessary) -->
<div 
  role="button" 
  tabindex="0"
  onclick="handleClick()"
  onkeydown="if(event.key === 'Enter' || event.key === ' ') handleClick()"
>
  Click me
</div>
```

#### Live Regions

```html
<!-- Status messages -->
<div aria-live="polite" id="status">
  <!-- Dynamically updated content announced to screen readers -->
</div>

<!-- Urgent alerts -->
<div role="alert">
  Error: Payment failed
</div>
```

#### Dialogs

```html
<dialog 
  id="modal"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
>
  <h2 id="modal-title">Confirm Action</h2>
  <p id="modal-desc">Are you sure you want to proceed?</p>
  <button type="button" onclick="this.closest('dialog').close()">Cancel</button>
  <button type="submit">Confirm</button>
</dialog>
```

#### Expandable Content

```html
<button 
  aria-expanded="false" 
  aria-controls="panel"
  onclick="togglePanel()"
>
  Show Details
</button>
<div id="panel" hidden>
  Details content here...
</div>
```

```javascript
function togglePanel() {
  const button = document.querySelector('[aria-controls="panel"]');
  const panel = document.getElementById('panel');
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  
  button.setAttribute('aria-expanded', !isExpanded);
  panel.hidden = isExpanded;
}
```

---

## Motion and Animation

### Respect User Preferences

```css
/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Safe Animation Practices

```css
/* Prefer transforms over position changes */
.animate {
  transition: transform 0.3s, opacity 0.3s;
}

/* Avoid animations that cause layout shifts */
/* BAD: animating width, height, margin, padding */
```

---

## Testing Accessibility

### Automated Testing

```javascript
// Playwright + axe-core
import AxeBuilder from '@axe-core/playwright';

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

### Testing Matrix

| Platform | Screen Reader | Browser         |
| -------- | ------------- | --------------- |
| macOS    | VoiceOver     | Safari          |
| Windows  | NVDA          | Firefox, Chrome |
| iOS      | VoiceOver     | Safari          |
| Android  | TalkBack      | Chrome          |

### Tools

| Tool | Type | Use For |
|------|------|---------|
| axe DevTools | Browser extension | Quick audits |
| WAVE | Browser extension | Visual feedback |
| Lighthouse | Built-in Chrome | Overall audit |
| NVDA | Screen reader | Windows testing |
| VoiceOver | Screen reader | macOS/iOS testing |

---

## Accessibility Checklist

### Keyboard

- [ ] All functionality via keyboard
- [ ] No keyboard traps
- [ ] Focus visible at all times
- [ ] Skip link present

### Screen Reader

- [ ] Images have alt text
- [ ] Forms fully labeled
- [ ] Dynamic content announced
- [ ] Landmarks present

### Visual

- [ ] Text contrast ≥4.5:1
- [ ] No color-only information
- [ ] Reduced motion respected

### Testing

- [ ] Tested with VoiceOver/NVDA
- [ ] Tested keyboard-only
- [ ] axe-core passes

---

## WCAG 2.2 Quick Reference Checklist

### Level A (Minimum)

- [ ] 1.1.1: All images have alt text
- [ ] 1.3.1: Information conveyed through structure (headings, lists)
- [ ] 1.4.1: Color is not the only means of conveying info
- [ ] 2.1.1: All functionality available via keyboard
- [ ] 2.1.2: No keyboard traps
- [ ] 2.4.1: Skip links present
- [ ] 2.4.2: Pages have titles
- [ ] 3.1.1: Page language set (`lang` attribute)
- [ ] 3.3.1: Errors are identified
- [ ] 3.3.2: Labels provided for inputs
- [ ] 4.1.1: Valid HTML (no duplicate IDs)
- [ ] 4.1.2: Name, role, value exposed for controls

### Level AA (Standard Target)

- [ ] 1.4.3: Contrast ratio ≥ 4.5:1 for text
- [ ] 1.4.4: Text resizable to 200%
- [ ] 1.4.10: Content reflows at 320px width
- [ ] 2.4.3: Focus order is logical
- [ ] 2.4.4: Link purpose clear from text
- [ ] 2.4.6: Headings describe content
- [ ] 2.4.7: Focus is visible
- [ ] 3.2.3: Navigation is consistent
- [ ] 3.2.4: Components identified consistently

---

## Common Fixes

| Issue | Fix |
|-------|-----|
| Missing alt text | Add descriptive `alt` attribute |
| Low contrast | Increase to 4.5:1 minimum |
| Missing form labels | Add `<label for="id">` |
| Missing page language | Add `lang="en"` to `<html>` |
| No focus visible | Add `:focus-visible` styles |
| Click handler on div | Use `<button>` instead |
| Skip link missing | Add skip link to main content |
| Heading hierarchy broken | Fix heading levels, use single H1 |
