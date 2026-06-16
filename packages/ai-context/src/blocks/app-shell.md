# AppShell

The application frame: a collapsible Sidebar with nav + an AppBar over the main
content area. The skeleton for any dashboard/app.

**Use when:** building the top-level layout of an app or dashboard.
**Components:** AppLayout, Sidebar, SidebarHeader, SidebarContent, SidebarSection, SidebarItem, SidebarFooter, AppShell, AppBar, SidebarTrigger, PageContent, Heading

## React

```tsx
import {
  AppLayout, Sidebar, SidebarHeader, SidebarContent, SidebarSection,
  SidebarItem, SidebarFooter, AppShell, AppBar, SidebarTrigger, PageContent,
  Heading,
} from "@usevyre/react";

export function AppShellLayout() {
  return (
    <AppLayout>
      <Sidebar>
        <SidebarHeader title="Acme" />
        <SidebarContent>
          <SidebarSection>
            <SidebarItem href="/" active>Dashboard</SidebarItem>
            <SidebarItem href="/customers">Customers</SidebarItem>
            <SidebarItem href="/billing" badge={3}>Billing</SidebarItem>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarItem href="/settings">Settings</SidebarItem>
        </SidebarFooter>
      </Sidebar>
      <AppShell>
        <AppBar>
          <SidebarTrigger />
          <Heading size="md">Dashboard</Heading>
        </AppBar>
        <PageContent>
          {/* page content goes here */}
        </PageContent>
      </AppShell>
    </AppLayout>
  );
}
```

## Vue

```vue
<script setup lang="ts">
import {
  AppLayout, Sidebar, SidebarHeader, SidebarContent, SidebarSection,
  SidebarItem, SidebarFooter, AppShell, AppBar, SidebarTrigger, PageContent,
  Heading,
} from "@usevyre/vue";
</script>

<template>
  <AppLayout>
    <Sidebar>
      <SidebarHeader title="Acme" />
      <SidebarContent>
        <SidebarSection>
          <SidebarItem href="/" active>Dashboard</SidebarItem>
          <SidebarItem href="/customers">Customers</SidebarItem>
          <SidebarItem href="/billing" :badge="3">Billing</SidebarItem>
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <SidebarItem href="/settings">Settings</SidebarItem>
      </SidebarFooter>
    </Sidebar>
    <AppShell>
      <AppBar>
        <SidebarTrigger />
        <Heading size="md">Dashboard</Heading>
      </AppBar>
      <PageContent>
        <!-- page content goes here -->
      </PageContent>
    </AppShell>
  </AppLayout>
</template>
```
