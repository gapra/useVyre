<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";
const props = withDefaults(
  defineProps<{ separated?: boolean; class?: string }>(),
  { separated: false }
);
const classes = computed(() =>
  cn(
    "vyre-item-group",
    props.separated && "vyre-item-group--separated",
    props.class
  )
);
</script>
<template>
  <div role="list" :class="classes"><slot /></div>
</template>
