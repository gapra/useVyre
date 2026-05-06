import type { ComputedRef, InjectionKey } from "vue";

export interface TabsContext {
  activeValue: ComputedRef<string>;
  onChange:    (value: string) => void;
}

export const TABS_KEY: InjectionKey<TabsContext> = Symbol("vyre-tabs");
