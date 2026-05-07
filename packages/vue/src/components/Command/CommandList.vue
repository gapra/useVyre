<script setup lang="ts">
import { inject } from "vue";
import { cn } from "../../utils/cn";
import { COMMAND_KEY } from "./command-key";

const props = defineProps<{ class?: string }>();
const ctx = inject(COMMAND_KEY)!;
</script>

<template>
  <div
    id="vyre-command-list"
    role="listbox"
    :class="cn('vyre-command__list', props.class)"
    @keydown.down.prevent="ctx.moveActive(1)"
    @keydown.up.prevent="ctx.moveActive(-1)"
    @keydown.enter.prevent="ctx.selectActive()"
  >
    <slot />
  </div>
</template>
