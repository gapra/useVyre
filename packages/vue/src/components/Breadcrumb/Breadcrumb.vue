<script setup lang="ts">
/**
 * @usevyre/vue — Breadcrumb
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Breadcrumb + BreadcrumbItem                 │
 * │ Import:     import { Breadcrumb, BreadcrumbItem }       │
 * │             from "@usevyre/vue"                            │
 * │                                                         │
 * │ Breadcrumb props:                                       │
 * │   separator = string (default: "/")                     │
 * │                                                         │
 * │ BreadcrumbItem props:                                   │
 * │   href    = string (omit for current item)              │
 * │   current = boolean                                     │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Breadcrumb>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
 *   <BreadcrumbItem current>Button</BreadcrumbItem>
 * </Breadcrumb>
 */
import { cn } from "../../utils/cn";
const props = withDefaults(
  defineProps<{ separator?: string; class?: string }>(),
  { separator: "/" }
);
</script>

<template>
  <nav aria-label="Breadcrumb" :class="cn('vyre-breadcrumb', props.class)">
    <ol class="vyre-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>
