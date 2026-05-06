<script setup lang="ts">
/**
 * @vyre/vue — Tabs
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Tabs + TabList + Tab + TabPanels + TabPanel │
 * │ Import:     import { Tabs, TabList, Tab,                │
 * │             TabPanels, TabPanel } from "@vyre/vue"      │
 * │                                                         │
 * │ Tabs props:                                             │
 * │   modelValue   = string (v-model, controlled)           │
 * │   defaultValue = string (uncontrolled)                  │
 * │                                                         │
 * │ Tab props:                                              │
 * │   value    = string (required, unique)                  │
 * │   disabled = boolean                                    │
 * │                                                         │
 * │ TabPanel props:                                         │
 * │   value = string (required, matches Tab value)          │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Tabs v-model="activeTab">
 *   <TabList>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="tokens">Tokens</Tab>
 *     <Tab value="api" disabled>API</Tab>
 *   </TabList>
 *   <TabPanels>
 *     <TabPanel value="overview"><p>Overview content</p></TabPanel>
 *     <TabPanel value="tokens"><p>Token reference</p></TabPanel>
 *   </TabPanels>
 * </Tabs>
 */

import { ref, computed, provide } from "vue";
import { cn } from "../../utils/cn";
import { TABS_KEY } from "./tabs-key";

const props = withDefaults(
  defineProps<{
    modelValue?:   string;
    defaultValue?: string;
    class?:        string;
  }>(),
  { defaultValue: "" }
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

const isControlled  = computed(() => props.modelValue !== undefined);
const internalValue = ref(props.defaultValue);
const activeValue   = computed(() =>
  isControlled.value ? (props.modelValue ?? "") : internalValue.value
);

function onChange(v: string) {
  if (!isControlled.value) internalValue.value = v;
  emit("update:modelValue", v);
}

provide(TABS_KEY, { activeValue, onChange });

const classes = computed(() => cn("vyre-tabs", props.class));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
