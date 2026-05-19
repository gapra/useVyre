/**
 * @usevyre/react — Timeline + TimelineItem
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  Timeline (+ TimelineItem)                             │
 * │ Import:     import { Timeline, TimelineItem } from "@usevyre/react"│
 * │                                                                   │
 * │ Vertical activity feed for audit logs / history. Presentational.  │
 * │ A marker dot per item + a connector line between them.            │
 * │                                                                   │
 * │   <Timeline items={[{ title, time?, description?, status?,        │
 * │                       icon? }]} />                                 │
 * │   — OR —                                                          │
 * │   <Timeline>                                                      │
 * │     <TimelineItem title="…" time="…" status="success">            │
 * │       rich content (links, badges, …)                             │
 * │     </TimelineItem>                                               │
 * │   </Timeline>                                                     │
 * │                                                                   │
 * │   status = "default"|"success"|"warning"|"danger"|"info"          │
 * │            (colors the dot)                                        │
 * │   icon   = ReactNode (overrides the dot)                           │
 * │                                                                   │
 * │ Use `items` for plain logs; use TimelineItem children for rich    │
 * │ per-item content. Newest-first or oldest-first is up to you —     │
 * │ Timeline does not reorder.                                         │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <Timeline
 *   items={[
 *     { title: "Deployed v2.1", time: "2m ago", status: "success" },
 *     { title: "Build started", time: "5m ago", status: "info" },
 *     { title: "Push to main", time: "6m ago" },
 *   ]}
 * />
 *
 * @example
 * <Timeline>
 *   <TimelineItem title="Invoice paid" time="Apr 2" status="success">
 *     <Text size="sm">$1,200 — <a href="#">view receipt</a></Text>
 *   </TimelineItem>
 * </Timeline>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export type TimelineStatus =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface TimelineItemData {
  title: React.ReactNode;
  time?: React.ReactNode;
  description?: React.ReactNode;
  status?: TimelineStatus;
  icon?: React.ReactNode;
}

export interface TimelineProps
  extends React.HTMLAttributes<HTMLOListElement>,
    BaseProps {
  /** Plain items — alternative to TimelineItem children */
  items?: TimelineItemData[];
  children?: React.ReactNode;
}

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ items, className, children, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn("vyre-timeline", className)}
        {...props}
      >
        {items
          ? items.map((it, i) => (
              <TimelineItem
                key={i}
                title={it.title}
                time={it.time}
                status={it.status}
                icon={it.icon}
              >
                {it.description}
              </TimelineItem>
            ))
          : children}
      </ol>
    );
  }
);
Timeline.displayName = "VyreTimeline";

export interface TimelineItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title">,
    BaseProps {
  title: React.ReactNode;
  time?: React.ReactNode;
  status?: TimelineStatus;
  /** Overrides the status dot */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const TimelineItem = React.forwardRef<
  HTMLLIElement,
  TimelineItemProps
>(
  (
    {
      title,
      time,
      status = "default",
      icon,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <li
        ref={ref}
        className={cn("vyre-timeline-item", className)}
        data-status={status}
        {...props}
      >
        <span className="vyre-timeline-item__marker" aria-hidden="true">
          {icon ? (
            <span className="vyre-timeline-item__icon">{icon}</span>
          ) : (
            <span className="vyre-timeline-item__dot" />
          )}
          <span className="vyre-timeline-item__connector" />
        </span>
        <div className="vyre-timeline-item__body">
          <div className="vyre-timeline-item__head">
            <span className="vyre-timeline-item__title">{title}</span>
            {time !== undefined && (
              <span className="vyre-timeline-item__time">{time}</span>
            )}
          </div>
          {children && (
            <div className="vyre-timeline-item__content">{children}</div>
          )}
        </div>
      </li>
    );
  }
);
TimelineItem.displayName = "VyreTimelineItem";
