import { useState, useCallback } from "react";
import {
  Tabs, TabList, Tab, TabPanels, TabPanel,
  Button, Badge, Input, Switch, Avatar, Progress,
} from "@usevyre/react";

// ── Types ─────────────────────────────────────────────────────

type ThemeVals = {
  accent: string; hover: string; fg: string;
  subtle: string; sborder: string;
};

// ── Preset data ───────────────────────────────────────────────
// Single token set per preset — preview inherits docs page theme.

const PRESETS: Record<string, { dot: string; vals: ThemeVals }> = {
  Violet: {
    dot:  "#7c3aed",
    vals: { accent: "#7c3aed", hover: "#6d28d9", fg: "#ffffff", subtle: "#f5f3ff", sborder: "#ddd6fe" },
  },
  Blue: {
    dot:  "#2563eb",
    vals: { accent: "#2563eb", hover: "#1d4ed8", fg: "#ffffff", subtle: "#eff6ff", sborder: "#dbeafe" },
  },
  Green: {
    dot:  "#16a34a",
    vals: { accent: "#16a34a", hover: "#15803d", fg: "#ffffff", subtle: "#f0fdf4", sborder: "#dcfce7" },
  },
  Rose: {
    dot:  "#e11d48",
    vals: { accent: "#e11d48", hover: "#be123c", fg: "#ffffff", subtle: "#fff1f2", sborder: "#fecdd3" },
  },
  Orange: {
    dot:  "#ea580c",
    vals: { accent: "#ea580c", hover: "#c2410c", fg: "#ffffff", subtle: "#fff7ed", sborder: "#fed7aa" },
  },
};

const PRESET_NAMES = Object.keys(PRESETS);

// ── Helpers ───────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function lum(r: number, g: number, b: number) {
  return [r, g, b].reduce((a, c, i) => {
    const s = c / 255;
    return a + (s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)) * [0.2126, 0.7152, 0.0722][i];
  }, 0);
}

function fgFor(hex: string) {
  const rgb = hexToRgb(hex);
  return rgb && lum(...rgb) > 0.35 ? "#09090b" : "#ffffff";
}

function darken(hex: string, a = 0.13) {
  const rgb = hexToRgb(hex);
  return rgb ? "#" + rgb.map(c => Math.max(0, Math.round(c * (1 - a))).toString(16).padStart(2, "0")).join("") : hex;
}

function lighten(hex: string, a = 0.28) {
  const rgb = hexToRgb(hex);
  return rgb ? "#" + rgb.map(c => Math.min(255, Math.round(c + (255 - c) * a)).toString(16).padStart(2, "0")).join("") : hex;
}

function customVals(hex: string): ThemeVals {
  const rgb = hexToRgb(hex);
  const sr = rgb ? rgb.map(c => Math.min(255, Math.round(c * 0.05 + 250))).join(",") : "245,243,255";
  const br = rgb ? rgb.map(c => Math.min(255, Math.round(c * 0.20 + 200))).join(",") : "221,214,254";
  return { accent: hex, hover: darken(hex), fg: fgFor(hex), subtle: `rgb(${sr})`, sborder: `rgb(${br})` };
}

function getContrastLabel(hex: string) {
  const fg = hexToRgb(hex);
  const bg = hexToRgb("#ffffff");
  if (!fg || !bg) return "—";
  const l1 = lum(...fg), l2 = lum(...bg);
  const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  if (r >= 4.5) return "AA";
  if (r >= 3)   return "AA Large";
  return "Fail";
}

function accentCssVars(v: ThemeVals): React.CSSProperties {
  return {
    "--vyre-color-semantic-accent":               v.accent,
    "--vyre-color-semantic-accent-hover":         v.hover,
    "--vyre-color-semantic-accent-foreground":    v.fg,
    "--vyre-color-semantic-accent-subtle":        v.subtle,
    "--vyre-color-semantic-accent-subtle-border": v.sborder,
  } as React.CSSProperties;
}

// ── Preview card — purely themed via the accent CSS var override
// All structural colors (bg, border, text) follow the docs page theme.

function PreviewCard({ vals }: { vals: ThemeVals }) {
  const vars = accentCssVars(vals);

  return (
    <div className="tp-preview" style={vars}>
      {/* Toolbar row */}
      <div className="tp-preview__toolbar">
        <div className="tp-preview__badges">
          <Badge variant="accent">New</Badge>
          <Badge variant="teal">AI-ready</Badge>
          <Badge variant="success">Stable</Badge>
        </div>
        <Switch defaultChecked aria-label="Toggle" />
      </div>

      {/* Content row */}
      <div className="tp-preview__content">
        <Avatar fallback="GP" size="md" />
        <div className="tp-preview__meta">
          <span className="tp-preview__title">Project settings</span>
          <span className="tp-preview__desc">Configure your workspace below.</span>
          <Input placeholder="Project name…" size="sm" />
          <div className="tp-preview__progress">
            <div className="tp-preview__progress-labels">
              <span>Completion</span>
              <span>72%</span>
            </div>
            <Progress value={72} />
          </div>
        </div>
      </div>

      {/* Footer row */}
      <div className="tp-preview__footer">
        <Button variant="accent"    size="sm">Save changes</Button>
        <Button variant="secondary" size="sm">Preview</Button>
        <Button variant="ghost"     size="sm">Cancel</Button>
        <Button variant="danger"    size="sm">Delete</Button>
      </div>
    </div>
  );
}

// ── Token readout ─────────────────────────────────────────────

function TokenReadout({ vals }: { vals: ThemeVals }) {
  const rows: [string, string][] = [
    ["--vyre-color-semantic-accent",               vals.accent],
    ["--vyre-color-semantic-accent-hover",         vals.hover],
    ["--vyre-color-semantic-accent-foreground",    vals.fg],
    ["--vyre-color-semantic-accent-subtle",        vals.subtle],
    ["--vyre-color-semantic-accent-subtle-border", vals.sborder],
  ];
  return (
    <div className="tp-readout">
      {rows.map(([k, v]) => (
        <div key={k} className="tp-readout__row">
          <span className="tp-readout__swatch" style={{ background: v }} />
          <code className="tp-readout__name">{k}</code>
          <code className="tp-readout__val">{v}</code>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export function ThemePreview() {
  const [preset, setPreset]       = useState("Violet");
  const [customHex, setCustomHex] = useState("#7c3aed");

  const presetVals = PRESETS[preset].vals;
  const custVals   = customVals(customHex);
  const cl         = getContrastLabel(customHex);

  const handleColor = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHex(e.target.value);
  }, []);

  return (
    <div className="tp-root">
      <Tabs defaultValue="presets" style={{ width: "100%" }}>
        <TabList>
          <Tab value="presets">Presets</Tab>
          <Tab value="custom">Custom color</Tab>
        </TabList>

        <TabPanels>

          {/* ── Presets ── */}
          <TabPanel value="presets">
            <div className="tp-pill-row">
              {PRESET_NAMES.map(name => {
                const isActive = preset === name;
                const av = PRESETS[name].vals;
                return (
                  <button
                    key={name}
                    className={`tp-pill${isActive ? " tp-pill--active" : ""}`}
                    onClick={() => setPreset(name)}
                    style={isActive ? { background: av.subtle, borderColor: av.sborder, color: av.accent } : {}}
                  >
                    <span className="tp-pill__dot" style={{ background: PRESETS[name].dot }} />
                    {name}
                  </button>
                );
              })}
            </div>
            <PreviewCard vals={presetVals} />
            <TokenReadout vals={presetVals} />
          </TabPanel>

          {/* ── Custom ── */}
          <TabPanel value="custom">
            <div className="tp-custom-bar">
              <label className="tp-color-label">
                <input type="color" value={customHex} onChange={handleColor} className="tp-color-input" />
                <span className="tp-color-swatch" style={{ background: customHex }} />
                <code className="tp-color-hex">{customHex.toUpperCase()}</code>
              </label>
              <span className={`tp-contrast tp-contrast--${cl === "AA" ? "pass" : cl === "AA Large" ? "warn" : "fail"}`}>
                WCAG {cl}
              </span>
            </div>
            <PreviewCard vals={custVals} />
            <TokenReadout vals={custVals} />
          </TabPanel>

        </TabPanels>
      </Tabs>
    </div>
  );
}
