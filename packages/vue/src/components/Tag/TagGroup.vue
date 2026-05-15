<script setup lang="ts">
/**
 * @usevyre/vue — TagGroup
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  TagGroup                                    │
 * │ Import:     import { TagGroup, Tag } from "@usevyre/vue" │
 * │                                                         │
 * │ Props:                                                  │
 * │   gap   = "sm"|"md"(default)|"lg"                       │
 * │   wrap  = boolean (default: true)                       │
 * │                                                         │
 * │ Read-only container that lays out multiple <Tag>        │
 * │ elements with wrapping + spacing. For tag INPUT use     │
 * │ TagsInput instead.                                      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <TagGroup>
 *   <Tag>React</Tag>
 *   <Tag>Vue</Tag>
 *   <Tag variant="accent">TypeScript</Tag>
 * </TagGroup>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type TagGroupGap = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    gap?: TagGroupGap;
    wrap?: boolean;
    class?: string;
  }>(),
  { gap: "md", wrap: true }
);

const classes = computed(() =>
  cn(
    "vyre-tag-group",
    `vyre-tag-group--gap-${props.gap}`,
    !props.wrap && "vyre-tag-group--nowrap",
    props.class
  )
);
</script>

<template>
  <div :class="classes" role="list">
    <slot />
  </div>
</template>
