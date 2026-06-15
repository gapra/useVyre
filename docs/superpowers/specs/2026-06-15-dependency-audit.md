# Dependency / Dependabot audit — 2026-06-15

GitHub reported ~33 Dependabot alerts. This is the triage and what was done.

## Key finding: published packages are clean

The runtime `dependencies` of every PUBLISHED package were checked. They are:

- `@usevyre/react`, `@usevyre/vue` → only `@usevyre/tokens`
- `@usevyre/mcp-server` → `@modelcontextprotocol/sdk`, `zod` (both clean — no advisories)
- other `@usevyre/*` → only sibling `@usevyre/*`

**No advisory touches a published runtime dependency.** A consumer running
`npm install @usevyre/react` (or any published package) receives ZERO of these
vulnerabilities — none ship in the published tarballs. Every alert is in
**dev / build / docs tooling**.

## Fixed in this pass

- **`vitest` 3.2.4 → 3.2.6** (root devDep, in-range `^3`). Clears the one
  **critical** advisory ("Vitest UI server arbitrary file read"). Dev/CI-only
  in practice, but the fix is free and in-range. Verified: 104/104 tests pass,
  full build clean.

Done surgically (root `package.json` + lockfile only) — no churn to published
packages' deps or formatting.

## Remaining — tracked, not done here

All remaining advisories are dev/build tooling and need **major** upgrades or
are transitive-under-astro. None affect published packages.

### 1. Astro (docs site — deployed to Vercel) — needs a major upgrade

`astro@4.16.19` is the latest 4.x; **there is no patched 4.x**. Every astro
advisory (1 high reflected-XSS, several moderate auth/URL) is patched only in
**5.x / 6.x**. The docs site is publicly deployed, so this is the most relevant
remaining item.

Scope of the migration (its own task):
- `astro@^4` → `astro@^6` (or `^5`), plus matching integrations
  `@astrojs/react@3 → 4` and `@astrojs/vue@4 → 5+`.
- No content collections in use (`apps/docs/src/content` absent) → avoids the
  biggest Astro 5 breaking change. Risk is moderate.
- Verify all 88 `.astro` pages build and the deployed site renders.

Recommend doing this as a dedicated branch with a full docs build + visual check.

### 2. Transitive dev-only (vite / esbuild / qs / hono / brace-expansion / devalue)

These come in under astro / vite dev server and are exploitable only against a
running dev server hit by a malicious site, or are pure dev-time. Low real risk
for this repo. Most will clear once astro (and thus its vite/esbuild) is bumped;
the rest are not worth forcing majors for on tooling that never ships.

## Principle

Fix what reduces real risk without destabilizing the project. The user-facing
surface (published packages) is already clean; the deployed docs site is the
one place worth a follow-up; dev tooling is hygiene.
