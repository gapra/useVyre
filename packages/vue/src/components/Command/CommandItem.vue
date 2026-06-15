<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, computed, watch } from "vue";
import { cn } from "../../utils/cn";
import { COMMAND_KEY } from "./command-key";

const props = withDefaults(defineProps<{
  disabled?: boolean;
  keywords?: string[];
  class?: string;
  shortcut?: string;
}>(), { disabled: false });

const emit = defineEmits<{ (e: "select"): void }>();
const ctx = inject(COMMAND_KEY)!;

const el = ref<HTMLElement | null>(null);
const id = `cmd-item-${Math.random().toString(36).slice(2)}`;

function normalize(s: string) { return s.toLowerCase().replace(/\s+/g, " ").trim(); }

const textContent = computed(() => el.value?.querySelector(".vyre-command__item-label")?.textContent ?? "");

const visible = computed(() => {
  const q = normalize(ctx.search.value);
  if (!q) return true;
  if (normalize(textContent.value).includes(q)) return true;
  return (props.keywords ?? []).some((k) => normalize(k).includes(q));
});

const isActive = computed(() => !props.disabled && ctx.isItemActive(id));

onMounted(() => {
  if (el.value && !props.disabled) {
    ctx.registerItem(id, el.value, props.disabled, () => emit("select"));
  }
  if (visible.value) ctx.incrementVisible();
});

watch(visible, (v, old) => {
  if (el.value) {
    if (v && !props.disabled) ctx.registerItem(id, el.value, props.disabled, () => emit("select"));
    else ctx.unregisterItem(id);
  }
  if (v && !old) ctx.incrementVisible();
  else if (!v && old) ctx.decrementVisible();
});

onUnmounted(() => {
  ctx.unregisterItem(id);
  if (visible.value) ctx.decrementVisible();
});
</script>

<template>
  <div
    v-show="visible"
    ref="el"
    data-cmd-item
    role="option"
    :aria-selected="isActive || undefined"
    :aria-disabled="disabled || undefined"
    :class="cn('vyre-command__item', disabled && 'vyre-command__item--disabled', props.class)"
    @click="() => { if (!disabled) emit('select'); }"
  >
    <span v-if="$slots.icon" class="vyre-command__item-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="vyre-command__item-label"><slot /></span>
    <kbd v-if="shortcut" class="vyre-command__item-shortcut">{{ shortcut }}</kbd>
  </div>
</template>
