<script setup lang="ts">
import { inject, computed, provide } from "vue";
import { ACCORDION_KEY, ITEM_KEY } from "./keys";

const props = defineProps<{ value: string; class?: string }>();

const accordion = inject(ACCORDION_KEY);
const isOpen = computed(() => accordion?.isOpen(props.value) ?? false);

provide(ITEM_KEY, { value: props.value, get isOpen() { return isOpen.value; } });
</script>

<template>
  <div
    :data-state="isOpen ? 'open' : 'closed'"
    :class="['vyre-accordion__item', $props.class]"
  >
    <slot />
  </div>
</template>
