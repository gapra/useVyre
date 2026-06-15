---
"@usevyre/react": minor
"@usevyre/vue": minor
"@usevyre/ai-context": minor
---

RichTextEditor security: the editor renders `value` as raw HTML, which is a stored-XSS risk for untrusted content. It stays zero-dependency, so:

- New optional `sanitize: (html) => string` prop, applied on render-in **and** emit-out (so stored output is cleaned too). Pass your own sanitizer for untrusted HTML, e.g. `sanitize={(h) => DOMPurify.sanitize(h)}`.
- The `link` tool now always blocks `javascript:` / `data:` / `vbscript:` URLs, even without `sanitize`.
- Corrected the misleading "output is sanitised-friendly" note: `value` is raw HTML and untrusted content must be sanitized by the consumer.

React + Vue.
