---
"@usevyre/init": patch
"@usevyre/react": patch
"@usevyre/ai-context": patch
---

Security hardening (CodeQL):

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
