type ModalSize = "sm" | "md" | "lg" | "full";
type __VLS_Props = {
    open: boolean;
    size?: ModalSize;
    closeOnBackdrop?: boolean;
    closeOnEsc?: boolean;
    class?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
};
declare var __VLS_5: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_5) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: (() => any) | undefined;
}>, {
    size: ModalSize;
    closeOnBackdrop: boolean;
    closeOnEsc: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
