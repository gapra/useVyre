<script setup lang="ts">
import { inject } from "vue";
import { cn } from "../../utils/cn";
import { COMMAND_KEY } from "./command-key";

const props = defineProps<{ class?: string }>();
const ctx = inject(COMMAND_KEY)!;
</script>

<template>
  <div v-if="ctx.search.value && ctx.visibleCount.value === 0" :class="cn('vyre-command__empty', props.class)" role="presentation">
    <slot>No results found.</slot>
  </div>
</template>
