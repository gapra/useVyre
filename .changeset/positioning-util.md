---
"@usevyre/react": patch
"@usevyre/vue": patch
---

Internal: extract the shared portal dropdown positioning (anchor rect → below/flip-above placement + scroll/resize tracking) into a `usePortalPosition` helper used by Combobox and Select. No behavior or API change; removes duplicated logic across the two components in each framework.
