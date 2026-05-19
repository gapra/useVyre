import { useState } from "react";
import { Tree, Card, CardBody, Stack, Text } from "@usevyre/react";

const data = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "src/index.ts", label: "index.ts" },
      {
        id: "src/components",
        label: "components",
        children: [
          { id: "src/components/Button.tsx", label: "Button.tsx" },
          { id: "src/components/Tree.tsx", label: "Tree.tsx" },
        ],
      },
      { id: "src/utils.ts", label: "utils.ts" },
    ],
  },
  { id: "package.json", label: "package.json" },
  { id: "README.md", label: "README.md", disabled: true },
];

export function TreeDemo() {
  const [selected, setSelected] = useState<string | null>(
    "src/components/Tree.tsx"
  );

  return (
    <Card style={{ width: "100%", maxWidth: 360 }}>
      <CardBody>
        <Stack direction="column" gap="sm">
          <Tree
            data={data}
            selectedId={selected}
            onSelect={setSelected}
            defaultExpandedIds={["src", "src/components"]}
          />
          <Text size="sm" color="muted">
            Selected: {selected ?? "none"}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
