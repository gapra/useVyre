import { useState } from "react";
import {
  ButtonGroup,
  Button,
  TagsInput,
  Combobox,
  DataGrid,
  Tag,
  TagGroup,
} from "@usevyre/react";

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
