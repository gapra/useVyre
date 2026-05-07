import React, { useState } from "react";
import { Button } from "@usevyre/react";
import { Popover } from "@usevyre/react";
import {
  DropdownMenu, DropdownItem, DropdownSeparator, DropdownLabel,
  DropdownCheckboxItem, DropdownRadioGroup, DropdownRadioItem, DropdownSub,
} from "@usevyre/react";
import { Alert, AlertDialog } from "@usevyre/react";
import { Sheet, SheetHeader, SheetBody, SheetFooter } from "@usevyre/react";
import { Breadcrumb, BreadcrumbItem } from "@usevyre/react";
import { Pagination } from "@usevyre/react";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableCaption } from "@usevyre/react";
import {
  Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandDialog,
} from "@usevyre/react";
import { Calendar, DatePicker } from "@usevyre/react";
import { Text, Heading, Lead, Code, Blockquote } from "@usevyre/react";
import {
  AppLayout, AppShell, AppBar, PageContent, SidebarTrigger,
  Sidebar, SidebarHeader, SidebarContent,
  SidebarSection, SidebarItem, SidebarFooter,
} from "@usevyre/react";

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

// ── Calendar demos ─────────────────────────────────────────────

export function CalendarSingleDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <Calendar mode="single" value={date} onChange={setDate} />
      {date && (
        <p style={{ fontSize: "13px", color: "var(--vyre-color-semantic-text-muted)" }}>
          Selected: {new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(date)}
        </p>
      )}
    </div>
  );
}

export function CalendarRangeDemo() {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <Calendar mode="range" value={range} onChange={setRange} />
      {range[0] && range[1] && (
        <p style={{ fontSize: "13px", color: "var(--vyre-color-semantic-text-muted)" }}>
          {new Intl.DateTimeFormat("default", { dateStyle: "medium" }).format(range[0])}
          {" – "}
          {new Intl.DateTimeFormat("default", { dateStyle: "medium" }).format(range[1])}
        </p>
      )}
    </div>
  );
}

export function CalendarTimeDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <Calendar mode="single" showTime value={date} onChange={setDate} />
      {date && (
        <p style={{ fontSize: "13px", color: "var(--vyre-color-semantic-text-muted)" }}>
          Selected: {new Intl.DateTimeFormat("default", { dateStyle: "long", timeStyle: "short" }).format(date)}
        </p>
      )}
    </div>
  );
}

export function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--vyre-color-semantic-text-muted)" }}>Single date</label>
        <DatePicker mode="single" value={date} onChange={setDate} placeholder="Pick a date" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--vyre-color-semantic-text-muted)" }}>Date range</label>
        <DatePicker mode="range" value={range} onChange={setRange} placeholder="Pick a range" />
      </div>
    </div>
  );
}

// ── Typography demos ───────────────────────────────────────────

export function TypographyHeadingDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Heading as="h1" size="3xl">The quick brown fox</Heading>
      <Heading as="h2" size="2xl">The quick brown fox</Heading>
      <Heading as="h3" size="xl">The quick brown fox</Heading>
      <Heading as="h4" size="lg">The quick brown fox</Heading>
      <Heading as="h5" size="md">The quick brown fox</Heading>
      <Heading as="h6" size="sm">The quick brown fox</Heading>
    </div>
  );
}

export function TypographyTextDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Lead>Lead text — introductory paragraph with slightly larger, muted text.</Lead>
      <Text>Default body text — the standard paragraph style.</Text>
      <Text color="muted">Muted text — used for secondary information.</Text>
      <Text color="accent">Accent text — draws attention to key content.</Text>
      <Text color="danger">Danger text — errors and destructive actions.</Text>
      <Text color="success">Success text — confirmations and positive outcomes.</Text>
      <Text weight="semibold">Semibold weight text.</Text>
      <Text mono>Monospace text — for technical values and code references.</Text>
      <Text size="xs" color="muted">Extra small text — captions and metadata.</Text>
    </div>
  );
}

export function TypographyCodeDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Text>
        Install the package: <Code>npm install @usevyre/react</Code>
      </Text>
      <Blockquote>
        Design is not just what it looks like and feels like. Design is how it works. — Steve Jobs
      </Blockquote>
      <Code block>{`import { Button } from "@usevyre/react";

export default function App() {
  return <Button variant="accent">Get started</Button>;
}`}</Code>
    </div>
  );
}

// ── Sidebar demos ──────────────────────────────────────────────

function HomeIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6.5L8 2l6 4.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 15V9h4v6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
}
function UsersIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 13.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 7a2.5 2.5 0 100-5M15 13.5c0-2.485-2.015-4.5-4.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function SettingsIcon2() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}
function BellIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a5 5 0 00-5 5v3l-1.5 2h13L13 9.5v-3a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
}

export function SidebarDemo() {
  const [active, setActive] = useState("dashboard");
  return (
    <div style={{ display: "flex", height: "320px", border: "1px solid var(--vyre-color-semantic-border)", borderRadius: "var(--vyre-radius-lg)", overflow: "hidden" }}>
      <Sidebar>
        <SidebarHeader title="My App" logo={<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--vyre-color-semantic-accent)"><rect width="24" height="24" rx="6"/><path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
        <SidebarContent>
          <SidebarSection label="Main">
            <SidebarItem icon={<HomeIcon />} active={active === "dashboard"} onClick={() => setActive("dashboard")}>Dashboard</SidebarItem>
            <SidebarItem icon={<UsersIcon />} active={active === "users"} onClick={() => setActive("users")}>Users</SidebarItem>
            <SidebarItem icon={<BellIcon />} badge={3} active={active === "notif"} onClick={() => setActive("notif")}>Notifications</SidebarItem>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem icon={<SettingsIcon2 />} active={active === "settings"} onClick={() => setActive("settings")}>Settings</SidebarItem>
        </SidebarFooter>
      </Sidebar>
      <div style={{ flex: 1, padding: "24px", background: "var(--vyre-color-semantic-surface)" }}>
        <Heading size="md">{active.charAt(0).toUpperCase() + active.slice(1)}</Heading>
        <Text color="muted" style={{ marginTop: "8px" }}>Content for the {active} page.</Text>
      </div>
    </div>
  );
}

export function SidebarCollapsibleDemo() {
  const [active, setActive] = useState("dashboard");
  return (
    <div style={{ height: "280px", border: "1px solid var(--vyre-color-semantic-border)", borderRadius: "var(--vyre-radius-lg)", overflow: "hidden" }}>
      <AppLayout defaultCollapsed={false} style={{ height: "100%", minHeight: "unset" }}>
        <Sidebar>
          <SidebarHeader title="App" logo={<svg width="24" height="24" viewBox="0 0 24 24" fill="var(--vyre-color-semantic-accent)"><rect width="24" height="24" rx="6"/><path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
          <SidebarContent>
            <SidebarSection>
              <SidebarItem icon={<HomeIcon />} active={active === "dashboard"} onClick={() => setActive("dashboard")}>Dashboard</SidebarItem>
              <SidebarItem icon={<UsersIcon />} active={active === "users"} onClick={() => setActive("users")}>Users</SidebarItem>
              <SidebarItem icon={<BellIcon />} badge={3} active={active === "notif"} onClick={() => setActive("notif")}>Notifications</SidebarItem>
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={<SettingsIcon2 />} active={active === "settings"} onClick={() => setActive("settings")}>Settings</SidebarItem>
          </SidebarFooter>
        </Sidebar>
        <AppShell>
          <AppBar>
            <SidebarTrigger />
            <Text size="sm" weight="medium">Click trigger to collapse</Text>
          </AppBar>
          <PageContent>
            <Text color="muted" size="sm">Active: {active}</Text>
          </PageContent>
        </AppShell>
      </AppLayout>
    </div>
  );
}

const pages: Record<string, { title: string; description: string }> = {
  dashboard: { title: "Dashboard", description: "Overview of your workspace activity and key metrics." },
  users:     { title: "Users",     description: "Manage team members, roles, and access permissions." },
  notif:     { title: "Notifications", description: "3 unread notifications from the last 24 hours." },
  settings:  { title: "Settings", description: "Configure your workspace preferences and integrations." },
};

const AppLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="var(--vyre-color-semantic-accent)">
    <rect width="28" height="28" rx="7"/>
    <path d="M8 14l5 5 7-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function SidebarLayoutDemo() {
  const [active, setActive] = useState("dashboard");
  const page = pages[active];
  return (
    <div style={{ height: "400px", border: "1px solid var(--vyre-color-semantic-border)", borderRadius: "var(--vyre-radius-lg)", overflow: "hidden" }}>
      <AppLayout style={{ height: "100%", minHeight: "unset" }}>
        <Sidebar>
          <SidebarHeader title="Workspace" logo={<AppLogo />} />
          <SidebarContent>
            <SidebarSection label="Main">
              <SidebarItem icon={<HomeIcon />} active={active === "dashboard"} onClick={() => setActive("dashboard")}>Dashboard</SidebarItem>
              <SidebarItem icon={<UsersIcon />} active={active === "users"} onClick={() => setActive("users")}>Users</SidebarItem>
              <SidebarItem icon={<BellIcon />} badge={3} active={active === "notif"} onClick={() => setActive("notif")}>Notifications</SidebarItem>
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarItem icon={<SettingsIcon2 />} active={active === "settings"} onClick={() => setActive("settings")}>Settings</SidebarItem>
          </SidebarFooter>
        </Sidebar>
        <AppShell>
          <AppBar>
            <SidebarTrigger />
            <Text size="sm" weight="semibold">{page.title}</Text>
          </AppBar>
          <PageContent>
            <Text color="muted" style={{ marginBottom: "20px" }}>{page.description}</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {["Total users", "Active now", "Revenue"].map((label, i) => (
                <div key={label} style={{ padding: "16px", background: "var(--vyre-color-semantic-surface-raised)", borderRadius: "var(--vyre-radius-md)", border: "1px solid var(--vyre-color-semantic-border-subtle)" }}>
                  <Text size="xs" color="muted">{label}</Text>
                  <Heading size="lg" style={{ marginTop: "4px" }}>{["1,284", "42", "$9.4k"][i]}</Heading>
                </div>
              ))}
            </div>
          </PageContent>
        </AppShell>
      </AppLayout>
    </div>
  );
}
