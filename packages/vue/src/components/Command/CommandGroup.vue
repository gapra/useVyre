<script setup lang="ts">
import { cn } from "../../utils/cn";

const props = defineProps<{ heading?: string; class?: string }>();
</script>

<template>
  <div :class="cn('vyre-command__group', props.class)" role="presentation">
    <div v-if="heading" class="vyre-command__group-heading" aria-hidden="true">{{ heading }}</div>
    <div role="group" :aria-label="heading">
      <slot />
    </div>
  </div>
</template>
