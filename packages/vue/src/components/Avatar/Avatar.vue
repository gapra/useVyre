<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  class?: string;
}>(), { size: "md", alt: "" });

const imgError = ref(false);
const showImage = computed(() => props.src && !imgError.value);
const initials = computed(() =>
  props.fallback ?? props.alt?.charAt(0)?.toUpperCase() ?? "?"
);
</script>

<template>
  <span
    :data-size="size"
    :class="['vyre-avatar', $props.class]"
  >
    <img
      v-if="showImage"
      :src="src"
      :alt="alt"
      class="vyre-avatar__img"
      @error="imgError = true"
    />
    <span
      v-else
      class="vyre-avatar__fallback"
      :aria-label="alt || fallback"
    >{{ initials }}</span>
    <span
      v-if="status"
      :class="`vyre-avatar__status vyre-avatar__status--${status}`"
      :aria-label="status"
    />
  </span>
</template>
