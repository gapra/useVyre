/**
 * @usevyre/react — Typography
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────┐
 * │ Components: Text · Heading · Code · Blockquote · Lead       │
 * │ Import:     import { Text, Heading, ... } from "@usevyre/react" │
 * │                                                              │
 * │ Text props:                                                  │
 * │   as       = "p"(default)|"span"|"div"|"label"|"li"|"dt"|"dd"│
 * │   size     = "xs"|"sm"|"md"(default)|"lg"|"xl"              │
 * │   weight   = "normal"|"medium"|"semibold"|"bold"            │
 * │   color    = "default"|"muted"|"accent"|"danger"|"success"  │
 * │   truncate = boolean                                         │
 * │   mono     = boolean                                         │
 * │                                                              │
 * │ Heading props:                                               │
 * │   as       = "h1"|"h2"(default)|"h3"|"h4"|"h5"|"h6"        │
 * │   size     = "xs"|"sm"|"md"(default)|"lg"|"xl"|"2xl"|"3xl" │
 * │   weight   = "normal"|"medium"|"semibold"|"bold"(default)   │
 * │                                                              │
 * │ Code props:                                                  │
 * │   block    = boolean (renders as <pre><code> block)         │
 * └──────────────────────────────────────────────────────────────┘
 *
 * @example
 * <Heading as="h1" size="3xl">Page title</Heading>
 * <Text color="muted">Supporting description.</Text>
 * <Lead>Introductory paragraph with larger text.</Lead>
 * <Code>npm install @usevyre/react</Code>
 * <Blockquote>A meaningful quote.</Blockquote>
 */

import React from "react";
import { cn } from "../../utils/cn";

// ── Text ──────────────────────────────────────────────────────

type TextAs = "p" | "span" | "div" | "label" | "li" | "dt" | "dd";
type TextSize = "xs" | "sm" | "md" | "lg" | "xl";
type TextWeight = "normal" | "medium" | "semibold" | "bold";
type TextColor = "default" | "muted" | "accent" | "danger" | "success" | "warning";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextAs;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  truncate?: boolean;
  mono?: boolean;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({
    as: Tag = "p",
    size = "md",
    weight,
    color = "default",
    truncate,
    mono,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <Tag
        ref={ref as never}
        className={cn(
          "vyre-text",
          size !== "md" && `vyre-text--${size}`,
          weight && `vyre-text--${weight}`,
          color !== "default" && `vyre-text--${color}`,
          truncate && "vyre-text--truncate",
          mono && "vyre-text--mono",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Text.displayName = "VyreText";

// ── Heading ───────────────────────────────────────────────────

type HeadingAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingAs;
  size?: HeadingSize;
  weight?: TextWeight;
  color?: TextColor;
  truncate?: boolean;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({
    as: Tag = "h2",
    size = "md",
    weight = "bold",
    color = "default",
    truncate,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          "vyre-heading",
          `vyre-heading--${size}`,
          weight !== "bold" && `vyre-heading--${weight}`,
          color !== "default" && `vyre-text--${color}`,
          truncate && "vyre-text--truncate",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
Heading.displayName = "VyreHeading";

// ── Lead ─────────────────────────────────────────────────────

export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("vyre-lead", className)} {...props}>
      {children}
    </p>
  )
);
Lead.displayName = "VyreLead";

// ── Code ─────────────────────────────────────────────────────

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  block?: boolean;
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ block, className, children, ...props }, ref) => {
    if (block) {
      return (
        <pre className={cn("vyre-code-block", className)} {...props}>
          <code ref={ref as React.Ref<HTMLElement>}>{children}</code>
        </pre>
      );
    }
    return (
      <code
        ref={ref as React.Ref<HTMLElement>}
        className={cn("vyre-code", className)}
        {...props}
      >
        {children}
      </code>
    );
  }
);
Code.displayName = "VyreCode";

// ── Blockquote ────────────────────────────────────────────────

export interface BlockquoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {}

export const Blockquote = React.forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ className, children, ...props }, ref) => (
    <blockquote ref={ref} className={cn("vyre-blockquote", className)} {...props}>
      {children}
    </blockquote>
  )
);
Blockquote.displayName = "VyreBlockquote";
