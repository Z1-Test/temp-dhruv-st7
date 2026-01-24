# stayfront Framework Guide

> `@staytunedllp/stayfront` - Functional reactive web framework

## Core Exports

```typescript
import {
  // Component
  html,
  defineElement,
  useState,
  useEffect,
  useComputed,
  useAsync,
  // Signals
  createSignal,
  createComputed,
  createEffect,
  batch,
  // Template
  escapeHtml,
  attrs,
  classNames,
  dsd,
} from "@staytunedllp/stayfront";
```

## Creating Components

```typescript
import { html, defineElement, useState } from "@staytunedllp/stayfront";

const greeting = defineElement({ tagName: "my-greeting" }, () => {
  const [name, setName] = useState("World");

  return html`
    <style>
      :host {
        display: block;
      }
    </style>
    <input
      value="${name()}"
      oninput="${(e: InputEvent) =>
        setName((e.target as HTMLInputElement).value)}"
    />
    <p>Hello, ${name()}!</p>
  `;
});

greeting.register();
```

## Signals

```typescript
import {
  createSignal,
  createComputed,
  createEffect,
  batch,
} from "@staytunedllp/stayfront";

// Create signal
const [count, setCount] = createSignal(0);
count(); // Read: 0
setCount(1); // Write
setCount((c) => c + 1); // Update

// Computed
const doubled = createComputed(() => count() * 2);

// Effect
createEffect(() => console.log("Count:", count()));

// Batch updates
batch(() => {
  setCount(1);
  setCount(2);
}); // Only triggers once
```

## Hooks

| Hook                 | Purpose                       |
| -------------------- | ----------------------------- |
| `useState(initial)`  | Local reactive state          |
| `useEffect(fn)`      | Side effects with cleanup     |
| `useComputed(fn)`    | Derived reactive values       |
| `useAsync(fn, deps)` | Async data with loading state |

## Routing

```typescript
import {
  createRouter,
  initializeRouter,
  useRouter,
  useParam,
  useSearchParams,
  usePrefetch,
  generateUrl,
} from "@staytunedllp/stayfront";

// Create router
const router = createRouter();
router.add("/", () => html`<home-page></home-page>`);
router.add("/users/:id", () => html`<user-page></user-page>`);
router.add("/404", () => html`<not-found-page></not-found-page>`);

// Initialize
initializeRouter(router);

// In components
const UserPage = defineElement({ tagName: "user-page" }, () => {
  const userId = useParam("id");
  const { navigate } = useRouter();
  const prefetch = usePrefetch();

  return html`
    <p>User: ${userId()}</p>
    <button onclick="${() => navigate("/")}">Home</button>
    <a href="/about" onmouseenter="${() => prefetch("/about")}">About</a>
  `;
});
```

## Data Fetching

```typescript
import {
  createDataClient,
  createMultiLayerCache,
  useQuery,
  useMutation,
  useGraphQL,
} from "@staytunedllp/stayfront";

// Create client
const cache = createMultiLayerCache({ memory: true, indexedDb: true });
const client = createDataClient({ baseUrl: "/api", cache });

// In component
const UserList = defineElement({ tagName: "user-list" }, () => {
  const { data, loading, error, refetch } = useQuery("/users");

  if (loading()) return html`<p aria-busy="true">Loading...</p>`;
  if (error()) return html`<p role="alert">Error: ${error().message}</p>`;

  return html`
    <ul>
      ${data().map((u) => html`<li>${u.name}</li>`)}
    </ul>
    <button onclick="${refetch}">Refresh</button>
  `;
});
```

## SDUI Engine

```typescript
import {
  createSchemaRenderer,
  createRegistry,
  type PageSchema,
} from "@staytunedllp/stayfront/sdui";
import { createIntroRegistry } from "@staytunedllp/stayintro";

// Use stayintro styled blocks
const registry = createIntroRegistry();
const renderer = createSchemaRenderer(registry);

const schema: PageSchema = {
  version: "1.0.0",
  root: {
    type: "ui.page",
    children: [
      { type: "ui.text", props: { content: "Hello {{user.name}}!" } },
      { type: "ui.button", props: { label: "Click", variant: "primary" } },
    ],
  },
};

const htmlOutput = renderer.renderSchema(schema, { user: { name: "Alice" } });
```

## SSR with DSD

```typescript
const counter = defineElement({ tagName: "my-counter" }, () => {
  const [count, setCount] = useState(0);
  return html`<button>Count: ${count()}</button>`;
});

// Server-side render with Declarative Shadow DOM
const ssrHtml = counter.renderWithDsd({});
// <my-counter><template shadowrootmode="open"><button>Count: 0</button></template></my-counter>
```

## Template Utilities

```typescript
import { escapeHtml, attrs, classNames, dsd } from "@staytunedllp/stayfront";

// Escape for XSS protection
escapeHtml("<script>"); // "&lt;script&gt;"

// Build attribute string
attrs({ disabled: true, "aria-label": "Close" }); // 'disabled aria-label="Close"'

// Build class string
classNames("btn", { active: true, disabled: false }); // "btn active"

// Wrap in DSD template
dsd(html`<div>Content</div>`);
```
