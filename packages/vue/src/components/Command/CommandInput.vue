<script setup lang="ts">
import { inject } from "vue";
import { cn } from "../../utils/cn";
import { COMMAND_KEY } from "./command-key";

const props = withDefaults(defineProps<{ placeholder?: string; class?: string }>(), { placeholder: "Search..." });
const ctx = inject(COMMAND_KEY)!;
</script>

<template>
  <div class="vyre-command__input-wrapper">
    <svg class="vyre-command__search-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.5 10.207l3.146 3.147" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>
    <input
      :class="cn('vyre-command__input', props.class)"
      type="text"
      :placeholder="props.placeholder"
      :value="ctx.search.value"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      aria-autocomplete="list"
      aria-controls="vyre-command-list"
      @input="ctx.setSearch(($event.target as HTMLInputElement).value)"
      @keydown.down.prevent="ctx.moveActive(1)"
      @keydown.up.prevent="ctx.moveActive(-1)"
      @keydown.enter.prevent="ctx.selectActive()"
    />
    <button
      v-if="ctx.search.value"
      class="vyre-command__clear"
      type="button"
      aria-label="Clear search"
      @click="ctx.setSearch('')"
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>
