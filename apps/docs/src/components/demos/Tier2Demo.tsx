import React, { useState } from "react";
import { Button } from "@vyre/react";
import { Popover } from "@vyre/react";
import {
  DropdownMenu, DropdownItem, DropdownSeparator, DropdownLabel,
  DropdownCheckboxItem, DropdownRadioGroup, DropdownRadioItem, DropdownSub,
} from "@vyre/react";
import { Alert, AlertDialog } from "@vyre/react";

// ── Popover demos ─────────────────────────────────────────────

export function PopoverBasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="secondary">Open Popover</Button>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "0.875rem" }}>Popover title</p>
          <p style={{ margin: 0, fontSize: "0.8125rem", opacity: 0.7 }}>
            This is popover content. You can put anything here — forms, lists, actions.
          </p>
          <Button size="sm" variant="ghost" style={{ alignSelf: "flex-end" }} onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </Popover>
    </div>
  );
}

export function PopoverPlacementDemo() {
  const placements = [
    "top-start", "top", "top-end",
    "bottom-start", "bottom", "bottom-end",
    "left-start", "left", "left-end",
    "right-start", "right", "right-end",
  ] as const;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", padding: "32px 16px" }}>
      {placements.map((p) => (
        <Popover
          key={p}
          placement={p}
          trigger={<Button variant="secondary" size="sm" style={{ fontSize: "0.75rem" }}>{p}</Button>}
        >
          <p style={{ margin: 0, fontSize: "0.8125rem" }}>Placement: <strong>{p}</strong></p>
        </Popover>
      ))}
    </div>
  );
}

// ── DropdownMenu demos ────────────────────────────────────────

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 10l1.5-1.5L10 2l2 2-6.5 6.5L4 12 2 10z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 4h8M5 4V3h4v1M5 6v5M9 6v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <circle cx="11" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4.5 6.1l5-2.6M4.5 7.9l5 2.6" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

export function DropdownBasicDemo() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "32px 0" }}>
      <DropdownMenu trigger={<Button variant="secondary">Actions</Button>}>
        <DropdownLabel>File</DropdownLabel>
        <DropdownItem icon={<EditIcon />} shortcut="⌘E" onSelect={() => setLast("Edit")}>Edit</DropdownItem>
        <DropdownItem icon={<CopyIcon />} shortcut="⌘D" onSelect={() => setLast("Duplicate")}>Duplicate</DropdownItem>
        <DropdownSub trigger="Share" icon={<ShareIcon />}>
          <DropdownItem onSelect={() => setLast("Share via Email")}>Email</DropdownItem>
          <DropdownItem onSelect={() => setLast("Copy link")}>Copy link</DropdownItem>
        </DropdownSub>
        <DropdownSeparator />
        <DropdownItem variant="danger" icon={<TrashIcon />} onSelect={() => setLast("Delete")}>Delete</DropdownItem>
      </DropdownMenu>
      {last && (
        <p style={{ margin: 0, fontSize: "0.8125rem", opacity: 0.6 }}>
          Last action: <strong>{last}</strong>
        </p>
      )}
    </div>
  );
}

export function DropdownCheckboxDemo() {
  const [states, setStates] = useState({ toolbar: true, status: false, panel: true });
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <DropdownMenu trigger={<Button variant="secondary">View</Button>}>
        <DropdownLabel>Toggle panels</DropdownLabel>
        <DropdownSeparator />
        <DropdownCheckboxItem
          checked={states.toolbar}
          onCheckedChange={(v) => setStates((s) => ({ ...s, toolbar: v }))}
        >Toolbar</DropdownCheckboxItem>
        <DropdownCheckboxItem
          checked={states.status}
          onCheckedChange={(v) => setStates((s) => ({ ...s, status: v }))}
        >Status Bar</DropdownCheckboxItem>
        <DropdownCheckboxItem
          checked={states.panel}
          onCheckedChange={(v) => setStates((s) => ({ ...s, panel: v }))}
        >Side Panel</DropdownCheckboxItem>
      </DropdownMenu>
    </div>
  );
}

export function DropdownRadioDemo() {
  const [theme, setTheme] = useState("system");
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <DropdownMenu trigger={<Button variant="secondary">Theme: {theme}</Button>}>
        <DropdownLabel>Appearance</DropdownLabel>
        <DropdownSeparator />
        <DropdownRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownRadioItem value="light">Light</DropdownRadioItem>
          <DropdownRadioItem value="dark">Dark</DropdownRadioItem>
          <DropdownRadioItem value="system">System</DropdownRadioItem>
        </DropdownRadioGroup>
      </DropdownMenu>
    </div>
  );
}

export function DropdownEndDemo() {
  return (
    <div style={{ display: "flex", gap: 24, justifyContent: "center", padding: "32px 0" }}>
      <DropdownMenu placement="bottom-start" trigger={<Button variant="secondary" size="sm">bottom-start</Button>}>
        <DropdownItem onSelect={() => {}}>Item one</DropdownItem>
        <DropdownItem onSelect={() => {}}>Item two</DropdownItem>
      </DropdownMenu>
      <DropdownMenu placement="bottom-end" trigger={<Button variant="secondary" size="sm">bottom-end</Button>}>
        <DropdownItem onSelect={() => {}}>Item one</DropdownItem>
        <DropdownItem onSelect={() => {}}>Item two</DropdownItem>
      </DropdownMenu>
    </div>
  );
}

// ── Alert demos ───────────────────────────────────────────────

export function AlertVariantsDemo() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const variants = ["info", "success", "warning", "danger"] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {variants.map((v) =>
        dismissed.includes(v) ? null : (
          <Alert
            key={v}
            variant={v}
            title={v.charAt(0).toUpperCase() + v.slice(1)}
            onClose={() => setDismissed((p) => [...p, v])}
          >
            {v === "info"    && "Your export is being prepared. We'll notify you when it's ready."}
            {v === "success" && "Changes saved successfully. All team members have been notified."}
            {v === "warning" && "You're approaching your storage limit. Consider upgrading your plan."}
            {v === "danger"  && "Failed to connect to the server. Please check your network settings."}
          </Alert>
        )
      )}
      {dismissed.length === variants.length && (
        <Button variant="ghost" size="sm" onClick={() => setDismissed([])}>Reset</Button>
      )}
    </div>
  );
}

export function AlertNoTitleDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert variant="info">
        Your session will expire in 5 minutes. Save your work to avoid losing changes.
      </Alert>
      <Alert variant="warning">
        This feature is in beta and may change without notice.
      </Alert>
    </div>
  );
}

export function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "24px 0" }}>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete workspace</Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete workspace?"
        description="This will permanently delete the workspace and all its projects and data. This action cannot be undone."
        variant="danger"
        confirmLabel="Delete workspace"
        onConfirm={() => setResult("Confirmed — workspace deleted")}
        onCancel={() => setResult("Cancelled")}
      />
      {result && (
        <p style={{ margin: 0, fontSize: "0.8125rem", opacity: 0.6 }}>{result}</p>
      )}
    </div>
  );
}

export function AlertDialogVariantsDemo() {
  const [active, setActive] = useState<"danger" | "warning" | "info" | null>(null);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", padding: "24px 0" }}>
      <Button variant="danger"    size="sm" onClick={() => setActive("danger")}>Danger</Button>
      <Button variant="secondary" size="sm" onClick={() => setActive("warning")}>Warning</Button>
      <Button variant="ghost"     size="sm" onClick={() => setActive("info")}>Info</Button>
      <AlertDialog
        open={active !== null}
        onOpenChange={(o) => { if (!o) setActive(null); }}
        title={active === "danger" ? "Delete item?" : active === "warning" ? "Proceed with caution?" : "Confirm action"}
        description={
          active === "danger"  ? "This action is permanent and cannot be reversed." :
          active === "warning" ? "This may affect other users in your workspace." :
          "Are you sure you want to proceed with this action?"
        }
        variant={active ?? "info"}
        confirmLabel={active === "danger" ? "Delete" : "Confirm"}
      />
    </div>
  );
}
