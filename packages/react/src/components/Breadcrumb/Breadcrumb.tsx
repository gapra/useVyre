/**
 * @usevyre/react — Breadcrumb
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Components: Breadcrumb + BreadcrumbItem + BreadcrumbSeparator│
 * │ Import:     import { Breadcrumb, BreadcrumbItem,        │
 * │             BreadcrumbSeparator } from "@usevyre/react"    │
 * │                                                         │
 * │ Breadcrumb props:                                       │
 * │   separator = ReactNode (default: "/")                  │
 * │                                                         │
 * │ BreadcrumbItem props:                                   │
 * │   href     = string (omit for current/last item)        │
 * │   current  = boolean (marks aria-current="page")        │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * <Breadcrumb>
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
 *   <BreadcrumbItem current>Components</BreadcrumbItem>
 * </Breadcrumb>
 */

import React from "react";
import { cn } from "../../utils/cn";

export interface BreadcrumbProps {
  children: React.ReactNode;
  separator?: React.ReactNode;
  className?: string;
}

export interface BreadcrumbItemProps {
  children: React.ReactNode;
  href?: string;
  current?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  children,
  separator = "/",
  className,
}) => {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className={cn("vyre-breadcrumb", className)}>
      <ol className="vyre-breadcrumb__list">
        {items.map((item, i) => (
          <li key={i} className="vyre-breadcrumb__item">
            {item}
            {i < items.length - 1 && (
              <span className="vyre-breadcrumb__separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
Breadcrumb.displayName = "VyreBreadcrumb";

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  children,
  href,
  current = false,
  className,
}) => {
  if (current || !href) {
    return (
      <span
        className={cn("vyre-breadcrumb__link vyre-breadcrumb__link--current", className)}
        aria-current={current ? "page" : undefined}
      >
        {children}
      </span>
    );
  }
  return (
    <a href={href} className={cn("vyre-breadcrumb__link", className)}>
      {children}
    </a>
  );
};
BreadcrumbItem.displayName = "VyreBreadcrumbItem";

export interface BreadcrumbLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({ children, href, className }) => (
  <a href={href} className={cn("vyre-breadcrumb__link", className)}>
    {children}
  </a>
);
BreadcrumbLink.displayName = "VyreBreadcrumbLink";

export const BreadcrumbSeparator: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children = "/",
  className,
}) => (
  <span className={cn("vyre-breadcrumb__separator", className)} aria-hidden="true">
    {children}
  </span>
);
BreadcrumbSeparator.displayName = "VyreBreadcrumbSeparator";
