import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/vue";

// jsdom doesn't implement scrollIntoView; components that scroll an active
// option into view call it legitimately. Stub it so tests exercise real
// behavior instead of crashing on an env gap.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Unmount Vue trees between tests so queries never see stale DOM (and portaled
// content teleported to <body> is removed).
afterEach(() => cleanup());
