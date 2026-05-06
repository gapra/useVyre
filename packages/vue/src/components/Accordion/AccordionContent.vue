<script setup lang="ts">
import { inject } from "vue";
import { ITEM_KEY } from "./keys";

defineProps<{ class?: string }>();
const item = inject(ITEM_KEY);
</script>

<template>
  <div
    v-show="item?.isOpen"
    :data-state="item?.isOpen ? 'open' : 'closed'"
    :class="['vyre-accordion__content', $props.class]"
  >
    <div class="vyre-accordion__content-inner">
      <slot />
    </div>
  </div>
</template>
