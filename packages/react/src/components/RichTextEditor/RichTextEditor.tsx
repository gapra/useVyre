/**
 * @usevyre/react — RichTextEditor
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  RichTextEditor (WYSIWYG, contentEditable)            │
 * │ Import:     import { RichTextEditor } from "@usevyre/react"      │
 * │                                                                  │
 * │ CONTROLLED. value is an HTML string; onChange gives next HTML.   │
 * │ Zero dependencies — native contentEditable + execCommand.        │
 * │                                                                  │
 * │ Props:                                                           │
 * │   value       = string (HTML, controlled)                        │
 * │   onChange    = (html: string) => void                           │
 * │   placeholder?= string (shown when empty)                        │
 * │   disabled?   = boolean (not editable, dimmed)                   │
 * │   readOnly?   = boolean (not editable, no toolbar)               │
 * │   toolbar?    = RichTextTool[] (which buttons; default = all)    │
 * │   minHeight?  = string (CSS, default "10rem")                    │
 * │   sanitize?   = (html: string) => string                         │
 * │                                                                  │
 * │ RichTextTool = "bold"|"italic"|"underline"|"strike"|             │
 * │   "h1"|"h2"|"h3"|"ul"|"ol"|"quote"|"code"|"link"|"clear"         │
 * │                                                                  │
 * │ Controlled: store value in state and set it in onChange.         │
 * │ SECURITY: value is rendered as raw HTML. Sanitize untrusted      │
 * │ HTML before passing it in — e.g. sanitize={DOMPurify.sanitize}.  │
 * │ sanitize runs on render-in AND emit-out. The link tool blocks    │
 * │ javascript:/data:/vbscript: URLs regardless.                     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [html, setHtml] = useState("<p>Hello <strong>world</strong></p>");
 * <RichTextEditor value={html} onChange={setHtml} placeholder="Write…" />
 */

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

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

export interface RichTextEditorProps extends BaseProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  toolbar?: RichTextTool[];
  minHeight?: string;
  /**
   * Optional sanitizer applied to the HTML on render (before it is shown) and on
   * emit (before onChange). The component is zero-dependency by design, so it
   * does NOT sanitize untrusted HTML on its own — pass your own sanitizer for
   * untrusted content, e.g. `sanitize={(h) => DOMPurify.sanitize(h)}`.
   */
  sanitize?: (html: string) => string;
}

/** Block script-bearing URL schemes (used by the link tool). */
function isUnsafeUrl(url: string): boolean {
  return /^\s*(javascript|data|vbscript):/i.test(url);
}

const DEFAULT_TOOLBAR: RichTextTool[] = [
  "bold",
  "italic",
  "underline",
  "strike",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "quote",
  "code",
  "link",
  "clear",
];

interface ToolDef {
  label: string;
  icon: React.ReactNode;
  run: () => void;
}

function exec(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export const RichTextEditor = React.forwardRef<
  HTMLDivElement,
  RichTextEditorProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Write something…",
      disabled = false,
      readOnly = false,
      toolbar = DEFAULT_TOOLBAR,
      minHeight = "10rem",
      sanitize,
      className,
      ...props
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const editable = !disabled && !readOnly;

    const applySanitize = useCallback(
      (html: string) => (sanitize ? sanitize(html) : html),
      [sanitize]
    );

    // Sync incoming value without clobbering caret while typing.
    useEffect(() => {
      const el = editorRef.current;
      const next = applySanitize(value);
      if (el && el.innerHTML !== next) {
        el.innerHTML = next;
      }
    }, [value, applySanitize]);

    const emit = useCallback(() => {
      if (editorRef.current) onChange(applySanitize(editorRef.current.innerHTML));
    }, [onChange, applySanitize]);

    const apply = useCallback(
      (fn: () => void) => {
        if (!editable) return;
        editorRef.current?.focus();
        fn();
        emit();
      },
      [editable, emit]
    );

    const tools: Record<RichTextTool, ToolDef> = {
      bold: { label: "Bold", icon: <b>B</b>, run: () => exec("bold") },
      italic: { label: "Italic", icon: <i>I</i>, run: () => exec("italic") },
      underline: {
        label: "Underline",
        icon: <u>U</u>,
        run: () => exec("underline"),
      },
      strike: {
        label: "Strikethrough",
        icon: <s>S</s>,
        run: () => exec("strikeThrough"),
      },
      h1: {
        label: "Heading 1",
        icon: <>H1</>,
        run: () => exec("formatBlock", "<h1>"),
      },
      h2: {
        label: "Heading 2",
        icon: <>H2</>,
        run: () => exec("formatBlock", "<h2>"),
      },
      h3: {
        label: "Heading 3",
        icon: <>H3</>,
        run: () => exec("formatBlock", "<h3>"),
      },
      ul: {
        label: "Bullet list",
        icon: <>•≡</>,
        run: () => exec("insertUnorderedList"),
      },
      ol: {
        label: "Numbered list",
        icon: <>1.≡</>,
        run: () => exec("insertOrderedList"),
      },
      quote: {
        label: "Quote",
        icon: <>&ldquo;&rdquo;</>,
        run: () => exec("formatBlock", "<blockquote>"),
      },
      code: {
        label: "Code block",
        icon: <>{"</>"}</>,
        run: () => exec("formatBlock", "<pre>"),
      },
      link: {
        label: "Link",
        icon: <>🔗</>,
        run: () => {
          const url = window.prompt("Link URL");
          if (url && !isUnsafeUrl(url)) exec("createLink", url);
        },
      },
      clear: {
        label: "Clear formatting",
        icon: <>⌫</>,
        run: () => exec("removeFormat"),
      },
    };

    return (
      <div
        ref={ref}
        className={cn(
          "vyre-rte",
          disabled && "vyre-rte--disabled",
          readOnly && "vyre-rte--readonly",
          className
        )}
        {...props}
      >
        {!readOnly && (
          <div className="vyre-rte__toolbar" role="toolbar" aria-label="Formatting">
            {toolbar.map((t) => {
              const def = tools[t];
              if (!def) return null;
              return (
                <button
                  key={t}
                  type="button"
                  className="vyre-rte__tool"
                  title={def.label}
                  aria-label={def.label}
                  disabled={!editable}
                  // Keep selection in the editor: don't let the button steal focus.
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => apply(def.run)}
                >
                  {def.icon}
                </button>
              );
            })}
          </div>
        )}

        <div
          ref={editorRef}
          className="vyre-rte__content"
          contentEditable={editable}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={placeholder}
          data-placeholder={placeholder}
          style={{ minHeight }}
          onInput={emit}
          onBlur={emit}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "VyreRichTextEditor";
