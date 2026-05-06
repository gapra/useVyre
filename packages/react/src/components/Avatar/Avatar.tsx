/**
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────┐
 * │ Component:  Avatar                          │
 * │ src        = string (image URL)             │
 * │ alt        = string                         │
 * │ fallback   = string (initials, e.g. "GP")   │
 * │ size       = "sm"|"md"(default)|"lg"|"xl"   │
 * │ status     = "online"|"offline"|"busy"|"away"│
 * │ CSS class:  .vyre-avatar                    │
 * └─────────────────────────────────────────────┘
 */

import React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt = "", fallback, size = "md", status, className, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    const showImage = src && !imgError;

    return (
      <span
        ref={ref}
        data-size={size}
        className={["vyre-avatar", className].filter(Boolean).join(" ")}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="vyre-avatar__img"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="vyre-avatar__fallback" aria-label={alt || fallback}>
            {fallback ?? alt?.charAt(0)?.toUpperCase() ?? "?"}
          </span>
        )}
        {status && (
          <span
            className={`vyre-avatar__status vyre-avatar__status--${status}`}
            aria-label={status}
          />
        )}
      </span>
    );
  }
);
Avatar.displayName = "Avatar";
