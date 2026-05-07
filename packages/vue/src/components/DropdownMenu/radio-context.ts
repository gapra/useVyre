import type { InjectionKey } from "vue";

export interface RadioCtx { value: string; onValueChange: (v: string) => void; }
export const RADIO_KEY: InjectionKey<RadioCtx> = Symbol("vyre-dropdown-radio");
