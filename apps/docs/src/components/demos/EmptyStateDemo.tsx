import { EmptyState, Button, Stack } from "@usevyre/react";

export function EmptyStateDemo() {
  return (
    <Stack direction="column" gap="lg" style={{ width: "100%", maxWidth: 420 }}>
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
      >
        <Button variant="primary">New project</Button>
      </EmptyState>

      <EmptyState
        variant="search"
        size="sm"
        title="No results"
        description="Try a different search term."
      >
        <Button variant="secondary">Clear filters</Button>
      </EmptyState>

      <EmptyState
        variant="error"
        title="Couldn't load data"
        description="Something went wrong. Please try again."
      >
        <Button variant="secondary">Retry</Button>
      </EmptyState>
    </Stack>
  );
}
