import { useState } from "react";
import {
  Select,
  Tabs, TabList, Tab, TabPanels, TabPanel,
  Tooltip, Button,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@vyre/react";

// ── Select ────────────────────────────────────────────────────
const frameworks = [
  { value: "react",   label: "React" },
  { value: "vue",     label: "Vue" },
  { value: "svelte",  label: "Svelte" },
  { value: "angular", label: "Angular", disabled: true },
];

export function SelectBasicDemo() {
  const [val, setVal] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
      <Select
        options={frameworks}
        value={val}
        onChange={setVal}
        placeholder="Select a framework…"
      />
      {val && <span style={{ fontSize: 13, opacity: 0.6 }}>Selected: {val}</span>}
    </div>
  );
}

export function SelectSizesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
      <Select options={frameworks} placeholder="Small" size="sm" />
      <Select options={frameworks} placeholder="Medium (default)" size="md" />
      <Select options={frameworks} placeholder="Large" size="lg" />
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────
export function TabsBasicDemo() {
  return (
    <Tabs defaultValue="overview" style={{ width: "100%", maxWidth: 480 }}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="tokens">Tokens</Tab>
        <Tab value="usage" disabled>Usage</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="overview">
          <p style={{ margin: "16px 0 0", fontSize: "0.875rem", opacity: 0.75 }}>
            useVyre is an AI-native design system that minimises hallucinations when AI writes
            frontend code.
          </p>
        </TabPanel>
        <TabPanel value="tokens">
          <p style={{ margin: "16px 0 0", fontSize: "0.875rem", opacity: 0.75 }}>
            Design tokens are defined in <code>packages/tokens</code> and compiled to CSS custom
            properties with light and dark theme variants.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export function TabsControlledDemo() {
  const [tab, setTab] = useState("react");
  return (
    <Tabs value={tab} onChange={setTab} style={{ width: "100%", maxWidth: 480 }}>
      <TabList>
        <Tab value="react">React</Tab>
        <Tab value="vue">Vue</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="react">
          <p style={{ margin: "16px 0 0", fontSize: "0.875rem", opacity: 0.75 }}>
            Import from <code>@vyre/react</code>. All components are typed with TypeScript.
          </p>
        </TabPanel>
        <TabPanel value="vue">
          <p style={{ margin: "16px 0 0", fontSize: "0.875rem", opacity: 0.75 }}>
            Import from <code>@vyre/vue</code>. Uses <code>v-model</code> for controlled state.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

// ── Toast ─────────────────────────────────────────────────────
interface InlineToast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

export function ToastDemo() {
  const [toasts, setToasts] = useState<InlineToast[]>([]);

  function addToast(input: Omit<InlineToast, "id">) {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...input, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div style={{ position: "relative", width: "100%", minHeight: 160 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => addToast({ title: "Changes saved" })}>
          Default
        </Button>
        <Button variant="secondary" onClick={() => addToast({ title: "Saved!", description: "Your changes have been saved.", variant: "success" })}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => addToast({ title: "Heads up", description: "This action may take a moment.", variant: "warning" })}>
          Warning
        </Button>
        <Button variant="secondary" onClick={() => addToast({ title: "Something failed", description: "Please try again.", variant: "danger" })}>
          Danger
        </Button>
      </div>

      {/* Toast stack rendered inline within preview */}
      <div style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: "22rem",
        pointerEvents: "none",
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`vyre-toast vyre-toast--${t.variant ?? "default"}`}
            role="alert"
            data-variant={t.variant}
            style={{ pointerEvents: "all", position: "relative" }}
          >
            <div className="vyre-toast__content">
              {t.title && <p className="vyre-toast__title">{t.title}</p>}
              {t.description && <p className="vyre-toast__description">{t.description}</p>}
            </div>
            <button
              className="vyre-toast__close"
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              style={{ pointerEvents: "all" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────
export function TooltipPlacementDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", padding: "24px 0" }}>
      <Tooltip content="Appears above" placement="top">
        <Button variant="secondary">Top</Button>
      </Tooltip>
      <Tooltip content="Appears below" placement="bottom">
        <Button variant="secondary">Bottom</Button>
      </Tooltip>
      <Tooltip content="Appears left" placement="left">
        <Button variant="secondary">Left</Button>
      </Tooltip>
      <Tooltip content="Appears right" placement="right">
        <Button variant="secondary">Right</Button>
      </Tooltip>
    </div>
  );
}

export function TooltipDelayDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Tooltip content="No delay" delay={0}>
        <Button variant="secondary">Instant</Button>
      </Tooltip>
      <Tooltip content="300ms delay (default)" delay={300}>
        <Button variant="secondary">Default</Button>
      </Tooltip>
      <Tooltip content="800ms delay" delay={800}>
        <Button variant="secondary">Slow</Button>
      </Tooltip>
    </div>
  );
}

// ── Accordion ─────────────────────────────────────────────────
export function AccordionSingleDemo() {
  return (
    <Accordion type="single" defaultValue="item-1" style={{ width: "100%", maxWidth: 480 }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is useVyre?</AccordionTrigger>
        <AccordionContent>
          useVyre is an AI-native design system built to minimise hallucinations when AI writes
          frontend code. It ships tokens, React, and Vue 3 components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Which frameworks are supported?</AccordionTrigger>
        <AccordionContent>
          React and Vue 3 are supported out of the box with identical APIs and shared CSS tokens.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it published to npm?</AccordionTrigger>
        <AccordionContent>
          Not yet — useVyre is currently in active development. Follow the GitHub repo for updates.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function AccordionMultipleDemo() {
  return (
    <Accordion type="multiple" defaultValue={["item-1", "item-2"]} style={{ width: "100%", maxWidth: 480 }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Open by default</AccordionTrigger>
        <AccordionContent>
          This item is open by default because its value is included in <code>defaultValue</code>.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Also open by default</AccordionTrigger>
        <AccordionContent>
          Multiple items can be open simultaneously when <code>type="multiple"</code>.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Closed by default</AccordionTrigger>
        <AccordionContent>
          Click to open. The other two items stay open.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
