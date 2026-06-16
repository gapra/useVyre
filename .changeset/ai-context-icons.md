---
"@usevyre/ai-context": minor
---

Add an "Icons" section to the AI context: useVyre is icon-agnostic (ships no icons), so agents should import from a library (lucide-react / lucide-vue-next, or any) and pass the node to `icon` / `leftIcon` / `leftElement` — never invent a `@usevyre/icons` import or an `icon="name"` string. The guidance is included in every target (Claude, Cursor, Copilot, Windsurf, full-context), plus a short note on the components docs page.
