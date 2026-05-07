<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = defineProps<{ title?: string; class?: string }>();
</script>
<template>
  <div :class="cn('vyre-sidebar__header', props.class)">
    <span v-if="$slots.logo" class="vyre-sidebar__logo"><slot name="logo" /></span>
    <span v-if="title" class="vyre-sidebar__title">{{ title }}</span>
    <slot />
  </div>
</template>
