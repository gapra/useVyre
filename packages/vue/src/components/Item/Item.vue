<script setup lang="ts">
/**
 * @usevyre/vue — Item
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  Item + ItemGroup + ItemMedia + ItemContent +         │
 * │             ItemTitle + ItemDescription + ItemActions            │
 * │ Import:     import { Item, ItemContent, ... } from "@usevyre/vue" │
 * │                                                                  │
 * │ Item props:                                                      │
 * │   variant   = "default"(default)|"outlined"|"muted"|"plain"      │
 * │     plain → transparent, no border (compose inside a surface)    │
 * │   size      = "sm"|"md"(default)|"lg"                             │
 * │   clickable = boolean (cursor pointer + hover + role=button)     │
 * │                                                                  │
 * │ ItemGroup props:                                                 │
 * │   separated = boolean (adds dividers between items)              │
 * │                                                                  │
 * │ Slots (default), structured left → right:                        │
 * │   <ItemMedia>     ← optional: icon / avatar / thumbnail          │
 * │   <ItemContent>   ← required: text column                        │
 * │     <ItemTitle> / <ItemDescription>                              │
 * │   <ItemActions>   ← optional: buttons / menu, pinned right       │
 * │                                                                  │
 * │ Use Item for list rows, settings rows, notification rows.        │
 * │ Do NOT use Card for dense list rows — Item is the primitive.     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <Item>
 *   <ItemMedia><BellIcon /></ItemMedia>
 *   <ItemContent>
 *     <ItemTitle>Notifications</ItemTitle>
 *     <ItemDescription>Receive email when someone mentions you.</ItemDescription>
 *   </ItemContent>
 *   <ItemActions><Switch :model-value="true" /></ItemActions>
 * </Item>
 *
 * <ItemGroup separated>
 *   <Item clickable><ItemContent><ItemTitle>Profile</ItemTitle></ItemContent></Item>
 *   <Item clickable><ItemContent><ItemTitle>Billing</ItemTitle></ItemContent></Item>
 * </ItemGroup>
 */

import { computed } from "vue";
import { cn } from "../../utils/cn";

type ItemVariant = "default" | "outlined" | "muted" | "plain";
type ItemSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: ItemVariant;
    size?: ItemSize;
    clickable?: boolean;
    class?: string;
  }>(),
  { variant: "default", size: "md", clickable: false }
);

const classes = computed(() =>
  cn(
    "vyre-item",
    `vyre-item--${props.variant}`,
    `vyre-item--${props.size}`,
    props.clickable && "vyre-item--clickable",
    props.class
  )
);
</script>

<template>
  <div
    :class="classes"
    :data-variant="variant"
    :data-size="size"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
  >
    <slot />
  </div>
</template>
