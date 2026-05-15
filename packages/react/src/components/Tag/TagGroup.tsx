/**
 * @usevyre/react — TagGroup
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  TagGroup                                    │
 * │ Import:     import { TagGroup, Tag } from "@usevyre/react"│
 * │                                                         │
 * │ Props:                                                  │
 * │   gap   = "sm"|"md"(default)|"lg"                       │
 * │   wrap  = boolean (default: true)                       │
 * │                                                         │
 * │ Read-only container that lays out multiple <Tag>        │
 * │ elements with wrapping + spacing. For tag INPUT use     │
 * │ TagsInput instead.                                      │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <TagGroup>
 *   <Tag>React</Tag>
 *   <Tag>Vue</Tag>
 *   <Tag variant="accent">TypeScript</Tag>
 * </TagGroup>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export type TagGroupGap = "sm" | "md" | "lg";

export interface TagGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BaseProps {
  /** Spacing between tags */
  gap?: TagGroupGap;
  /** Wrap tags onto multiple lines when they overflow */
  wrap?: boolean;
}

export const TagGroup = React.forwardRef<HTMLDivElement, TagGroupProps>(
  ({ gap = "md", wrap = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "vyre-tag-group",
          `vyre-tag-group--gap-${gap}`,
          !wrap && "vyre-tag-group--nowrap",
          className
        )}
        role="list"
        {...props}
      >
        {children}
      </div>
    );
  }
);

TagGroup.displayName = "VyreTagGroup";
