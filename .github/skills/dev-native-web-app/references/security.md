# Web Security Best Practices

## What is it?

A comprehensive guide to securing web applications against common vulnerabilities, implementing secure defaults, and protecting user data.

## Why prioritize security?

- **User Trust**: Users expect their data to be protected
- **Legal Compliance**: GDPR, CCPA, PCI-DSS requirements
- **SEO Impact**: HTTPS is a ranking factor
- **Reputation**: Breaches damage brand trust permanently

---

## HTTPS Everywhere

### Why HTTPS Matters
- Encrypts data in transit
- Prevents man-in-the-middle attacks
- Required for many modern APIs (geolocation, notifications, service workers)
- Improves SEO rankings

### Implementation Checklist

- [ ] Valid SSL/TLS certificate (use Let's Encrypt for free certs)
- [ ] Redirect all HTTP to HTTPS
- [ ] Enable HSTS header
- [ ] Submit to HSTS preload list

### HSTS (HTTP Strict Transport Security)

```
# Force HTTPS for 1 year, include subdomains
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Best Practice**: Start with a short `max-age` (1 week), then increase after confirming everything works.

---

## Content Security Policy (CSP)

CSP prevents XSS attacks by controlling which resources can be loaded.

### Strict CSP (Recommended)

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'strict-dynamic' 'nonce-{random}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### Nonce-Based CSP

```html
<!-- Server generates unique nonce per request -->
<script nonce="abc123random">
  // Inline script with matching nonce is allowed
</script>
```

```
Content-Security-Policy: script-src 'strict-dynamic' 'nonce-abc123random';
```

### CSP Directives Reference

| Directive | Purpose | Recommended Value |
|-----------|---------|-------------------|
| `default-src` | Fallback for other directives | `'self'` |
| `script-src` | JavaScript sources | `'self' 'strict-dynamic' 'nonce-{random}'` |
| `style-src` | CSS sources | `'self' 'unsafe-inline'` (fonts need inline) |
| `img-src` | Image sources | `'self' data: https:` |
| `connect-src` | Fetch/XHR/WebSocket | `'self' https://api.example.com` |
| `frame-ancestors` | Who can embed this page | `'none'` or `'self'` |
| `base-uri` | Restrict `<base>` element | `'self'` |
| `form-action` | Form submission targets | `'self'` |

### Report-Only Mode for Testing

```
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report;
```

---

## XSS Prevention

Cross-Site Scripting (XSS) injects malicious scripts into web pages.

### Types of XSS

| Type | Vector | Prevention |
|------|--------|------------|
| Reflected | URL parameters | Encode output, validate input |
| Stored | Database | Encode output, sanitize input |
| DOM-based | Client-side JS | Use safe APIs, avoid `innerHTML` |

### Best Practices

#### 1. Encode Output

```javascript
// BAD: Never insert user input directly
element.innerHTML = userInput;

// GOOD: Use textContent for text
element.textContent = userInput;

// GOOD: Use safe templating
const sanitized = DOMPurify.sanitize(userInput);
element.innerHTML = sanitized;
```

#### 2. Use Safe DOM APIs

```javascript
// BAD: Dangerous methods
document.write(userInput);
element.innerHTML = userInput;
element.insertAdjacentHTML('beforeend', userInput);
eval(userInput);

// GOOD: Safe alternatives
element.textContent = userInput;
element.setAttribute('data-user', userInput);
```

#### 3. Validate and Sanitize Input

```javascript
// Validate input type
function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// Sanitize HTML input
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(dirtyHTML, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a'],
  ALLOWED_ATTR: ['href', 'title']
});
```

#### 4. Set Correct Content-Type

```javascript
// Always set correct Content-Type for JSON responses
res.setHeader('Content-Type', 'application/json');
res.send(JSON.stringify(data));

// Never serve user content as HTML without sanitization
```

---

## CSRF Prevention

Cross-Site Request Forgery tricks users into performing unwanted actions.

### SameSite Cookies (Primary Defense)

```
Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
```

| SameSite Value | Behavior |
|----------------|----------|
| `Strict` | Cookie only sent on same-origin requests |
| `Lax` | Cookie sent on top-level navigations + same-origin |
| `None` | Cookie sent on all requests (requires `Secure`) |

### CSRF Token Pattern

```html
<!-- Include token in forms -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="random-token-from-server">
  <input type="text" name="amount">
  <button type="submit">Transfer</button>
</form>
```

```javascript
// Validate token on server
app.post('/transfer', (req, res) => {
  if (req.body.csrf_token !== req.session.csrf_token) {
    return res.status(403).send('Invalid CSRF token');
  }
  // Process request
});
```

---

## Secure Headers

### Essential Security Headers

```
# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# Prevent clickjacking
X-Frame-Options: DENY

# Control referrer information
Referrer-Policy: strict-origin-when-cross-origin

# Restricts browser features
Permissions-Policy: geolocation=(), microphone=(), camera=()

# XSS filter (legacy browsers)
X-XSS-Protection: 1; mode=block
```

### Headers Configuration Example

```javascript
// Express.js middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  next();
});

// Or use helmet.js
import helmet from 'helmet';
app.use(helmet());
```

---

## Cookie Security

### Secure Cookie Attributes

```
Set-Cookie: session=abc123; 
  Secure;           /* Only send over HTTPS */
  HttpOnly;         /* Not accessible via JavaScript */
  SameSite=Strict;  /* CSRF protection */
  Path=/;           /* Scope */
  Max-Age=3600      /* 1 hour expiry */
```

| Attribute | Purpose | When to Use |
|-----------|---------|-------------|
| `Secure` | HTTPS only | Always (production) |
| `HttpOnly` | No JS access | Session cookies, auth tokens |
| `SameSite=Strict` | Strict origin | Sensitive cookies |
| `SameSite=Lax` | Allows top-level nav | Most cookies |
| `Max-Age` / `Expires` | Limits lifetime | Always set explicitly |

### JavaScript Cookie Example

```javascript
// BAD: Insecure cookie
document.cookie = 'user=john';

// GOOD: Secure cookie (for non-sensitive data only)
document.cookie = 'theme=dark; Secure; SameSite=Strict; Max-Age=31536000';
```

---

## CORS Configuration

Cross-Origin Resource Sharing controls cross-origin access to resources.

### Restrictive CORS (Recommended)

```javascript
// Express.js - Allow only specific origins
const allowedOrigins = ['https://myapp.com', 'https://admin.myapp.com'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});
```

### Never Use in Production

```
# DANGEROUS: Allows any origin
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

---

## Input Validation

### Client-Side Validation (UX Only)

```html
<form>
  <input 
    type="email" 
    required 
    pattern="[^@]+@[^@]+\.[a-z]+"
    maxlength="254"
  >
  <input 
    type="text" 
    pattern="[A-Za-z\s]+"
    maxlength="100"
  >
</form>
```

### Server-Side Validation (Required)

```javascript
// Always validate on server - never trust client input
function validateUser(input) {
  const errors = [];
  
  // Type checking
  if (typeof input.email !== 'string') {
    errors.push('Email must be a string');
  }
  
  // Format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push('Invalid email format');
  }
  
  // Length limits
  if (input.name.length > 100) {
    errors.push('Name too long');
  }
  
  // Allowlist validation
  const allowedRoles = ['user', 'admin', 'moderator'];
  if (!allowedRoles.includes(input.role)) {
    errors.push('Invalid role');
  }
  
  return errors;
}
```

---

## Sensitive Data Protection

### Never Expose in URLs

```
# BAD: Sensitive data in URL (logged, cached, shared)
https://example.com/reset?token=abc123&email=user@example.com

# GOOD: Send sensitive data in request body
POST /reset
Content-Type: application/json
{"token": "abc123", "email": "user@example.com"}
```

### Environment Variables

```javascript
// BAD: Hardcoded secrets
const API_KEY = 'sk_live_abc123secret';

// GOOD: Environment variables
const API_KEY = process.env.API_KEY;
```

### Client-Side Storage

| Storage | Use For | Never Store |
|---------|---------|-------------|
| `localStorage` | Non-sensitive preferences | Tokens, PII |
| `sessionStorage` | Temporary UI state | Tokens, PII |
| `Cookies` (HttpOnly) | Session tokens | — |
| `IndexedDB` | Large app data | Unencrypted secrets |

---

## Security Checklist

### Transport Security
- [ ] HTTPS enforced on all pages
- [ ] HSTS header with `includeSubDomains`
- [ ] Valid SSL/TLS certificate (auto-renewing)
- [ ] HTTP to HTTPS redirect

### Headers
- [ ] Strict CSP implemented
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy set
- [ ] Permissions-Policy configured

### Cookies
- [ ] `Secure` flag on all cookies
- [ ] `HttpOnly` on session cookies
- [ ] `SameSite=Strict` or `Lax`
- [ ] Appropriate expiry set

### Input/Output
- [ ] All input validated server-side
- [ ] Output encoded for context
- [ ] File uploads validated and sandboxed
- [ ] No sensitive data in URLs

### CORS
- [ ] Specific origins only (no `*`)
- [ ] Credentials require explicit origin

---

## Security Testing Tools

| Tool | Purpose |
|------|---------|
| Mozilla Observatory | Header analysis |
| SecurityHeaders.com | Header scoring |
| CSP Evaluator | CSP policy testing |
| OWASP ZAP | Vulnerability scanning |
| Lighthouse | Security audits |
