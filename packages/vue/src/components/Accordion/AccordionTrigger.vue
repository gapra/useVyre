<script setup lang="ts">
import { inject } from "vue";
import { ACCORDION_KEY, ITEM_KEY } from "./keys";

defineProps<{ class?: string }>();

const accordion = inject(ACCORDION_KEY);
const item = inject(ITEM_KEY);
</script>

<template>
  <button
    type="button"
    :aria-expanded="item?.isOpen"
    :data-state="item?.isOpen ? 'open' : 'closed'"
    :class="['vyre-accordion__trigger', $props.class]"
    @click="item && accordion?.toggle(item.value)"
  >
    <span class="vyre-accordion__trigger-text"><slot /></span>
    <svg class="vyre-accordion__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>
