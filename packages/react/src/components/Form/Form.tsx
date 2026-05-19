/**
 * @usevyre/react — Form + FormField
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Components: Form, FormField                                        │
 * │ Import:     import { Form, FormField } from "@usevyre/react"       │
 * │                                                                   │
 * │ Controlled, data-driven form. Zero dependencies. Validation runs  │
 * │ on submit and (after the first submit) on blur. Errors map into   │
 * │ the wrapped Field automatically (state="error" + hint=message).   │
 * │                                                                   │
 * │ <Form>                                                            │
 * │   values?       = Record<string, any>      (controlled)           │
 * │   defaultValues?= Record<string, any>      (uncontrolled)         │
 * │   onChange?     = (values) => void                                │
 * │   onSubmit      = (values) => void | Promise<void>  (valid only)  │
 * │   onInvalid?    = (errors: Record<string,string>) => void         │
 * │                                                                   │
 * │ <FormField name="email" label="Email" rules={{ ... }}>            │
 * │   <Input type="email" />   ← single control child                 │
 * │ </FormField>                                                      │
 * │   rules = { required?: boolean | string,                          │
 * │             minLength?, maxLength?, min?, max?: number,           │
 * │             pattern?: RegExp, email?: boolean,                    │
 * │             validate?: (value, allValues) => string | null }      │
 * │                                                                   │
 * │ FormField injects name / value / onChange / onBlur into its       │
 * │ child and wraps it in <Field label state hint>.                   │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [values, setValues] = useState({ email: "", password: "" });
 * <Form
 *   values={values}
 *   onChange={setValues}
 *   onSubmit={(v) => signIn(v)}
 * >
 *   <FormField name="email" label="Email" rules={{ required: true, email: true }}>
 *     <Input type="email" />
 *   </FormField>
 *   <FormField name="password" label="Password" rules={{ required: true, minLength: 8 }}>
 *     <Input type="password" />
 *   </FormField>
 *   <Button type="submit" variant="primary">Sign in</Button>
 * </Form>
 */

import React from "react";
import { cn } from "../../utils/cn";
import { Field } from "../Input/Input";

export interface FormRules {
  /** Non-empty required. Pass a string to use it as the message. */
  required?: boolean | string;
  /** Minimum string length */
  minLength?: number;
  /** Maximum string length */
  maxLength?: number;
  /** Minimum numeric value */
  min?: number;
  /** Maximum numeric value */
  max?: number;
  /** Must match this pattern */
  pattern?: RegExp;
  /** Must be a valid email address */
  email?: boolean;
  /** Custom validator — return an error message string, or null if valid */
  validate?: (
    value: unknown,
    allValues: Record<string, unknown>
  ) => string | null | undefined;
}

type Values = Record<string, unknown>;
type Errors = Record<string, string>;

interface FormContextValue {
  getValue: (name: string) => unknown;
  setValue: (name: string, value: unknown) => void;
  registerField: (name: string, rules?: FormRules) => void;
  unregisterField: (name: string) => void;
  getError: (name: string) => string | undefined;
  validateField: (name: string) => void;
  submitted: boolean;
}

const FormContext = React.createContext<FormContextValue | null>(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function runRules(
  value: unknown,
  rules: FormRules | undefined,
  allValues: Values
): string | null {
  if (!rules) return null;
  const empty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (rules.required && empty) {
    return typeof rules.required === "string"
      ? rules.required
      : "This field is required";
  }
  // Skip remaining checks when empty and not required.
  if (empty) return rules.validate ? rules.validate(value, allValues) ?? null : null;

  const str = typeof value === "string" ? value : String(value);
  if (rules.minLength !== undefined && str.length < rules.minLength)
    return `Must be at least ${rules.minLength} characters`;
  if (rules.maxLength !== undefined && str.length > rules.maxLength)
    return `Must be at most ${rules.maxLength} characters`;
  if (rules.email && !EMAIL_RE.test(str))
    return "Enter a valid email address";
  if (rules.pattern && !rules.pattern.test(str))
    return "Invalid format";
  if (rules.min !== undefined && Number(value) < rules.min)
    return `Must be at least ${rules.min}`;
  if (rules.max !== undefined && Number(value) > rules.max)
    return `Must be at most ${rules.max}`;
  if (rules.validate) return rules.validate(value, allValues) ?? null;
  return null;
}

export interface FormProps
  extends Omit<
    React.FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "onChange" | "onInvalid"
  > {
  /** Controlled values map */
  values?: Values;
  /** Initial values when uncontrolled */
  defaultValues?: Values;
  /** Called whenever any field value changes */
  onChange?: (values: Values) => void;
  /** Called with the values when the form is submitted AND valid */
  onSubmit?: (values: Values) => void | Promise<void>;
  /** Called with the error map when submitted but invalid */
  onInvalid?: (errors: Errors) => void;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      values: controlledValues,
      defaultValues,
      onChange,
      onSubmit,
      onInvalid,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const isControlled = controlledValues !== undefined;
    const [internalValues, setInternalValues] = React.useState<Values>(
      defaultValues ?? {}
    );
    const values = isControlled ? controlledValues! : internalValues;
    const valuesRef = React.useRef(values);
    valuesRef.current = values;

    const rulesRef = React.useRef<Map<string, FormRules | undefined>>(new Map());
    const [errors, setErrors] = React.useState<Errors>({});
    const [submitted, setSubmitted] = React.useState(false);

    const setValue = React.useCallback(
      (name: string, value: unknown) => {
        const next = { ...valuesRef.current, [name]: value };
        if (!isControlled) setInternalValues(next);
        onChange?.(next);
      },
      [isControlled, onChange]
    );

    const validateAll = React.useCallback((): Errors => {
      const next: Errors = {};
      rulesRef.current.forEach((rules, name) => {
        const msg = runRules(valuesRef.current[name], rules, valuesRef.current);
        if (msg) next[name] = msg;
      });
      return next;
    }, []);

    const ctx: FormContextValue = React.useMemo(
      () => ({
        getValue: (name) => valuesRef.current[name],
        setValue,
        registerField: (name, rules) => {
          rulesRef.current.set(name, rules);
        },
        unregisterField: (name) => {
          rulesRef.current.delete(name);
        },
        getError: (name) => errors[name],
        validateField: (name) => {
          if (!submitted) return;
          const msg = runRules(
            valuesRef.current[name],
            rulesRef.current.get(name),
            valuesRef.current
          );
          setErrors((prev) => {
            const n = { ...prev };
            if (msg) n[name] = msg;
            else delete n[name];
            return n;
          });
        },
        submitted,
      }),
      [setValue, errors, submitted]
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
      const next = validateAll();
      setErrors(next);
      if (Object.keys(next).length > 0) {
        onInvalid?.(next);
        return;
      }
      onSubmit?.(valuesRef.current);
    };

    return (
      <FormContext.Provider value={ctx}>
        <form
          ref={ref}
          noValidate
          className={cn("vyre-form", className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);
Form.displayName = "VyreForm";

export interface FormFieldProps {
  /** Key into the form's values map */
  name: string;
  /** Label rendered by the wrapping Field */
  label?: string;
  /** Helper text shown when there is no error */
  hint?: string;
  /** Validation rules */
  rules?: FormRules;
  /** Single form control element (Input, Textarea, Select, …) */
  children: React.ReactElement;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  hint,
  rules,
  children,
  className,
}) => {
  const ctx = React.useContext(FormContext);
  if (!ctx) {
    throw new Error("FormField must be used inside a <Form>");
  }

  React.useEffect(() => {
    ctx.registerField(name, rules);
    return () => ctx.unregisterField(name);
    // rules object identity may change each render; name is the stable key
  });

  const error = ctx.getError(name);
  const value = ctx.getValue(name);

  const child = React.Children.only(children);
  const injected = React.cloneElement(child, {
    name,
    value: value ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement> | unknown) => {
      const next =
        e && typeof e === "object" && "target" in e
          ? (e as React.ChangeEvent<HTMLInputElement>).target.value
          : e;
      ctx.setValue(name, next);
      // Re-run this field's validation live once the form was submitted.
      queueMicrotask(() => ctx.validateField(name));
      (child.props as { onChange?: (e: unknown) => void }).onChange?.(e);
    },
    onBlur: (e: unknown) => {
      ctx.validateField(name);
      (child.props as { onBlur?: (e: unknown) => void }).onBlur?.(e);
    },
  } as Partial<typeof child.props>);

  return (
    <Field
      label={label}
      hint={error ?? hint}
      state={error ? "error" : "idle"}
      className={cn("vyre-form-field", className)}
    >
      {injected}
    </Field>
  );
};
FormField.displayName = "VyreFormField";
