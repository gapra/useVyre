<script setup lang="ts">
import { computed, inject } from "vue";
import { cn } from "../../utils/cn";
import { TABS_KEY } from "./tabs-key";

const props = defineProps<{ value: string; class?: string }>();
const ctx      = inject(TABS_KEY);
const isActive = computed(() => ctx?.activeValue.value === props.value);
const classes  = computed(() => cn("vyre-tabs__panel", props.class));
</script>

<template>
  <div
    v-if="isActive"
    role="tabpanel"
    :class="classes"
    tabindex="0"
  >
    <slot />
  </div>
</template>
