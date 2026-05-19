import type { ComputedRef, InjectionKey } from "vue";

export interface StepperContext {
  active: ComputedRef<number>;
  setActive: (i: number) => void;
  orientation: "horizontal" | "vertical";
  clickable: boolean;
}

export const stepperKey: InjectionKey<StepperContext> =
  Symbol("vyre-stepper");
