/**
 * Behavior contract — RichTextEditor security hardening.
 *
 * RTE renders `value` as raw HTML (innerHTML), which is a stored-XSS vector if an
 * app renders untrusted HTML. Fix keeps the component zero-dependency: an opt-in
 * `sanitize` hook (applied on render-in AND emit-out) plus an always-on link
 * guard that blocks javascript:/data:/vbscript: URLs.
 *
 * Renders the BUILT @usevyre/react, matching the rest of the components suite.
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { resolve } from "node:path";

const ROOT = process.cwd();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

// jsdom doesn't implement execCommand; spy so link-tool behavior is observable.
let execSpy: ReturnType<typeof vi.fn>;
beforeEach(() => {
  execSpy = vi.fn();
  // @ts-expect-error jsdom lacks execCommand
  document.execCommand = execSpy;
});
afterEach(() => {
  vi.restoreAllMocks();
});

function editorEl(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[contenteditable="true"]');
}

describe("RichTextEditor — security", () => {
  it("renders value as-is when no sanitize prop is given (backward compatible)", () => {
    const { container } = render(
      <R.RichTextEditor value="<p>hello <b>world</b></p>" onChange={() => {}} />,
    );
    expect(editorEl(container)?.innerHTML).toContain("<b>world</b>");
  });

  it("passes value through sanitize before rendering", () => {
    // Illustrative sanitizer for the test. Matches the closing tag with optional
    // whitespace (</script >) and loops until no <script…> remains, so it does not
    // leave a partial tag behind. (Real apps should pass DOMPurify via `sanitize`.)
    const sanitize = (html: string) => {
      let prev;
      let out = html;
      do {
        prev = out;
        out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
      } while (out !== prev);
      return out;
    };
    const { container } = render(
      <R.RichTextEditor
        value="<p>ok</p><script>alert(1)</script>"
        onChange={() => {}}
        sanitize={sanitize}
      />,
    );
    const html = editorEl(container)?.innerHTML ?? "";
    expect(html).toContain("<p>ok</p>");
    expect(html).not.toContain("<script>");
  });

  it("emits sanitized HTML through onChange", () => {
    const onChange = vi.fn();
    // Illustrative sanitizer for the test. Matches the closing tag with optional
    // whitespace (</script >) and loops until no <script…> remains, so it does not
    // leave a partial tag behind. (Real apps should pass DOMPurify via `sanitize`.)
    const sanitize = (html: string) => {
      let prev;
      let out = html;
      do {
        prev = out;
        out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
      } while (out !== prev);
      return out;
    };
    const { container } = render(
      <R.RichTextEditor value="<p>x</p>" onChange={onChange} sanitize={sanitize} />,
    );
    const el = editorEl(container)!;
    // simulate user-injected content then an input event
    el.innerHTML = "<p>x</p><script>evil()</script>";
    fireEvent.input(el);
    expect(onChange).toHaveBeenCalled();
    const emitted = onChange.mock.calls.at(-1)?.[0] as string;
    expect(emitted).not.toContain("<script>");
  });

  it("link tool blocks javascript: URLs (no createLink with dangerous scheme)", () => {
    vi.spyOn(window, "prompt").mockReturnValue("javascript:alert(document.cookie)");
    render(<R.RichTextEditor value="" onChange={() => {}} toolbar={["link"]} />);
    fireEvent.click(screen.getByRole("button", { name: /link/i }));
    const createLinkCalls = execSpy.mock.calls.filter((c) => c[0] === "createLink");
    expect(createLinkCalls).toHaveLength(0);
  });

  it("link tool still allows a normal https URL", () => {
    vi.spyOn(window, "prompt").mockReturnValue("https://example.com");
    render(<R.RichTextEditor value="" onChange={() => {}} toolbar={["link"]} />);
    fireEvent.click(screen.getByRole("button", { name: /link/i }));
    const createLinkCalls = execSpy.mock.calls.filter((c) => c[0] === "createLink");
    expect(createLinkCalls).toHaveLength(1);
    expect(createLinkCalls[0][2]).toBe("https://example.com");
  });
});
