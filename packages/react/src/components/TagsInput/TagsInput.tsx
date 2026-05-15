/**
 * @usevyre/react — TagsInput
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Component:  TagsInput                                   │
 * │ Import:     import { TagsInput } from "@usevyre/react"  │
 * │                                                         │
 * │ Props:                                                  │
 * │   value       = string[] (controlled)                   │
 * │   onChange    = (tags: string[]) => void                │
 * │   placeholder = string                                  │
 * │   disabled    = boolean                                 │
 * │   max         = number — max tag count                  │
 * │   size        = "sm"|"md"(default)|"lg"                 │
 * │                                                         │
 * │ Behavior:                                               │
 * │   Enter / comma → add tag (trim, dedupe, skip empty)    │
 * │   Backspace on empty input → remove last tag            │
 * │   × button on tag → remove that tag                     │
 * │   When max reached, input is disabled                   │
 * └─────────────────────────────────────────────────────────┘
 *
 * @example
 * const [tags, setTags] = useState(["react", "typescript"]);
 * <TagsInput value={tags} onChange={setTags} placeholder="Add tag…" max={5} />
 *
 * // Inside a Field
 * <Field label="Skills">
 *   <TagsInput value={skills} onChange={setSkills} />
 * </Field>
 */

import React, { useState, useRef } from "react";
import { cn } from "../../utils/cn";
import { Tag } from "../Tag/Tag";
import type { BaseProps } from "../../types";

type TagsInputSize = "sm" | "md" | "lg";

export interface TagsInputProps extends BaseProps {
  /** Controlled tag list */
  value: string[];
  /** Called with new tag array on every change */
  onChange: (tags: string[]) => void;
  /** Input placeholder (hidden when max reached) */
  placeholder?: string;
  /** Disable all interactions */
  disabled?: boolean;
  /** Maximum number of tags allowed */
  max?: number;
  /** Size scale */
  size?: TagsInputSize;
}

export const TagsInput = React.forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      value,
      onChange,
      placeholder = "Add tag…",
      disabled = false,
      max,
      size = "md",
      className,
      style,
      "data-testid": testId,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const isMaxReached = max !== undefined && value.length >= max;
    const isInputDisabled = disabled || isMaxReached;

    function addTag(raw: string) {
      const tag = raw.trim();
      if (!tag || value.includes(tag) || isMaxReached) {
        setInputValue("");
        return;
      }
      onChange([...value, tag]);
      setInputValue("");
    }

    function removeTag(index: number) {
      if (disabled) return;
      onChange(value.filter((_, i) => i !== index));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(inputValue);
        return;
      }
      if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
        removeTag(value.length - 1);
      }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const val = e.target.value;
      // Auto-split on comma paste
      if (val.includes(",")) {
        const parts = val.split(",");
        const toAdd = parts.slice(0, -1);
        toAdd.forEach((p) => addTag(p));
        setInputValue(parts[parts.length - 1]);
      } else {
        setInputValue(val);
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "vyre-tags-input",
          `vyre-tags-input--${size}`,
          disabled && "vyre-tags-input--disabled",
          className
        )}
        data-testid={testId}
        style={style}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <Tag
            key={`${tag}-${index}`}
            size={size}
            disabled={disabled}
            onRemove={disabled ? undefined : () => removeTag(index)}
          >
            {tag}
          </Tag>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="vyre-tags-input__field"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? "" : placeholder}
          disabled={isInputDisabled}
          aria-label="Add tag"
        />
      </div>
    );
  }
);

TagsInput.displayName = "VyreTagsInput";
