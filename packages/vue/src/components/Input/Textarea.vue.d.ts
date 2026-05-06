type TextareaSize = "sm" | "md" | "lg";
type TextareaResize = "none" | "vertical" | "horizontal" | "both";
type __VLS_Props = {
    size?: TextareaSize;
    resize?: TextareaResize;
    class?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    size: TextareaSize;
    resize: TextareaResize;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
