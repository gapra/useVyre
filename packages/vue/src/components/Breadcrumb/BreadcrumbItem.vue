<script setup lang="ts">
import { cn } from "../../utils/cn";
const props = withDefaults(
  defineProps<{ href?: string; current?: boolean; separator?: string; class?: string }>(),
  { separator: "/" }
);
</script>

<template>
  <li class="vyre-breadcrumb__item">
    <span
      v-if="current || !href"
      :class="cn('vyre-breadcrumb__link vyre-breadcrumb__link--current', props.class)"
      :aria-current="current ? 'page' : undefined"
    ><slot /></span>
    <a v-else :href="href" :class="cn('vyre-breadcrumb__link', props.class)"><slot /></a>
    <span class="vyre-breadcrumb__separator" aria-hidden="true">{{ separator }}</span>
  </li>
</template>
