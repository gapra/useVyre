# @usevyre/init

## 0.1.1

### Patch Changes

- 3fa4a4c: Security hardening (CodeQL):

  - **@usevyre/init**: build the install command as an argv array and run it with
    `execFileSync` instead of `execSync` on an interpolated string — no shell is
    involved, so package-manager/framework values can never be interpreted as
    shell commands. The `--ai` flag is now validated against the known targets
    before use.
  - **@usevyre/react**: replace the `Form` email-validation regex with a
    linear-time pattern (avoids polynomial ReDoS on crafted input).
  - **@usevyre/ai-context**: the template-literal escape helper in the build
    script now escapes backslashes first, so input containing `\` is escaped
    correctly.

## 0.1.0

### Minor Changes

- 7cd2490: New package `@usevyre/init`: one-command setup for useVyre in an existing React or Vue project. `npx @usevyre/init` detects the framework + package manager, installs `@usevyre/react`/`@usevyre/vue`, inserts the self-contained styles import into your entry file (idempotent), and guides the ToastProvider and AI-context steps. Supports `--react`/`--vue`, `--ai <target>`, and `--dry-run`.
