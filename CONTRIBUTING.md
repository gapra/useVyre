# Contributing to useVyre

Thank you for your interest in contributing! useVyre is an AI-native design system built for both humans and AI coding agents. Every contribution — big or small — helps make frontend development more consistent and hallucination-free.

---

## Table of Contents

- [Bug Reports & Feature Requests](#bug-reports--feature-requests)
- [Dev Environment Setup](#dev-environment-setup)
- [Code Style & Conventions](#code-style--conventions)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## Bug Reports & Feature Requests

Use [GitHub Issues](https://github.com/gapra/useVyre/issues) to report bugs or propose new features.

**For bug reports, include:**
- What you expected to happen
- What actually happened
- Minimal reproduction (code snippet or repo link)
- Environment: Node version, package version, framework (React/Vue/other)

**For feature requests, include:**
- The problem you're trying to solve
- Your proposed solution or API idea
- Any alternatives you've considered

---

## Dev Environment Setup

**Requirements:**
- Node.js >= 18.0.0
- pnpm >= 9.0.0

```bash
# Clone the repo
git clone https://github.com/gapra/useVyre.git
cd useVyre

# Install dependencies
pnpm install

# Build tokens first (other packages depend on it)
pnpm --filter @usevyre/tokens build

# Run all packages in dev mode
pnpm dev

# Or run only the docs site
pnpm dev:docs
```

**Repo structure:**
```
packages/
  tokens/           # DTCG design tokens → CSS variables, JS/TS, JSON
  react/            # React + TypeScript components
  vue/              # Vue components
  ai-context/       # AI context blocks for components
  mcp-server/       # MCP server for AI agent integration
  eslint-plugin/    # ESLint rules for useVyre conventions
  prompt-templates/ # Prompt templates for AI coding agents
  ...
apps/
  docs/             # Documentation site
```

---

## Code Style & Conventions

- **TypeScript** for all packages — no `any` unless absolutely necessary
- **Semantic tokens only** — never use raw color values (`#fff`, `rgb(...)`) in components; always reference a CSS variable from `@usevyre/tokens`
- **`data-variant` API** — component variants must use `data-variant` attributes, not className-based variants
- **AI context blocks** — every new component must include an inline AI context block (see existing components for the pattern)
- **4px spacing grid** — all spacing values must use spacing tokens, not arbitrary pixel values
- **No runtime magic** — prefer CSS variables and static structures over dynamic style injection

Run typecheck before submitting:
```bash
pnpm typecheck
```

---

## Submitting a Pull Request

**Branch naming:**
```
feat/short-description
fix/short-description
docs/short-description
refactor/short-description
```

**Before opening a PR:**
1. Fork the repo and create your branch from `main`
2. Run `pnpm install` and `pnpm --filter @usevyre/tokens build`
3. Make your changes and run `pnpm typecheck`
4. If you're adding a new component or token, update the docs in `apps/docs`
5. Add a changeset if your change affects a published package:
   ```bash
   pnpm changeset
   ```

**Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add Button loading state
fix: correct spacing token in Card component
docs: update tokens API reference
```

**PR description should include:**
- What changed and why
- Screenshots or code snippets if relevant
- Any breaking changes

All PRs are reviewed before merging. We aim to respond within a few days.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
