<!--
  @usevyre/vue — Carousel

  AI CONTEXT:
  ┌──────────────────────────────────────────────────────────────────┐
  │ Component:  Carousel (+ CarouselSlide)                            │
  │ Import: import { Carousel, CarouselSlide } from "@usevyre/vue"     │
  │                                                                   │
  │ Accessible content slider. CONTROLLED by a 0-based index.         │
  │                                                                   │
  │   v-model        = number  (active slide index)                   │
  │   default-value  = number  (uncontrolled, default 0)              │
  │   loop           = boolean                                         │
  │   auto-play      = boolean   interval = ms (default 5000)         │
  │   show-arrows    = boolean (default true)                          │
  │   show-indicators= boolean (default true)                          │
  │   default slot   = <CarouselSlide> elements                        │
  │                                                                   │
  │ Snap scrolling, clickable dots, ←/→ keyboard, autoplay pauses     │
  │ on hover/focus.                                                    │
  └──────────────────────────────────────────────────────────────────┘
-->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { cn } from "../../utils/cn";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    defaultValue?: number;
    loop?: boolean;
    autoPlay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showIndicators?: boolean;
    ariaLabel?: string;
    class?: string;
  }>(),
  {
    defaultValue: 0,
    loop: false,
    autoPlay: false,
    interval: 5000,
    showArrows: true,
    showIndicators: true,
    ariaLabel: "Carousel",
  }
);

const emit = defineEmits<{ "update:modelValue": [i: number] }>();

const trackRef = ref<HTMLElement | null>(null);
const count = ref(0);
const paused = ref(false);

const isControlled = computed(() => props.modelValue !== undefined);
const internal = ref(props.defaultValue);
const active = computed(() => {
  const raw = isControlled.value
    ? (props.modelValue as number)
    : internal.value;
  return Math.min(Math.max(raw, 0), Math.max(count.value - 1, 0));
});

function go(next: number) {
  let n = next;
  if (n < 0) n = props.loop ? count.value - 1 : 0;
  else if (n > count.value - 1) n = props.loop ? 0 : count.value - 1;
  if (!isControlled.value) internal.value = n;
  emit("update:modelValue", n);
}

function measure() {
  count.value =
    trackRef.value?.querySelectorAll(".vyre-carousel__slide").length ?? 0;
}

function scrollToActive() {
  const track = trackRef.value;
  if (!track) return;
  const el = track.children[active.value] as HTMLElement | undefined;
  if (el)
    track.scrollTo({
      left: el.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
}

watch(active, () => nextTick(scrollToActive));

let timer: number | undefined;
function startAuto() {
  stopAuto();
  if (!props.autoPlay || paused.value || count.value < 2) return;
  timer = window.setInterval(() => {
    const a = active.value;
    go(a + 1 > count.value - 1 ? (props.loop ? 0 : a) : a + 1);
  }, props.interval);
}
function stopAuto() {
  if (timer) window.clearInterval(timer);
  timer = undefined;
}
watch([() => props.autoPlay, paused, count, active], () => startAuto());

onMounted(() => {
  measure();
  nextTick(scrollToActive);
  startAuto();
});
onBeforeUnmount(stopAuto);

function onKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    go(active.value - 1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    go(active.value + 1);
  }
}

const classes = computed(() => cn("vyre-carousel", props.class));
</script>

<template>
  <div
    :class="classes"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
    @keydown="onKeydown"
  >
    <div class="vyre-carousel__viewport">
      <div
        ref="trackRef"
        class="vyre-carousel__track"
        :tabindex="0"
        :aria-live="autoPlay ? 'off' : 'polite'"
      >
        <slot />
      </div>

      <template v-if="showArrows && count > 1">
        <button
          type="button"
          class="vyre-carousel__arrow vyre-carousel__arrow--prev"
          aria-label="Previous slide"
          :disabled="!loop && active === 0"
          @click="go(active - 1)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="vyre-carousel__arrow vyre-carousel__arrow--next"
          aria-label="Next slide"
          :disabled="!loop && active === count - 1"
          @click="go(active + 1)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </template>
    </div>

    <div
      v-if="showIndicators && count > 1"
      class="vyre-carousel__indicators"
      role="tablist"
    >
      <button
        v-for="i in count"
        :key="i"
        type="button"
        role="tab"
        :aria-label="`Go to slide ${i}`"
        :aria-selected="i - 1 === active"
        :data-active="i - 1 === active ? '' : undefined"
        class="vyre-carousel__dot"
        @click="go(i - 1)"
      />
    </div>
  </div>
</template>
