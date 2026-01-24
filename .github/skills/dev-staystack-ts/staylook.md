# stayintro Design System Guide

> `@staytunedllp/stayintro` - Design system powered by stayfront SDUI

**Note:** stayintro is planned but not yet fully implemented. This documents the planned API.

## Package Exports

```typescript
import {
  // Design tokens
  colors,
  spacing,
  typography,
  shadows,
  radii,
  motion,
  // Token CSS
  tokensToCss,
  // Theme
  createTheme,
  defaultTheme,
  darkTheme,
  // SDUI Registry
  createIntroRegistry,
  // Primitives
  Box,
  Stack,
  Grid,
  // Components
  Button,
  Input,
  Card,
  Text,
  Alert,
  Badge,
  Modal,
} from "@staytunedllp/stayintro";
```

## Design Tokens

### Colors

```typescript
import { colors } from "@staytunedllp/stayintro";

colors.primary[500]; // Base primary
colors.gray[900]; // Text
colors.success[500]; // Success
colors.error[500]; // Error
```

**CSS Variables:** `--intro-color-{palette}-{shade}`

### Spacing

```typescript
import { spacing } from "@staytunedllp/stayintro";

spacing[4]; // "1rem" (16px)
spacing[8]; // "2rem" (32px)
```

**CSS Variables:** `--intro-spacing-{key}`

### Typography

```typescript
import { typography } from "@staytunedllp/stayintro";

typography.fonts.sans; // Inter, system fonts
typography.fonts.mono; // Fira Code, Monaco
typography.fontSizes.base; // "1rem"
typography.fontWeights.medium; // "500"
```

**CSS Variables:** `--intro-font-{type}-{key}`

## SDUI Integration

```typescript
import { createIntroRegistry } from "@staytunedllp/stayintro";
import { createSchemaRenderer } from "@staytunedllp/stayfront/sdui";

const registry = createIntroRegistry();
const renderer = createSchemaRenderer(registry);

const html = renderer.renderSchema(schema, context);
```

### Available SDUI Blocks

| Block Type  | Component |
| ----------- | --------- |
| `ui.button` | Button    |
| `ui.input`  | Input     |
| `ui.card`   | Card      |
| `ui.text`   | Text      |
| `ui.stack`  | Stack     |
| `ui.grid`   | Grid      |
| `ui.alert`  | Alert     |
| `ui.badge`  | Badge     |
| `ui.modal`  | Modal     |

## Primitives

### Box

```typescript
import { Box } from "@staytunedllp/stayintro";

Box.render(
  { padding: "4", background: "gray-100", borderRadius: "md" },
  "Content",
);
```

### Stack

```typescript
import { Stack } from "@staytunedllp/stayintro";

Stack.render(
  { direction: "vertical", gap: "4", align: "center" },
  child1 + child2,
);
```

### Grid

```typescript
import { Grid } from "@staytunedllp/stayintro";

Grid.render({ columns: 3, gap: "4", responsive: true }, children);
```

## Components

### Button

```typescript
import { Button } from "@staytunedllp/stayintro";

Button.render({
  label: "Submit",
  variant: "primary", // primary | secondary | ghost | danger
  size: "md", // sm | md | lg
  disabled: false,
  loading: false,
});
```

### Input

```typescript
import { Input } from "@staytunedllp/stayintro";

Input.render({
  name: "email",
  type: "email",
  placeholder: "Enter email",
  size: "md",
  error: false,
  required: true,
});
```

### Card

```typescript
import { Card } from "@staytunedllp/stayintro";

Card.render(
  {
    title: "Card Title",
    variant: "elevated", // elevated | outlined | filled
    padding: "4",
  },
  content,
);
```

## Theming

```typescript
import { createTheme, defaultTheme, darkTheme } from "@staytunedllp/stayintro";

const customTheme = createTheme({
  colors: {
    primary: { 500: "#ff6b35" },
  },
  fonts: {
    sans: "Custom Font, sans-serif",
  },
});

// Use with registry
const registry = createIntroRegistry(darkTheme);
```

## Token CSS Variable Reference

| Category     | Variable Pattern                       |
| ------------ | -------------------------------------- |
| Colors       | `--intro-color-{palette}-{50-900}`     |
| Spacing      | `--intro-spacing-{0-24}`               |
| Fonts        | `--intro-font-{sans\|mono}`            |
| Font Sizes   | `--intro-font-size-{xs-5xl}`           |
| Font Weights | `--intro-font-weight-{thin-extrabold}` |
| Shadows      | `--intro-shadow-{sm-2xl}`              |
| Radii        | `--intro-radius-{sm-full}`             |
| Duration     | `--intro-duration-{fast-slower}`       |
