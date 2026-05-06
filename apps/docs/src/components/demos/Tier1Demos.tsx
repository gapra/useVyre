import { useState } from "react";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  Avatar,
  Checkbox,
  Switch,
  Progress,
  Slider,
  Separator,
  Label,
  Skeleton,
} from "@vyre/react";

const row: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

// ── Accordion ─────────────────────────────────────────────────
export function AccordionDemo() {
  return (
    <Accordion type="single" defaultValue="item-1" style={{ width: "100%", maxWidth: 480 }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is useVyre?</AccordionTrigger>
        <AccordionContent>
          useVyre is an AI-native design system built to minimise hallucinations when AI writes frontend code.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Which frameworks are supported?</AccordionTrigger>
        <AccordionContent>
          React and Vue 3 are supported out of the box with identical APIs.
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

// ── Avatar ────────────────────────────────────────────────────
export function AvatarSizesDemo() {
  return (
    <div style={row}>
      <Avatar size="sm" fallback="GP" />
      <Avatar size="md" fallback="GP" />
      <Avatar size="lg" fallback="GP" />
      <Avatar size="xl" fallback="GP" />
    </div>
  );
}

export function AvatarStatusDemo() {
  return (
    <div style={row}>
      <Avatar fallback="ON" status="online" />
      <Avatar fallback="BZ" status="busy" />
      <Avatar fallback="AW" status="away" />
      <Avatar fallback="OF" status="offline" />
    </div>
  );
}

export function AvatarFallbackDemo() {
  return (
    <div style={row}>
      <Avatar src="https://i.pravatar.cc/80?img=1" alt="User" fallback="U1" size="md" />
      <Avatar src="https://broken-url.example/img.png" alt="Broken" fallback="BR" size="md" />
      <Avatar fallback="GP" size="md" />
    </div>
  );
}

// ── Checkbox ──────────────────────────────────────────────────
export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={col}>
      <div style={row}>
        <Checkbox id="cb-1" checked={checked} onCheckedChange={setChecked} />
        <label htmlFor="cb-1" style={{ fontSize: 14 }}>Accept terms and conditions</label>
      </div>
      <div style={row}>
        <Checkbox id="cb-2" indeterminate defaultChecked />
        <label htmlFor="cb-2" style={{ fontSize: 14 }}>Indeterminate state</label>
      </div>
      <div style={row}>
        <Checkbox id="cb-3" disabled />
        <label htmlFor="cb-3" style={{ fontSize: 14, opacity: 0.5 }}>Disabled</label>
      </div>
    </div>
  );
}

// ── Switch ────────────────────────────────────────────────────
export function SwitchDemo() {
  const [on, setOn] = useState(false);
  return (
    <div style={col}>
      <div style={row}>
        <Switch checked={on} onCheckedChange={setOn} />
        <span style={{ fontSize: 14 }}>Notifications {on ? "enabled" : "disabled"}</span>
      </div>
      <div style={row}>
        <Switch defaultChecked size="sm" />
        <span style={{ fontSize: 14 }}>Small size (uncontrolled)</span>
      </div>
      <div style={row}>
        <Switch disabled />
        <span style={{ fontSize: 14, opacity: 0.5 }}>Disabled</span>
      </div>
    </div>
  );
}

// ── Progress ──────────────────────────────────────────────────
export function ProgressDemo() {
  return (
    <div style={{ ...col, width: "100%", maxWidth: 400 }}>
      <Progress value={30} />
      <Progress value={65} variant="accent" />
      <Progress value={90} variant="success" />
      <Progress value={45} variant="danger" />
      <Progress indeterminate />
    </div>
  );
}

export function ProgressSizesDemo() {
  return (
    <div style={{ ...col, width: "100%", maxWidth: 400 }}>
      <Progress value={60} size="sm" variant="accent" />
      <Progress value={60} size="md" variant="accent" />
      <Progress value={60} size="lg" variant="accent" />
    </div>
  );
}

// ── Slider ────────────────────────────────────────────────────
export function SliderDemo() {
  const [val, setVal] = useState(40);
  return (
    <div style={{ ...col, width: "100%", maxWidth: 400 }}>
      <Slider value={val} onValueChange={setVal} />
      <span style={{ fontSize: 13, opacity: 0.6 }}>Value: {val}</span>
      <Slider defaultValue={70} size="sm" />
      <Slider disabled defaultValue={50} />
    </div>
  );
}

// ── Separator ─────────────────────────────────────────────────
export function SeparatorDemo() {
  return (
    <div style={{ ...col, width: "100%", maxWidth: 400 }}>
      <p style={{ fontSize: 14, margin: 0 }}>Above the separator</p>
      <Separator />
      <p style={{ fontSize: 14, margin: 0 }}>Below the separator</p>
      <div style={{ ...row, alignItems: "stretch", height: 40 }}>
        <span style={{ fontSize: 14 }}>Left</span>
        <Separator orientation="vertical" />
        <span style={{ fontSize: 14 }}>Right</span>
      </div>
    </div>
  );
}

// ── Label ─────────────────────────────────────────────────────
export function LabelDemo() {
  return (
    <div style={col}>
      <Label htmlFor="input-1">Email address</Label>
      <Label htmlFor="input-2" required>Password</Label>
      <Label htmlFor="input-3" disabled>Disabled field</Label>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
export function SkeletonDemo() {
  return (
    <div style={{ ...col, width: "100%", maxWidth: 320 }}>
      <div style={row}>
        <Skeleton variant="circle" width={40} height={40} />
        <div style={col}>
          <Skeleton variant="text" width={180} />
          <Skeleton variant="text" width={120} />
        </div>
      </div>
      <Skeleton variant="rect" width="100%" height={120} />
    </div>
  );
}
