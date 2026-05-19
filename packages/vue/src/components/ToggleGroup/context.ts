import type { InjectionKey } from "vue";

export interface ToggleGroupContext {
  isSelected: (value: string) => boolean;
  toggle: (value: string) => void;
  size: "sm" | "md" | "lg";
  groupDisabled: boolean;
}

export const toggleGroupKey: InjectionKey<ToggleGroupContext> =
  Symbol("vyre-toggle-group");

export interface ToggleOption {
  value: string;
  label?: string;
  disabled?: boolean;
}
