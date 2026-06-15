# @usevyre/init

One-command setup for [useVyre](https://usevyre.com) in an **existing** React or
Vue project.

```bash
npx @usevyre/init
```

It will:

1. Detect your framework (React or Vue) and package manager.
2. Install `@usevyre/react` or `@usevyre/vue`.
3. Add the styles import to your app entry (`import "@usevyre/<fw>/styles"`) —
   one self-contained file with tokens + component styles.
4. Show you how to wrap your app with `ToastProvider` (React) / add
   `ToastViewport` (Vue).
5. Suggest setting up AI context for your coding agent.

## Options

```
--react | --vue     Choose the framework (otherwise auto-detected)
--ai <target>       Also set up AI context (claude | cursor | windsurf | copilot)
--dry-run           Show what would happen without changing anything
--help              Show help
```

It only ever inserts a single import line, and is safe to re-run (idempotent).
For a new project, scaffold with your framework's tool first (e.g.
`npm create vite@latest`), then run `npx @usevyre/init`.
