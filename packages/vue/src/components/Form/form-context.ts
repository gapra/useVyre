import type { InjectionKey } from "vue";

export interface FormRules {
  required?: boolean | string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  validate?: (
    value: unknown,
    allValues: Record<string, unknown>
  ) => string | null | undefined;
}

export interface FormContext {
  getValue: (name: string) => unknown;
  setValue: (name: string, value: unknown) => void;
  registerField: (name: string, rules?: FormRules) => void;
  unregisterField: (name: string) => void;
  getError: (name: string) => string | undefined;
  validateField: (name: string) => void;
}

export const FORM_KEY: InjectionKey<FormContext> = Symbol("vyre-form");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared rule runner — identical logic to the React Form. */
export function runRules(
  value: unknown,
  rules: FormRules | undefined,
  allValues: Record<string, unknown>
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
  if (empty) return rules.validate ? rules.validate(value, allValues) ?? null : null;

  const str = typeof value === "string" ? value : String(value);
  if (rules.minLength !== undefined && str.length < rules.minLength)
    return `Must be at least ${rules.minLength} characters`;
  if (rules.maxLength !== undefined && str.length > rules.maxLength)
    return `Must be at most ${rules.maxLength} characters`;
  if (rules.email && !EMAIL_RE.test(str)) return "Enter a valid email address";
  if (rules.pattern && !rules.pattern.test(str)) return "Invalid format";
  if (rules.min !== undefined && Number(value) < rules.min)
    return `Must be at least ${rules.min}`;
  if (rules.max !== undefined && Number(value) > rules.max)
    return `Must be at most ${rules.max}`;
  if (rules.validate) return rules.validate(value, allValues) ?? null;
  return null;
}
