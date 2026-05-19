<!--
  @usevyre/vue — CarouselSlide (use inside <Carousel>)
-->
<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../utils/cn";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("vyre-carousel__slide", props.class));
</script>

<template>
  <div role="group" aria-roledescription="slide" :class="classes">
    <slot />
  </div>
</template>
