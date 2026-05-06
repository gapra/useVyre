import type { InjectionKey } from "vue";

export interface AccordionCtx {
  isOpen: (v: string) => boolean;
  toggle: (v: string) => void;
}
export interface ItemCtx {
  value: string;
  isOpen: boolean;
}

export const ACCORDION_KEY: InjectionKey<AccordionCtx> = Symbol("vyre-accordion");
export const ITEM_KEY: InjectionKey<ItemCtx> = Symbol("vyre-accordion-item");
