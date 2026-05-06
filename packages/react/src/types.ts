/**
 * useVyre — Core type utilities
 * 
 * AI CONTEXT:
 * These types define the valid prop values for ALL useVyre components.
 * When generating component code, use these types for variant/size props.
 */

// ── Variant types ─────────────────────────────────────────────

/**
 * Visual style variants available on interactive components.
 * Maps directly to --vyre-color-semantic-* tokens.
 * 
 * - primary:   High contrast, default CTA
 * - secondary: Subtle, bordered
 * - ghost:     No background or border
 * - accent:    Brand amber color — primary marketing CTA
 * - teal:      Secondary accent — confirm, info
 * - danger:    Destructive actions — delete, remove
 */
export type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "teal"
  | "danger";

/**
 * Size scale used across Button, Input, Badge, etc.
 * 
 * - sm:   Compact UI, toolbars, dense layouts
 * - md:   Default (omit for default)
 * - lg:   Hero sections, prominent CTAs
 * - icon: Square, icon-only buttons
 */
export type Size = "sm" | "md" | "lg" | "icon";

/**
 * Form/input validation states.
 * Apply to .field wrapper, not the input itself.
 */
export type FieldState = "idle" | "error" | "success" | "warning";

/**
 * Badge-specific variants — extends color semantic tokens.
 */
export type BadgeVariant =
  | "default"
  | "accent"
  | "teal"
  | "success"
  | "warning"
  | "danger";

// ── Polymorphic component utility ─────────────────────────────

/**
 * Makes a component polymorphic via `as` prop.
 * 
 * @example
 * <Button as="a" href="/docs">Link Button</Button>
 * <Button as="div" role="button">Div Button</Button>
 */
export type AsProps<T extends React.ElementType> = {
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

export type PolymorphicProps<
  T extends React.ElementType,
  Props = object
> = Props & AsProps<T> & { ref?: React.Ref<React.ElementRef<T>> };

// ── Shared component base props ───────────────────────────────

export interface BaseProps {
  /** Additional CSS class names */
  className?: string;
  /** Additional inline styles — use sparingly, prefer tokens */
  style?: React.CSSProperties;
  /** Test ID for automated testing */
  "data-testid"?: string;
}
