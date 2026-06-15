# @usevyre/react

> React + TypeScript components for the useVyre design system — AI-native, accessible, zero runtime styling.

[![npm](https://img.shields.io/npm/v/@usevyre/react)](https://www.npmjs.com/package/@usevyre/react)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](../../LICENSE)

## Installation

```bash
npm install @usevyre/tokens @usevyre/react
# or
pnpm add @usevyre/tokens @usevyre/react
```

## Setup

Import once at your app entry point:

```ts
// main.tsx
import "@usevyre/react/styles";  // tokens + component styles (one import)

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "@usevyre/react";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
```

## Usage

```tsx
import { Button, Badge, Card, CardHeader, CardBody, CardFooter } from "@usevyre/react";

export function ProfileCard() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <Badge variant="success" dot>Active</Badge>
      </CardHeader>
      <CardBody>
        <p>Ready to ship.</p>
      </CardBody>
      <CardFooter>
        <Button variant="accent">Save changes</Button>
      </CardFooter>
    </Card>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `Button` | `primary · secondary · ghost · accent · teal · danger` |
| `Badge` | `default · accent · teal · success · warning · danger` |
| `Card` | `default · elevated · outlined · ghost · accent` |
| `Input` / `Textarea` / `Field` | Form inputs with label, hint, and validation states |
| `Modal` | Dialog overlay with focus trap |
| `Select` | Accessible dropdown with keyboard navigation |
| `Tabs` | WAI-ARIA tab navigation |
| `Toast` / `useToast` | Toast notifications via context |
| `Tooltip` | Hover/focus tooltip with placement options |
| `Accordion` | Collapsible sections |
| `Avatar` | User avatar with image fallback and status dot |
| `Checkbox` / `Switch` / `Slider` | Form controls |
| `Popover` / `DropdownMenu` | Floating UI panels |
| `Alert` / `AlertDialog` | Inline and blocking alerts |
| `Sheet` | Slide-in panel overlay |
| `Sidebar` / `AppLayout` | Full app shell layout |
| `Command` | Command palette with search |
| `Calendar` / `DatePicker` | Date selection |
| `Table` | Data table |
| `Breadcrumb` / `Pagination` | Navigation |
| `Skeleton` / `Progress` / `Separator` | Utility components |
| `Text` / `Heading` / `Lead` / `Code` | Typography |

Full component docs → [usevyre.com/docs/getting-started](https://usevyre.com/docs/getting-started)

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## License

MIT © [Gapra](https://gapra.dev)
