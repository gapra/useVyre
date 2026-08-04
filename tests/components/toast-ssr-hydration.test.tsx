/**
 * Regression guard: ToastProvider must be SSR-safe.
 *
 * The toast viewport is portalled into document.body. Gating that portal on
 * `typeof document !== "undefined"` is NOT enough: the server emits no
 * viewport, but the client's FIRST render emits one, so React sees a tree that
 * disagrees with the server HTML → hydration mismatch, and consumers hit
 * "Cannot read properties of null (reading 'parentNode')".
 *
 * The fix mounts the portal only after the first effect, so the server pass and
 * the first client pass produce identical output. We assert exactly that:
 * renderToString emits no viewport, and hydrating that markup logs no error.
 */
import { describe, it, expect, beforeAll, vi } from "vitest";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "@testing-library/react";
import React from "react";

const ROOT = process.cwd();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let R: any;
beforeAll(async () => {
  R = await import(resolve(ROOT, "packages/react/dist/index.js"));
});

describe("ToastProvider — SSR / hydration", () => {
  it("server render emits no portal viewport", () => {
    const html = renderToString(
      <R.ToastProvider>
        <p>app</p>
      </R.ToastProvider>,
    );
    expect(html).toContain("app");
    expect(html).not.toContain("vyre-toast-viewport");
  });

  it("hydrating the server HTML logs no mismatch error", async () => {
    const html = renderToString(
      <R.ToastProvider>
        <p>app</p>
      </R.ToastProvider>,
    );

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const errors: unknown[] = [];
    const spy = vi
      .spyOn(console, "error")
      .mockImplementation((...args) => errors.push(args[0]));

    await act(async () => {
      hydrateRoot(
        container,
        <R.ToastProvider>
          <p>app</p>
        </R.ToastProvider>,
      );
    });

    spy.mockRestore();

    const mismatch = errors.filter((e) =>
      /hydrat|did not match|parentNode/i.test(String(e)),
    );
    expect(mismatch).toEqual([]);

    // …and after mount the viewport DOES exist, so the fix didn't just delete it.
    expect(document.querySelector(".vyre-toast-viewport")).not.toBeNull();
  });
});
