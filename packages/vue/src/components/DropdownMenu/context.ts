import type { InjectionKey } from "vue";

export interface DropdownCtx { close: () => void; }
export const DROPDOWN_KEY: InjectionKey<DropdownCtx> = Symbol("vyre-dropdown");
