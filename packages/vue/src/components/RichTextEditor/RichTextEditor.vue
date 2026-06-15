<script setup lang="ts">
/**
 * @usevyre/vue — RichTextEditor
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  RichTextEditor (WYSIWYG, contentEditable)            │
 * │ Import:     import { RichTextEditor } from "@usevyre/vue"        │
 * │                                                                  │
 * │ CONTROLLED via v-model (HTML string). Zero dependencies —        │
 * │ native contentEditable + execCommand.                            │
 * │                                                                  │
 * │ Props:                                                           │
 * │   modelValue  = string (HTML, v-model)                           │
 * │   placeholder?= string                                           │
 * │   disabled?   = boolean                                          │
 * │   readOnly?   = boolean (no toolbar, not editable)               │
 * │   toolbar?    = RichTextTool[] (default = all)                   │
 * │   minHeight?  = string (CSS, default "10rem")                    │
 * │   sanitize?   = (html: string) => string                         │
 * │                                                                  │
 * │ SECURITY: modelValue is rendered as raw HTML. Sanitize untrusted │
 * │ HTML before binding it — e.g. :sanitize="DOMPurify.sanitize".    │
 * │ sanitize runs on render-in AND emit-out. The link tool blocks    │
 * │ javascript:/data:/vbscript: URLs regardless.                     │
 * │                                                                  │
 * │ Emits: update:modelValue (string)                                │
 * │ RichTextTool = "bold"|"italic"|"underline"|"strike"|"h1"|"h2"|   │
 * │   "h3"|"ul"|"ol"|"quote"|"code"|"link"|"clear"                   │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <RichTextEditor v-model="html" placeholder="Write…" />
 */

import { onMounted, ref, watch } from "vue";
import { cn } from "../../utils/cn";

export type RichTextTool =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "h1"
  | "h2"
  | "h3"
  | "ul"
  | "ol"
  | "quote"
  | "code"
  | "link"
  | "clear";

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    toolbar?: RichTextTool[];
    minHeight?: string;
    /**
     * Optional sanitizer applied on render-in and emit-out. The component is
     * zero-dependency by design and does NOT sanitize untrusted HTML on its own
     * — pass your own for untrusted content, e.g. :sanitize="DOMPurify.sanitize".
     */
    sanitize?: (html: string) => string;
    class?: string;
  }>(),
  {
    placeholder: "Write something…",
    disabled: false,
    readOnly: false,
    minHeight: "10rem",
  }
);

const emit = defineEmits<{ "update:modelValue": [html: string] }>();

function applySanitize(html: string) {
  return props.sanitize ? props.sanitize(html) : html;
}

/** Block script-bearing URL schemes (used by the link tool). */
function isUnsafeUrl(url: string): boolean {
  return /^\s*(javascript|data|vbscript):/i.test(url);
}

const DEFAULT_TOOLBAR: RichTextTool[] = [
  "bold", "italic", "underline", "strike",
  "h1", "h2", "h3", "ul", "ol", "quote", "code", "link", "clear",
];

const editorRef = ref<HTMLDivElement | null>(null);
const editable = () => !props.disabled && !props.readOnly;
const activeToolbar = () => props.toolbar ?? DEFAULT_TOOLBAR;

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

function emitChange() {
  if (editorRef.value) emit("update:modelValue", applySanitize(editorRef.value.innerHTML));
}

interface ToolDef {
  label: string;
  icon: string;
  run: () => void;
}

const TOOLS: Record<RichTextTool, ToolDef> = {
  bold:      { label: "Bold",              icon: "<b>B</b>",  run: () => exec("bold") },
  italic:    { label: "Italic",            icon: "<i>I</i>",  run: () => exec("italic") },
  underline: { label: "Underline",         icon: "<u>U</u>",  run: () => exec("underline") },
  strike:    { label: "Strikethrough",     icon: "<s>S</s>",  run: () => exec("strikeThrough") },
  h1:        { label: "Heading 1",         icon: "H1",        run: () => exec("formatBlock", "<h1>") },
  h2:        { label: "Heading 2",         icon: "H2",        run: () => exec("formatBlock", "<h2>") },
  h3:        { label: "Heading 3",         icon: "H3",        run: () => exec("formatBlock", "<h3>") },
  ul:        { label: "Bullet list",       icon: "&bull;&equiv;", run: () => exec("insertUnorderedList") },
  ol:        { label: "Numbered list",     icon: "1.&equiv;", run: () => exec("insertOrderedList") },
  quote:     { label: "Quote",             icon: "&ldquo;&rdquo;", run: () => exec("formatBlock", "<blockquote>") },
  code:      { label: "Code block",        icon: "&lt;/&gt;", run: () => exec("formatBlock", "<pre>") },
  link:      { label: "Link",              icon: "&#128279;", run: () => { const u = window.prompt("Link URL"); if (u && !isUnsafeUrl(u)) exec("createLink", u); } },
  clear:     { label: "Clear formatting",  icon: "&#9003;",   run: () => exec("removeFormat") },
};

function apply(def: ToolDef) {
  if (!editable()) return;
  editorRef.value?.focus();
  def.run();
  emitChange();
}

onMounted(() => {
  const next = applySanitize(props.modelValue);
  if (editorRef.value && editorRef.value.innerHTML !== next) {
    editorRef.value.innerHTML = next;
  }
});

watch(
  () => props.modelValue,
  (v) => {
    const el = editorRef.value;
    const next = applySanitize(v);
    if (el && el.innerHTML !== next) el.innerHTML = next;
  }
);
</script>

<template>
  <div
    :class="cn(
      'vyre-rte',
      disabled && 'vyre-rte--disabled',
      readOnly && 'vyre-rte--readonly',
      props.class,
    )"
  >
    <div
      v-if="!readOnly"
      class="vyre-rte__toolbar"
      role="toolbar"
      aria-label="Formatting"
    >
      <button
        v-for="t in activeToolbar()"
        :key="t"
        type="button"
        class="vyre-rte__tool"
        :title="TOOLS[t].label"
        :aria-label="TOOLS[t].label"
        :disabled="!editable()"
        @mousedown.prevent
        @click="apply(TOOLS[t])"
        v-html="TOOLS[t].icon"
      />
    </div>

    <div
      ref="editorRef"
      class="vyre-rte__content"
      :contenteditable="editable()"
      role="textbox"
      aria-multiline="true"
      :aria-label="placeholder"
      :data-placeholder="placeholder"
      :style="{ minHeight }"
      @input="emitChange"
      @blur="emitChange"
    />
  </div>
</template>
