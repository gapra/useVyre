<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = withDefaults(defineProps<{ block?: boolean; class?: string }>(), { block: false });
</script>
<template>
  <pre v-if="block" :class="cn('vyre-code-block', props.class)"><code><slot /></code></pre>
  <code v-else :class="cn('vyre-code', props.class)"><slot /></code>
</template>
