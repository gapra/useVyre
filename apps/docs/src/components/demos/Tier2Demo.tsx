import React, { useState } from "react";
import { Button } from "@vyre/react";
import { Popover } from "@vyre/react";
import {
  DropdownMenu, DropdownItem, DropdownSeparator, DropdownLabel,
  DropdownCheckboxItem, DropdownRadioGroup, DropdownRadioItem, DropdownSub,
} from "@vyre/react";
import { Alert, AlertDialog } from "@vyre/react";
import { Sheet, SheetHeader, SheetBody, SheetFooter } from "@vyre/react";
import { Breadcrumb, BreadcrumbItem } from "@vyre/react";
import { Pagination } from "@vyre/react";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableCaption } from "@vyre/react";
import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandDialog,
} from "@vyre/react";

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

// ── Sheet demos ───────────────────────────────────────────────

export function SheetBasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open Sheet</Button>
      <Sheet open={open} onClose={() => setOpen(false)} side="right">
        <SheetHeader>
          <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>Edit profile</h2>
          <p style={{ margin: "4px 0 0", fontSize: "0.875rem", opacity: 0.6 }}>
            Make changes to your profile information.
          </p>
        </SheetHeader>
        <SheetBody>
          <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.7 }}>
            Form content goes here. The sheet scrolls independently if content overflows.
          </p>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setOpen(false)}>Save changes</Button>
        </SheetFooter>
      </Sheet>
    </div>
  );
}

export function SheetSidesDemo() {
  const [side, setSide] = useState<"right" | "left" | "top" | "bottom" | null>(null);
  const sides = ["right", "left", "top", "bottom"] as const;
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", padding: "24px 0" }}>
      {sides.map((s) => (
        <Button key={s} variant="secondary" size="sm" onClick={() => setSide(s)}>
          {s}
        </Button>
      ))}
      {side && (
        <Sheet open={true} onClose={() => setSide(null)} side={side}>
          <SheetHeader>
            <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
              Sheet — {side}
            </h2>
          </SheetHeader>
          <SheetBody>
            <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.7 }}>
              Slides in from the {side}.
            </p>
          </SheetBody>
          <SheetFooter>
            <Button variant="secondary" onClick={() => setSide(null)}>Close</Button>
          </SheetFooter>
        </Sheet>
      )}
    </div>
  );
}

// ── Breadcrumb demos ──────────────────────────────────────────

export function BreadcrumbBasicDemo() {
  return (
    <div style={{ padding: "24px 0" }}>
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Components</BreadcrumbItem>
        <BreadcrumbItem current>Breadcrumb</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export function BreadcrumbCustomSeparatorDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "24px 0" }}>
      <Breadcrumb separator="›">
        <BreadcrumbItem href="#">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="#">Settings</BreadcrumbItem>
        <BreadcrumbItem current>Profile</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb separator="·">
        <BreadcrumbItem href="#">Docs</BreadcrumbItem>
        <BreadcrumbItem href="#">API</BreadcrumbItem>
        <BreadcrumbItem current>Reference</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

// ── Pagination demos ──────────────────────────────────────────

export function PaginationBasicDemo() {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 0" }}>
      <Pagination page={page} totalPages={10} onPageChange={setPage} />
      <p style={{ margin: 0, fontSize: "0.8125rem", opacity: 0.6 }}>Page {page} of 10</p>
    </div>
  );
}

export function PaginationManyPagesDemo() {
  const [page, setPage] = useState(7);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 0" }}>
      <Pagination page={page} totalPages={20} onPageChange={setPage} siblings={2} />
      <p style={{ margin: 0, fontSize: "0.8125rem", opacity: 0.6 }}>Page {page} of 20 · siblings=2</p>
    </div>
  );
}

export function PaginationInfoDemo() {
  const [page, setPage] = useState(1);
  const totalItems = 98;
  const pageSize   = 10;
  const totalPages = Math.ceil(totalItems / pageSize);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "24px 0" }}>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showInfo
        totalItems={totalItems}
        pageSize={pageSize}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showInfo
        showEdges={false}
        totalItems={totalItems}
        pageSize={pageSize}
      />
    </div>
  );
}

// ── Table demos ───────────────────────────────────────────────

const users = [
  { id: 1, name: "Alice Johnson", role: "Admin",    email: "alice@example.com",  status: "Active"   },
  { id: 2, name: "Bob Smith",     role: "Editor",   email: "bob@example.com",    status: "Active"   },
  { id: 3, name: "Carol White",   role: "Viewer",   email: "carol@example.com",  status: "Inactive" },
  { id: 4, name: "Dave Brown",    role: "Editor",   email: "dave@example.com",   status: "Active"   },
];

export function TableBasicDemo() {
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(null);
  const sorted = [...users].sort((a, b) =>
    sortDir === "asc" ? a.name.localeCompare(b.name) :
    sortDir === "desc" ? b.name.localeCompare(a.name) : 0
  );
  const toggleSort = () => setSortDir(d => d === "asc" ? "desc" : d === "desc" ? null : "asc");
  return (
    <div style={{ overflowX: "auto", padding: "16px 0" }}>
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeader sortable sortDir={sortDir} onSort={toggleSort}>Name</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader align="center">Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell align="center">
                <span style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  background: u.status === "Active" ? "var(--color-success-subtle)" : "var(--color-neutral-100)",
                  color: u.status === "Active" ? "var(--color-success-text)" : "var(--color-neutral-500)",
                }}>{u.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>Team members — click Name to sort</TableCaption>
      </Table>
    </div>
  );
}

export function TableVariantsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "16px 0" }}>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: "0.8125rem", fontWeight: 600, opacity: 0.6 }}>Striped</p>
        <Table striped>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(0, 3).map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <p style={{ margin: "0 0 8px", fontSize: "0.8125rem", fontWeight: 600, opacity: 0.6 }}>Bordered + Compact</p>
        <Table bordered compact>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(0, 3).map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Command demos ─────────────────────────────────────────────

const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 1h5.5L11 3.5V13H3V1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M8.5 1v3H11" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1.5 13c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

export function CommandInlineDemo() {
  const [last, setLast] = useState<string | null>(null);
  return (
    <div style={{ padding: "24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
      <Command style={{ border: "1px solid var(--vyre-color-semantic-border)", borderRadius: "var(--vyre-radius-xl)", maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <CommandInput placeholder="Search commands..." />
        <CommandList style={{ maxHeight: 280 }}>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem icon={<FileIcon />} shortcut="⌘N" onSelect={() => setLast("New file")}>New file</CommandItem>
            <CommandItem icon={<SearchIcon />} shortcut="⌘F" onSelect={() => setLast("Find in files")}>Find in files</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem icon={<SettingsIcon />} shortcut="⌘," onSelect={() => setLast("Preferences")}>Preferences</CommandItem>
            <CommandItem icon={<UserIcon />} onSelect={() => setLast("Profile")}>Profile</CommandItem>
            <CommandItem disabled onSelect={() => setLast("Admin")}>Admin panel</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      {last && (
        <p style={{ margin: "0 auto", fontSize: "0.8125rem", opacity: 0.6 }}>
          Selected: <strong>{last}</strong>
        </p>
      )}
    </div>
  );
}

export function CommandDialogDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const select = (label: string) => { setLast(label); setOpen(false); };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "24px 0" }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open Command Palette
        <kbd style={{ marginLeft: 8, fontFamily: "monospace", fontSize: "0.75rem", opacity: 0.6 }}>⌘K</kbd>
      </Button>
      {last && (
        <p style={{ margin: 0, fontSize: "0.8125rem", opacity: 0.6 }}>
          Selected: <strong>{last}</strong>
        </p>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem icon={<FileIcon />} shortcut="⌘N" onSelect={() => select("New file")}>New file</CommandItem>
            <CommandItem icon={<SearchIcon />} shortcut="⌘F" onSelect={() => select("Find in files")}>Find in files</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem icon={<SettingsIcon />} shortcut="⌘," onSelect={() => select("Preferences")}>Preferences</CommandItem>
            <CommandItem icon={<UserIcon />} onSelect={() => select("Profile")}>Profile</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
