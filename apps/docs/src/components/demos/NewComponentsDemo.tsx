import { useState } from "react";
import {
  ButtonGroup,
  Button,
  TagsInput,
  Combobox,
  DataGrid,
  Tag,
  TagGroup,
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  Switch,
  Avatar,
  Badge,
  Progress,
  Card,
  CardBody,
  Kanban,
  Conversation,
  RadioGroup,
  Radio,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  Input,
  Textarea,
  Checkbox,
  RichTextEditor,
} from "@usevyre/react";
import type { KanbanColumn, ConversationMessage } from "@usevyre/react";

// ── ButtonGroup ───────────────────────────────────────────────
export function ButtonGroupBasicDemo() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Cut</Button>
      <Button variant="secondary">Copy</Button>
      <Button variant="secondary">Paste</Button>
    </ButtonGroup>
  );
}

export function ButtonGroupAttachedDemo() {
  return (
    <ButtonGroup attached>
      <Button variant="primary">Day</Button>
      <Button variant="secondary">Week</Button>
      <Button variant="secondary">Month</Button>
    </ButtonGroup>
  );
}

export function ButtonGroupOrientationDemo() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="ghost">Option A</Button>
      <Button variant="ghost">Option B</Button>
      <Button variant="ghost">Option C</Button>
    </ButtonGroup>
  );
}

// ── TagsInput ─────────────────────────────────────────────────
export function TagsInputBasicDemo() {
  const [tags, setTags] = useState<string[]>(["react", "typescript"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}>
      <TagsInput
        value={tags}
        onChange={setTags}
        placeholder="Add a technology…"
      />
      <span style={{ fontSize: 13, opacity: 0.6 }}>
        {tags.length} tag{tags.length === 1 ? "" : "s"}: {tags.join(", ") || "—"}
      </span>
    </div>
  );
}

export function TagsInputMaxDemo() {
  const [tags, setTags] = useState<string[]>(["one", "two"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}>
      <TagsInput
        value={tags}
        onChange={setTags}
        max={3}
        placeholder="Max 3 tags…"
      />
      <span style={{ fontSize: 13, opacity: 0.6 }}>
        {tags.length >= 3 ? "Limit reached — input disabled" : `${3 - tags.length} slot(s) left`}
      </span>
    </div>
  );
}

export function TagsInputSizesDemo() {
  const [a, setA] = useState<string[]>(["sm"]);
  const [b, setB] = useState<string[]>(["md"]);
  const [c, setC] = useState<string[]>(["lg"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 360 }}>
      <TagsInput value={a} onChange={setA} size="sm" placeholder="Small" />
      <TagsInput value={b} onChange={setB} size="md" placeholder="Medium" />
      <TagsInput value={c} onChange={setC} size="lg" placeholder="Large" />
    </div>
  );
}

// ── Combobox ──────────────────────────────────────────────────
const languages = [
  { value: "ts", label: "TypeScript" },
  { value: "rs", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "py", label: "Python" },
  { value: "rb", label: "Ruby", disabled: true },
  { value: "js", label: "JavaScript" },
  { value: "kt", label: "Kotlin" },
  { value: "sw", label: "Swift" },
];

export function ComboboxBasicDemo() {
  const [lang, setLang] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
      <Combobox
        options={languages}
        value={lang}
        onChange={setLang}
        placeholder="Search language…"
      />
      {lang && <span style={{ fontSize: 13, opacity: 0.6 }}>Selected: {lang}</span>}
    </div>
  );
}

export function ComboboxSizesDemo() {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [c, setC] = useState<string | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
      <Combobox options={languages} value={a} onChange={setA} size="sm" placeholder="Small" />
      <Combobox options={languages} value={b} onChange={setB} size="md" placeholder="Medium" />
      <Combobox options={languages} value={c} onChange={setC} size="lg" placeholder="Large" />
    </div>
  );
}

export function ComboboxEmptyDemo() {
  const [val, setVal] = useState<string | null>(null);
  return (
    <div style={{ width: "100%", maxWidth: 280 }}>
      <Combobox
        options={languages}
        value={val}
        onChange={setVal}
        emptyText="No matching language found"
        placeholder="Type 'xyz' to see empty state…"
      />
    </div>
  );
}

// ── DataGrid ──────────────────────────────────────────────────
interface Person extends Record<string, unknown> {
  name: string;
  role: string;
  age: number;
}

const people: Person[] = [
  { name: "Ada Lovelace", role: "Engineer", age: 36 },
  { name: "Alan Turing", role: "Researcher", age: 41 },
  { name: "Grace Hopper", role: "Admiral", age: 85 },
  { name: "Linus Torvalds", role: "Engineer", age: 54 },
  { name: "Margaret Hamilton", role: "Director", age: 87 },
];

const columns = [
  { key: "name", label: "Name", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "age", label: "Age", sortable: true, width: "80px" },
];

export function DataGridBasicDemo() {
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(undefined);

  const sorted = [...people].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] as string | number;
    const bv = b[sortKey] as string | number;
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        columns={columns}
        rows={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortDir(dir);
        }}
      />
    </div>
  );
}

const manyPeople: Person[] = [
  { name: "Ada Lovelace", role: "Engineer", age: 36 },
  { name: "Alan Turing", role: "Researcher", age: 41 },
  { name: "Grace Hopper", role: "Admiral", age: 85 },
  { name: "Linus Torvalds", role: "Engineer", age: 54 },
  { name: "Margaret Hamilton", role: "Director", age: 87 },
  { name: "Katherine Johnson", role: "Mathematician", age: 101 },
  { name: "Dennis Ritchie", role: "Engineer", age: 70 },
  { name: "Barbara Liskov", role: "Researcher", age: 84 },
  { name: "Tim Berners-Lee", role: "Inventor", age: 69 },
  { name: "Donald Knuth", role: "Author", age: 86 },
  { name: "Vint Cerf", role: "Engineer", age: 81 },
  { name: "Radia Perlman", role: "Engineer", age: 73 },
];

export function DataGridStickyDemo() {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        columns={columns}
        rows={manyPeople}
        stickyHeader
        style={{ maxHeight: "260px" }}
      />
      <p style={{ fontSize: 13, opacity: 0.6, marginTop: 8 }}>
        Scroll the table — the header row stays pinned to the top.
      </p>
    </div>
  );
}

export function DataGridLoadingDemo() {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid columns={columns} rows={[]} loading />
    </div>
  );
}

export function DataGridEmptyDemo() {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid columns={columns} rows={[]} emptyText="No people found" />
    </div>
  );
}

// ── Tag ───────────────────────────────────────────────────────
export function TagBasicDemo() {
  return (
    <TagGroup>
      <Tag>Design</Tag>
      <Tag variant="accent">Featured</Tag>
      <Tag>Engineering</Tag>
      <Tag variant="danger">Deprecated</Tag>
    </TagGroup>
  );
}

export function TagSizesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  );
}

export function TagRemovableDemo() {
  const [tags, setTags] = useState(["react", "vue", "svelte", "solid"]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}>
      <TagGroup>
        {tags.map((t) => (
          <Tag
            key={t}
            variant="accent"
            onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}
          >
            {t}
          </Tag>
        ))}
      </TagGroup>
      {tags.length === 0 && (
        <button
          type="button"
          onClick={() => setTags(["react", "vue", "svelte", "solid"])}
          style={{ fontSize: 13, opacity: 0.6, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", alignSelf: "flex-start", padding: 0 }}
        >
          Reset
        </button>
      )}
    </div>
  );
}

export function TagClickableDemo() {
  const [active, setActive] = useState<string[]>(["react"]);
  const all = ["react", "vue", "svelte", "angular"];
  function toggle(t: string) {
    setActive((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}>
      <TagGroup>
        {all.map((t) => (
          <Tag
            key={t}
            variant={active.includes(t) ? "accent" : "default"}
            onClick={() => toggle(t)}
          >
            {t}
          </Tag>
        ))}
      </TagGroup>
      <span style={{ fontSize: 13, opacity: 0.6 }}>
        Active: {active.join(", ") || "none"}
      </span>
    </div>
  );
}

// ── Item ──────────────────────────────────────────────────────
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function ItemBasicDemo() {
  return (
    <Item style={{ maxWidth: 420 }}>
      <ItemMedia><GearIcon /></ItemMedia>
      <ItemContent>
        <ItemTitle>Notifications</ItemTitle>
        <ItemDescription>Receive an email when someone mentions you.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Switch defaultChecked />
      </ItemActions>
    </Item>
  );
}

export function ItemGroupDemo() {
  const rows = [
    { name: "Olivia Martin", email: "olivia@usevyre.com", role: "Owner" },
    { name: "Jackson Lee", email: "jackson@usevyre.com", role: "Editor" },
    { name: "Isabella Nguyen", email: "bella@usevyre.com", role: "Viewer" },
  ];
  return (
    <ItemGroup separated style={{ maxWidth: 420, border: "1px solid var(--vyre-color-semantic-border-subtle)", borderRadius: "var(--vyre-border-radius-lg)" }}>
      {rows.map((r) => (
        <Item key={r.email} clickable>
          <ItemMedia><Avatar fallback={r.name.split(" ").map((p) => p[0]).join("")} size="sm" /></ItemMedia>
          <ItemContent>
            <ItemTitle>{r.name}</ItemTitle>
            <ItemDescription>{r.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Tag>{r.role}</Tag>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}

export function ItemVariantsDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 420 }}>
      <Item variant="default">
        <ItemContent><ItemTitle>Default</ItemTitle><ItemDescription>Plain surface row.</ItemDescription></ItemContent>
      </Item>
      <Item variant="outlined">
        <ItemContent><ItemTitle>Outlined</ItemTitle><ItemDescription>Bordered row.</ItemDescription></ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent><ItemTitle>Muted</ItemTitle><ItemDescription>Raised muted background.</ItemDescription></ItemContent>
      </Item>
      <Card variant="outlined">
        <CardBody style={{ padding: 0 }}>
          <Item variant="plain">
            <ItemContent><ItemTitle>Plain (inside a Card)</ItemTitle><ItemDescription>Transparent — no double background.</ItemDescription></ItemContent>
          </Item>
        </CardBody>
      </Card>
    </div>
  );
}

// ── Kanban ────────────────────────────────────────────────────
export function KanbanBasicDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "c1", title: "Spec the API", description: "Define value/onChange shape" },
        { id: "c2", title: "Write docs page" },
      ],
    },
    {
      id: "doing",
      title: "In Progress",
      cards: [
        { id: "c3", title: "Drag-and-drop logic", description: "Native HTML5 DnD" },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        { id: "c4", title: "Project kickoff" },
        { id: "c5", title: "Design tokens" },
      ],
    },
  ]);
  return (
    <div style={{ width: "100%" }}>
      <Kanban value={columns} onChange={setColumns} />
      <p style={{ fontSize: 13, opacity: 0.6, marginTop: 12 }}>
        Drag a card to another column — or reorder within one.
      </p>
    </div>
  );
}

export function KanbanCustomDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "review",
      title: "In Review",
      cards: [
        { id: "k1", title: "Auth refactor", description: "Alex" },
        { id: "k2", title: "Billing webhook", description: "Sam" },
      ],
    },
    {
      id: "ship",
      title: "Ready to Ship",
      cards: [{ id: "k3", title: "Dark mode", description: "Riya" }],
    },
  ]);
  const [last, setLast] = useState<string | null>(null);
  return (
    <div style={{ width: "100%" }}>
      <Kanban
        value={columns}
        onChange={setColumns}
        onCardClick={(card) => setLast(card.title)}
        renderCard={(card) => (
          <Item variant="plain" size="sm" style={{ padding: 0 }}>
            <ItemMedia>
              <Avatar fallback={(card.description ?? "?").slice(0, 1)} size="sm" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{card.title}</ItemTitle>
              <ItemDescription>{card.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="teal">{card.id}</Badge>
            </ItemActions>
          </Item>
        )}
      />
      <p style={{ fontSize: 13, opacity: 0.6, marginTop: 12 }}>
        {last ? `Clicked: ${last}` : "Click a card — or drag it to another column."}
      </p>
    </div>
  );
}

export function KanbanColorsDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "backlog",
      title: "Backlog",
      color: "default",
      cards: [{ id: "g1", title: "Triage incoming bugs" }],
    },
    {
      id: "active",
      title: "Active",
      color: "teal",
      cards: [
        { id: "g2", title: "API rate limiting", color: "warning" },
        { id: "g3", title: "Dashboard charts" },
      ],
    },
    {
      id: "blocked",
      title: "Blocked",
      color: "danger",
      cards: [{ id: "g4", title: "Vendor SDK upgrade", color: "danger" }],
    },
    {
      id: "shipped",
      title: "Shipped",
      color: "success",
      cards: [{ id: "g5", title: "Onboarding flow", color: "success" }],
    },
  ]);
  return (
    <div style={{ width: "100%" }}>
      <Kanban value={columns} onChange={setColumns} />
      <p style={{ fontSize: 13, opacity: 0.6, marginTop: 12 }}>
        Columns and individual cards carry a semantic <code>color</code>.
      </p>
    </div>
  );
}

// A KanbanCard with extra app-specific fields. The board only needs
// { id, title } — any other fields ride along untouched and are read
// back inside renderCard.
interface RichCard {
  id: string;
  title: string;
  assignee: string;
  initials: string;
  tags: string[];
  progress: number;
  priority: "Low" | "Medium" | "High";
}

export function KanbanComplexDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "todo",
      title: "To Do",
      cards: [
        {
          id: "t1",
          title: "Implement OAuth callback",
          assignee: "Alex Kim",
          initials: "AK",
          tags: ["backend", "security"],
          progress: 20,
          priority: "High",
        } satisfies RichCard,
      ],
    },
    {
      id: "doing",
      title: "In Progress",
      cards: [
        {
          id: "t2",
          title: "Redesign settings page",
          assignee: "Riya Shah",
          initials: "RS",
          tags: ["design", "frontend"],
          progress: 60,
          priority: "Medium",
        } satisfies RichCard,
      ],
    },
  ]);

  const priorityColor: Record<string, "danger" | "warning" | "default"> = {
    High: "danger",
    Medium: "warning",
    Low: "default",
  };

  return (
    <div style={{ width: "100%" }}>
      <Kanban
        value={columns}
        onChange={setColumns}
        onCardClick={(c) => alert(`Open card: ${c.title}`)}
        renderCard={(card) => {
          const c = card as unknown as RichCard;
          return (
            <ItemContent>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ItemTitle style={{ flex: 1 }}>{c.title}</ItemTitle>
                <Badge variant={priorityColor[c.priority]}>{c.priority}</Badge>
              </div>
              <TagGroup gap="sm">
                {c.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </TagGroup>
              <Progress value={c.progress} size="sm" />
              <Item variant="plain" size="sm" style={{ padding: 0 }}>
                <ItemMedia>
                  <Avatar fallback={c.initials} size="sm" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{c.assignee}</ItemTitle>
                </ItemContent>
                <ItemActions>{c.progress}%</ItemActions>
              </Item>
            </ItemContent>
          );
        }}
      />
      <p style={{ fontSize: 13, opacity: 0.6, marginTop: 12 }}>
        Cards composed from Item, TagGroup, Progress and Avatar — drag still works.
      </p>
    </div>
  );
}

// ── Conversation ──────────────────────────────────────────────
let convId = 100;
const appendMe =
  (set: (fn: (m: ConversationMessage[]) => ConversationMessage[]) => void) =>
  (text: string) =>
    set((m) => [
      ...m,
      { id: String(++convId), authorId: "me", text, status: "sent" },
    ]);

export function ConversationBasicDemo() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { id: "1", authorId: "sam", authorName: "Sam Rivera", text: "Hey! Did you see the API draft?" },
    { id: "2", authorId: "me", text: "Yep — looks solid.", status: "read" },
    { id: "3", authorId: "sam", authorName: "Sam Rivera", text: "It's fully controlled, right?" },
    { id: "4", authorId: "me", text: "Exactly — same as Kanban. You own the array.", status: "delivered" },
  ]);
  return (
    <div style={{ width: "100%", maxWidth: 460, height: 380 }}>
      <Conversation
        value={messages}
        currentUserId="me"
        composer
        typing="Sam is typing"
        onSend={appendMe(setMessages)}
        style={{ height: "100%" }}
      />
    </div>
  );
}

export function ConversationAttachmentsDemo() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: "1",
      authorId: "sam",
      authorName: "Sam Rivera",
      text: "Here's the moodboard 👇",
      attachments: [
        { kind: "image", url: "https://picsum.photos/seed/vyre/320/200", name: "moodboard.png" },
      ],
    },
    {
      id: "2",
      authorId: "me",
      text: "Love it. Specs attached.",
      status: "read",
      attachments: [
        { kind: "file", url: "#", name: "design-spec.pdf", size: "2.4 MB" },
      ],
    },
    {
      id: "3",
      authorId: "sam",
      authorName: "Sam Rivera",
      attachments: [
        { kind: "audio", url: "https://www.w3schools.com/html/horse.mp3" },
      ],
    },
  ]);
  return (
    <div style={{ width: "100%", maxWidth: 460, height: 460 }}>
      <Conversation
        value={messages}
        currentUserId="me"
        composer
        allowAttachments
        onSend={(text, files) =>
          setMessages((m) => [
            ...m,
            {
              id: String(++convId),
              authorId: "me",
              text,
              status: "sent",
              attachments: files.map((f) =>
                f.type.startsWith("image/")
                  ? { kind: "image" as const, url: URL.createObjectURL(f), name: f.name }
                  : { kind: "file" as const, url: URL.createObjectURL(f), name: f.name }
              ),
            },
          ])
        }
        style={{ height: "100%" }}
      />
    </div>
  );
}

export function ConversationCustomDemo() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { id: "a", authorId: "bot", authorName: "Vyre Bot", text: "Pick a component to scaffold:" },
    { id: "b", authorId: "me", text: "Kanban please", status: "read" },
    { id: "c", authorId: "bot", authorName: "Vyre Bot", text: "Done — added Kanban.tsx + Kanban.vue." },
  ]);
  return (
    <div style={{ width: "100%", maxWidth: 460, height: 340 }}>
      <Conversation
        value={messages}
        currentUserId="me"
        composer
        placeholder="Ask the bot…"
        onSend={appendMe(setMessages)}
        renderMessage={(msg, meta) => (
          <span>
            {!meta.outgoing && <Badge variant="teal">bot</Badge>} {msg.text}
          </span>
        )}
        style={{ height: "100%" }}
      />
    </div>
  );
}

// ── Radio ─────────────────────────────────────────────────────
export function RadioOptionsDemo() {
  const [plan, setPlan] = useState("pro");
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <RadioGroup
        value={plan}
        onChange={setPlan}
        options={[
          { value: "free", label: "Free", description: "For hobby projects" },
          { value: "pro", label: "Pro", description: "For small teams" },
          { value: "ent", label: "Enterprise", description: "SSO, audit log, SLA" },
          { value: "legacy", label: "Legacy (unavailable)", disabled: true },
        ]}
      />
      <p style={{ fontSize: 13, opacity: 0.6, marginTop: 12 }}>
        Selected: <strong>{plan}</strong>
      </p>
    </div>
  );
}

export function RadioComposableDemo() {
  const [val, setVal] = useState("b");
  return (
    <RadioGroup value={val} onChange={setVal} orientation="horizontal">
      <Radio value="a" label="Option A" />
      <Radio value="b" label="Option B" />
      <Radio value="c" label="Option C" />
    </RadioGroup>
  );
}

// ── Field (composable) ────────────────────────────────────────
export function FieldPropsDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Field label="Email" hint="We'll never share it." required>
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </div>
  );
}

export function FieldComposableDemo() {
  const [val, setVal] = useState("");
  const invalid = val.length > 0 && !val.includes("@");
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Field state={invalid ? "error" : "idle"}>
        <FieldLabel required htmlFor="fc-email">Email</FieldLabel>
        <Input
          id="fc-email"
          type="email"
          placeholder="you@example.com"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        {invalid ? (
          <FieldError>Enter a valid email address.</FieldError>
        ) : (
          <FieldDescription>Used for sign-in and receipts.</FieldDescription>
        )}
      </Field>
    </div>
  );
}

export function FieldGroupDemo() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <FieldGroup orientation="horizontal">
        <Field label="First name">
          <Input placeholder="Ada" />
        </Field>
        <Field label="Last name">
          <Input placeholder="Lovelace" />
        </Field>
      </FieldGroup>
    </div>
  );
}

// ── Field — complete form ─────────────────────────────────────
export function FieldFormDemo() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "pro",
    bio: "",
    notify: "email",
    terms: false,
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const emailInvalid = form.email.length > 0 && !form.email.includes("@");
  const submitted = useState(false);
  const [done, setDone] = submitted;

  return (
    <form
      style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 20 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!emailInvalid && form.name && form.terms) setDone(true);
      }}
    >
      <FieldGroup orientation="horizontal">
        <Field label="First name" required>
          <Input
            placeholder="Ada"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Last name">
          <Input placeholder="Lovelace" />
        </Field>
      </FieldGroup>

      <Field state={emailInvalid ? "error" : "idle"}>
        <FieldLabel required htmlFor="ff-email">Email</FieldLabel>
        <Input
          id="ff-email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        {emailInvalid ? (
          <FieldError>Enter a valid email address.</FieldError>
        ) : (
          <FieldDescription>Used for sign-in and receipts.</FieldDescription>
        )}
      </Field>

      <Field>
        <FieldLabel>Plan</FieldLabel>
        <RadioGroup
          value={form.plan}
          onChange={(v) => set("plan", v)}
          options={[
            { value: "free", label: "Free", description: "For hobby projects" },
            { value: "pro", label: "Pro", description: "For small teams" },
            { value: "ent", label: "Enterprise", description: "SSO, audit log, SLA" },
          ]}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="ff-bio">Bio</FieldLabel>
        <Textarea
          id="ff-bio"
          rows={3}
          placeholder="Tell us about yourself…"
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
        />
        <FieldDescription>Markdown is supported.</FieldDescription>
      </Field>

      <FieldSet legend="Notifications">
        <RadioGroup
          value={form.notify}
          onChange={(v) => set("notify", v)}
          orientation="horizontal"
          options={[
            { value: "email", label: "Email" },
            { value: "sms", label: "SMS" },
            { value: "none", label: "None" },
          ]}
        />
      </FieldSet>

      <Field>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <Checkbox
            id="ff-terms"
            checked={form.terms}
            onCheckedChange={(c) => set("terms", c)}
          />
          <label htmlFor="ff-terms" style={{ fontSize: 14, lineHeight: 1.4 }}>
            I accept the <a href="#" onClick={(e) => e.preventDefault()}>terms and conditions</a>
          </label>
        </div>
      </Field>

      <Button type="submit" variant="primary" disabled={!form.name || !form.terms || emailInvalid}>
        Create account
      </Button>

      {done && (
        <p style={{ fontSize: 13, color: "var(--vyre-color-semantic-success)" }}>
          Submitted — {form.name} ({form.plan})
        </p>
      )}
    </form>
  );
}

// ── RichTextEditor ────────────────────────────────────────────
export function RichTextEditorBasicDemo() {
  const [html, setHtml] = useState(
    "<h2>Release notes</h2><p>useVyre <strong>v1.2</strong> ships with a controlled, zero-dependency editor.</p><ul><li>Bold, italic, lists</li><li>Headings &amp; quotes</li></ul>"
  );
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <RichTextEditor value={html} onChange={setHtml} placeholder="Write release notes…" />
      <p style={{ fontSize: 12, opacity: 0.55, marginTop: 8, fontFamily: "monospace" }}>
        {html.length} chars of HTML
      </p>
    </div>
  );
}

export function RichTextEditorMinimalDemo() {
  const [html, setHtml] = useState("<p>A focused toolbar — just the essentials.</p>");
  return (
    <div style={{ width: "100%", maxWidth: 560 }}>
      <RichTextEditor
        value={html}
        onChange={setHtml}
        toolbar={["bold", "italic", "link", "clear"]}
        minHeight="6rem"
      />
    </div>
  );
}
