/**
 * @usevyre/react — Layout primitives (Stack, Grid, GridItem, Box)
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Components: Stack, Grid, GridItem, Box                             │
 * │ Import: import { Stack, Grid, GridItem, Box } from "@usevyre/react"│
 * │                                                                   │
 * │ USE THESE INSTEAD OF <div style={{ display: "flex" }}>.           │
 * │ Every spacing value is a design token — never a raw px/rem number.│
 * │                                                                   │
 * │ Stack/Grid/Box share width/height (avoids inline width style):    │
 * │   width|height = "auto"|"full"|"fit"|"screen"                     │
 * │                  | xs|sm|md|lg|xl|2xl  (fixed rem sizes)          │
 * │                                                                   │
 * │ <Stack>  full one-dimensional flex layout                         │
 * │   direction   = "row"(default)|"column"|"row-reverse"             │
 * │                 |"column-reverse"                                  │
 * │   inline      = boolean (display:inline-flex)                      │
 * │   gap         = token; rowGap / columnGap = token (per-axis)      │
 * │   align       = items: start|center|end|stretch|baseline          │
 * │   justify     = content: start|center|end|between|around|evenly   │
 * │   alignContent= multi-line: start|center|end|stretch|between      │
 * │                 |around|evenly                                     │
 * │   alignSelf   = auto|start|center|end|stretch|baseline            │
 * │   wrap        = "nowrap"(default)|"wrap"|"wrap-reverse"            │
 * │   grow shrink = number    basis = token|"auto"|"content"|"0"      │
 * │   as          = any HTML tag (default: "div")                      │
 * │                                                                   │
 * │ <Grid>  two-dimensional CSS grid                                  │
 * │   columns = number (1-12) | "auto-fit" (default: 1)               │
 * │   rows    = number | "auto"                                        │
 * │   flow    = "row"|"column"|"dense"|"row-dense"|"column-dense"      │
 * │   gap / rowGap / columnGap = token                                 │
 * │   align   = align-items     justify = justify-items               │
 * │   as      = any HTML tag (default: "div")                          │
 * │ <GridItem>  child placement                                       │
 * │   colSpan rowSpan colStart rowStart = number                      │
 * │                                                                   │
 * │ <Box>  spacing-only container + controlled escape hatch           │
 * │   padding  paddingX paddingY                                       │
 * │   paddingTop paddingRight paddingBottom paddingLeft = token       │
 * │   margin   marginX  marginY                                        │
 * │   marginTop marginRight marginBottom marginLeft = token           │
 * │   (per-side overrides the X/Y/shorthand it belongs to)            │
 * │   as = any HTML tag (default: "div")                               │
 * │   style = ANTI-PATTERN escape hatch — prefer tokens.              │
 * │                                                                   │
 * │ All render a plain <div> (or `as`) in the browser.                │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <Stack direction="column" gap="md" align="center">
 *   <Avatar src={user.avatar} />
 *   <Text>{user.name}</Text>
 * </Stack>
 *
 * @example
 * <Grid columns={3} gap="lg">
 *   <GridItem colSpan={2}><Card>Wide</Card></GridItem>
 *   <Card>…</Card>
 * </Grid>
 */

import React from "react";
import { cn } from "../../utils/cn";

/** Semantic spacing scale — maps to --vyre-spacing-* tokens. */
export type SpaceToken =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl";

export type StackDirection =
  | "row"
  | "column"
  | "row-reverse"
  | "column-reverse";
export type StackWrap = "nowrap" | "wrap" | "wrap-reverse";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";
export type StackAlignContent =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "between"
  | "around"
  | "evenly";
export type StackAlignSelf =
  | "auto"
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";
export type StackBasis = SpaceToken | "auto" | "content" | "0";

export type GridAlign = "start" | "center" | "end" | "stretch";
export type GridFlow =
  | "row"
  | "column"
  | "dense"
  | "row-dense"
  | "column-dense";
export type GridColumns = number | "auto-fit";

/**
 * Sizing scale for width / height.
 * - Keywords: "auto" | "full" (100%) | "fit" (fit-content) | "screen"
 *   (100vw for width, 100vh for height)
 * - Token sizes (fixed rem): xs 8 · sm 12 · md 16 · lg 24 · xl 32 · 2xl 42
 */
export type SizeToken =
  | "auto"
  | "full"
  | "fit"
  | "screen"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl";

interface SizingProps {
  /** Width — keyword or token size. Avoids an inline width style. */
  width?: SizeToken;
  /** Height — keyword or token size. Avoids an inline height style. */
  height?: SizeToken;
}

type PolymorphicProps<P> = P & {
  /** HTML element to render. Always a real DOM element in the browser. */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /**
   * Inline styles. Prefer the token props above; use this only for values
   * the design system genuinely cannot express. Flagged as an anti-pattern
   * by @usevyre/eslint-plugin (no-inline-layout-styles).
   */
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** undefined-safe data attribute helper */
const attr = (v: unknown) =>
  v === undefined || v === null || v === false ? undefined : String(v);

/** Resolve a flex-basis value to a CSS length / keyword. */
const SP_VAR: Record<SpaceToken, string> = {
  none: "var(--vyre-spacing-0)",
  xs: "var(--vyre-spacing-2)",
  sm: "var(--vyre-spacing-3)",
  md: "var(--vyre-spacing-4)",
  lg: "var(--vyre-spacing-6)",
  xl: "var(--vyre-spacing-8)",
  "2xl": "var(--vyre-spacing-12)",
};
const resolveBasis = (b: StackBasis): string =>
  b === "auto" || b === "content"
    ? b
    : b === "0"
      ? "0"
      : SP_VAR[b];

// ── Stack ─────────────────────────────────────────────────────

export interface StackProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>>,
    SizingProps {
  /** Main axis direction (flex-direction) */
  direction?: StackDirection;
  /** Render as inline-flex instead of flex */
  inline?: boolean;
  /** Space between children — design token */
  gap?: SpaceToken;
  /** Row gap override — design token */
  rowGap?: SpaceToken;
  /** Column gap override — design token */
  columnGap?: SpaceToken;
  /** Cross-axis alignment of items (align-items) */
  align?: StackAlign;
  /** Main-axis distribution (justify-content) */
  justify?: StackJustify;
  /** Multi-line cross-axis distribution (align-content) */
  alignContent?: StackAlignContent;
  /** This element's own cross-axis alignment (align-self) */
  alignSelf?: StackAlignSelf;
  /** Wrapping behaviour (flex-wrap). `true` is treated as "wrap". */
  wrap?: StackWrap | boolean;
  /** flex-grow */
  grow?: number;
  /** flex-shrink */
  shrink?: number;
  /** flex-basis — token, "auto", "content", or "0" */
  basis?: StackBasis;
}

export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    {
      as: Tag = "div",
      direction = "row",
      inline = false,
      gap = "md",
      rowGap,
      columnGap,
      align = "stretch",
      justify = "start",
      alignContent,
      alignSelf,
      wrap = "nowrap",
      grow,
      shrink,
      basis,
      width,
      height,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = Tag as React.ElementType;
    const { style: userStyle, ...domProps } = rest;
    return (
      <Component
        ref={ref}
        className={cn("vyre-stack", className)}
        data-inline={inline ? "" : undefined}
        data-w={width}
        data-h={height}
        data-direction={direction}
        data-gap={gap}
        data-row-gap={rowGap}
        data-column-gap={columnGap}
        data-align={align}
        data-justify={justify}
        data-align-content={alignContent}
        data-align-self={alignSelf}
        data-wrap={wrap === true ? "wrap" : wrap === false ? "nowrap" : wrap}
        {...domProps}
        style={{
          ...(grow !== undefined ? { flexGrow: grow } : null),
          ...(shrink !== undefined ? { flexShrink: shrink } : null),
          ...(basis !== undefined
            ? { ["--vyre-stack-basis" as string]: resolveBasis(basis) }
            : null),
          ...userStyle,
        }}
      >
        {children}
      </Component>
    );
  }
);
Stack.displayName = "VyreStack";

// ── Grid ──────────────────────────────────────────────────────

export interface GridProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>>,
    SizingProps {
  /** Number of equal columns (1–12) or responsive "auto-fit" */
  columns?: GridColumns;
  /** Explicit row count, or "auto" */
  rows?: number | "auto";
  /** Auto-placement flow (grid-auto-flow) */
  flow?: GridFlow;
  /** Space between cells — design token */
  gap?: SpaceToken;
  /** Row gap override — design token */
  rowGap?: SpaceToken;
  /** Column gap override — design token */
  columnGap?: SpaceToken;
  /** Cross-axis alignment of cells (align-items) */
  align?: GridAlign;
  /** Inline-axis alignment of cells (justify-items) */
  justify?: GridAlign;
}

export const Grid = React.forwardRef<HTMLElement, GridProps>(
  (
    {
      as: Tag = "div",
      columns = 1,
      rows,
      flow,
      gap = "md",
      rowGap,
      columnGap,
      align = "stretch",
      justify,
      width,
      height,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = Tag as React.ElementType;
    const isAutoFit = columns === "auto-fit";
    const { style: userStyle, ...domProps } = rest;
    return (
      <Component
        ref={ref}
        className={cn("vyre-grid", className)}
        data-w={width}
        data-h={height}
        data-columns={isAutoFit ? "auto-fit" : undefined}
        data-rows={rows !== undefined ? "" : undefined}
        data-flow={flow}
        data-gap={gap}
        data-row-gap={rowGap}
        data-column-gap={columnGap}
        data-align={align}
        data-justify={justify}
        {...domProps}
        style={{
          ...(isAutoFit
            ? null
            : { ["--vyre-grid-columns" as string]: String(columns) }),
          ...(rows !== undefined && rows !== "auto"
            ? { ["--vyre-grid-rows" as string]: String(rows) }
            : null),
          ...userStyle,
        }}
      >
        {children}
      </Component>
    );
  }
);
Grid.displayName = "VyreGrid";

// ── GridItem ──────────────────────────────────────────────────

export interface GridItemProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>> {
  /** Number of columns this item spans */
  colSpan?: number;
  /** Number of rows this item spans */
  rowSpan?: number;
  /** 1-based column line this item starts at */
  colStart?: number;
  /** 1-based row line this item starts at */
  rowStart?: number;
}

export const GridItem = React.forwardRef<HTMLElement, GridItemProps>(
  (
    {
      as: Tag = "div",
      colSpan,
      rowSpan,
      colStart,
      rowStart,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = Tag as React.ElementType;
    const { style: userStyle, ...domProps } = rest;
    return (
      <Component
        ref={ref}
        className={cn("vyre-grid-item", className)}
        data-col-span={attr(colSpan)}
        data-row-span={attr(rowSpan)}
        data-col-start={attr(colStart)}
        data-row-start={attr(rowStart)}
        {...domProps}
        style={{
          ...(colSpan !== undefined
            ? { ["--vyre-grid-item-col-span" as string]: String(colSpan) }
            : null),
          ...(rowSpan !== undefined
            ? { ["--vyre-grid-item-row-span" as string]: String(rowSpan) }
            : null),
          ...(colStart !== undefined
            ? { ["--vyre-grid-item-col-start" as string]: String(colStart) }
            : null),
          ...(rowStart !== undefined
            ? { ["--vyre-grid-item-row-start" as string]: String(rowStart) }
            : null),
          ...userStyle,
        }}
      >
        {children}
      </Component>
    );
  }
);
GridItem.displayName = "VyreGridItem";

// ── Box ───────────────────────────────────────────────────────

export interface BoxProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>>,
    SizingProps {
  /** Inner spacing (all sides) — design token */
  padding?: SpaceToken;
  /** Inner spacing left+right — design token */
  paddingX?: SpaceToken;
  /** Inner spacing top+bottom — design token */
  paddingY?: SpaceToken;
  paddingTop?: SpaceToken;
  paddingRight?: SpaceToken;
  paddingBottom?: SpaceToken;
  paddingLeft?: SpaceToken;
  /** Outer spacing (all sides) — design token */
  margin?: SpaceToken;
  /** Outer spacing left+right — design token */
  marginX?: SpaceToken;
  /** Outer spacing top+bottom — design token */
  marginY?: SpaceToken;
  marginTop?: SpaceToken;
  marginRight?: SpaceToken;
  marginBottom?: SpaceToken;
  marginLeft?: SpaceToken;
}

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  (
    {
      as: Tag = "div",
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      margin,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      width,
      height,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = Tag as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn("vyre-box", className)}
        data-w={attr(width)}
        data-h={attr(height)}
        data-p={attr(padding)}
        data-px={attr(paddingX)}
        data-py={attr(paddingY)}
        data-pt={attr(paddingTop)}
        data-pr={attr(paddingRight)}
        data-pb={attr(paddingBottom)}
        data-pl={attr(paddingLeft)}
        data-m={attr(margin)}
        data-mx={attr(marginX)}
        data-my={attr(marginY)}
        data-mt={attr(marginTop)}
        data-mr={attr(marginRight)}
        data-mb={attr(marginBottom)}
        data-ml={attr(marginLeft)}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);
Box.displayName = "VyreBox";
