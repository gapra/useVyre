import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom doesn't implement scrollIntoView; components that scroll an active
// option into view (Select, Combobox) call it legitimately. Stub it so the
// test exercises real behavior instead of crashing on an env gap.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Unmount React trees between tests so queries never see stale DOM.
afterEach(() => cleanup());
