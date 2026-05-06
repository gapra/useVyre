type Variant = "primary" | "secondary" | "ghost" | "accent" | "teal" | "danger";
type Size = "sm" | "md" | "lg" | "icon";
type __VLS_Props = {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    disabled?: boolean;
    as?: string;
    class?: string;
};
declare var __VLS_6: {}, __VLS_8: {}, __VLS_10: {};
type __VLS_Slots = {} & {
    'left-icon'?: (props: typeof __VLS_6) => any;
} & {
    default?: (props: typeof __VLS_8) => any;
} & {
    'right-icon'?: (props: typeof __VLS_10) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    variant: Variant;
    size: Size;
    loading: boolean;
    disabled: boolean;
    as: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
