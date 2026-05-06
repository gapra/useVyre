export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
type SelectSize = "sm" | "md" | "lg";
type __VLS_Props = {
    options: SelectOption[];
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    size?: SelectSize;
    class?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    size: SelectSize;
    disabled: boolean;
    placeholder: string;
    modelValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
