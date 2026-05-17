import type { ComputedRef, InjectionKey } from "vue";

export interface RadioGroupContext {
  name: string;
  value: ComputedRef<string | undefined>;
  disabled: ComputedRef<boolean>;
  size: ComputedRef<"sm" | "md">;
  select: (value: string) => void;
}

export const radioGroupKey: InjectionKey<RadioGroupContext> =
  Symbol("vyre-radio-group");
