import type { InjectionKey, Ref } from "vue";

export interface CommandCtx {
  search: Ref<string>;
  setSearch: (v: string) => void;
  activeIndex: Ref<number>;
  setActiveIndex: (i: number) => void;
  registerItem: (id: string, el: HTMLElement, disabled: boolean, onSelect?: () => void) => void;
  unregisterItem: (id: string) => void;
  selectActive: () => void;
  moveActive: (dir: 1 | -1) => void;
  isItemActive: (id: string) => boolean;
  visibleCount: Ref<number>;
  incrementVisible: () => void;
  decrementVisible: () => void;
}

export const COMMAND_KEY: InjectionKey<CommandCtx> = Symbol("vyre-command");
