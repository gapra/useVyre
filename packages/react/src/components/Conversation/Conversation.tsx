/**
 * @usevyre/react — Conversation
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  Conversation (chat / inbox message thread)          │
 * │ Import:     import { Conversation } from "@usevyre/react"        │
 * │                                                                  │
 * │ CONTROLLED & data-driven (like Kanban/DataGrid). No internal     │
 * │ message state — you own `value`, append in your own handler.     │
 * │                                                                  │
 * │ Props:                                                           │
 * │   value         = ConversationMessage[]  (required)              │
 * │   currentUserId = string  (required — whose messages align right)│
 * │   composer?     = boolean (built-in input + Send; default false) │
 * │   onSend?       = (text: string, files: File[]) => void          │
 * │   placeholder?  = string  (composer placeholder)                 │
 * │   typing?       = boolean | string (show typing indicator)       │
 * │   allowAttachments? = boolean (📎 button + staged-file chips)     │
 * │   accept?       = string (file input accept, e.g. "image/*")     │
 * │   renderMessage?= (msg, meta) => ReactNode  (custom bubble body) │
 * │   renderComposer? = (api) => ReactNode  (replace composer)       │
 * │     api = { value, setValue, files, setFiles, send }             │
 * │                                                                  │
 * │ ConversationMessage = {                                          │
 * │   id; authorId; text?;                                           │
 * │   authorName?; authorAvatar?;                                    │
 * │   timestamp?: Date | string | number;                            │
 * │   status?: "sending"|"sent"|"delivered"|"read";                  │
 * │   attachments?: ConversationAttachment[]                         │
 * │ }                                                                 │
 * │ ConversationAttachment = {                                        │
 * │   kind: "image"|"audio"|"video"|"file";                          │
 * │   url; name?; size?                                              │
 * │ }  → rendered inside the bubble (image preview, audio/video      │
 * │     player, or a download chip for files)                        │
 * │                                                                  │
 * │ Consecutive messages from the same author are grouped (avatar +  │
 * │ name shown once). Day separators inserted on date change.        │
 * │ Outgoing = authorId === currentUserId (aligned right).           │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [messages, setMessages] = useState<ConversationMessage[]>([
 *   { id: "1", authorId: "sam", authorName: "Sam", text: "Hey!" },
 *   { id: "2", authorId: "me", text: "Hi 👋", status: "read" },
 * ]);
 * <Conversation
 *   value={messages}
 *   currentUserId="me"
 *   composer
 *   onSend={(t) => setMessages((m) => [...m, { id: crypto.randomUUID(), authorId: "me", text: t }])}
 * />
 */

import React, { useMemo, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";
import type { BaseProps } from "../../types";

export type ConversationStatus = "sending" | "sent" | "delivered" | "read";

export type ConversationAttachmentKind = "image" | "audio" | "video" | "file";

export interface ConversationAttachment {
  kind: ConversationAttachmentKind;
  /** Source/href for the media or download. */
  url: string;
  /** Display name (file attachments) / alt text (image). */
  name?: string;
  /** Optional human-readable size, e.g. "2.4 MB". */
  size?: string;
}

export interface ConversationMessage {
  id: string;
  /** Identifies the sender. Matched against currentUserId for alignment. */
  authorId: string;
  text?: string;
  authorName?: string;
  authorAvatar?: string;
  timestamp?: Date | string | number;
  status?: ConversationStatus;
  /** Image / audio / video / file attachments rendered inside the bubble. */
  attachments?: ConversationAttachment[];
}

/** Per-message layout info passed to renderMessage. */
export interface ConversationMessageMeta {
  outgoing: boolean;
  /** First message of a same-author run (avatar/name shown). */
  isGroupStart: boolean;
  /** Last message of a same-author run (timestamp/status shown). */
  isGroupEnd: boolean;
}

export interface ConversationComposerApi {
  value: string;
  setValue: (v: string) => void;
  /** Files staged via the attach button (when allowAttachments). */
  files: File[];
  setFiles: (f: File[]) => void;
  send: () => void;
}

export interface ConversationProps extends BaseProps {
  value: ConversationMessage[];
  currentUserId: string;
  composer?: boolean;
  /**
   * Called when the composer submits. `files` holds anything staged via the
   * attach button (empty array when allowAttachments is off). You own the
   * upload + how staged files become message attachments.
   */
  onSend?: (text: string, files: File[]) => void;
  placeholder?: string;
  typing?: boolean | string;
  /** Show an attach (📎) button + staged-file chips in the built-in composer. */
  allowAttachments?: boolean;
  /** `accept` attribute forwarded to the file input (e.g. "image/*"). */
  accept?: string;
  renderMessage?: (
    message: ConversationMessage,
    meta: ConversationMessageMeta
  ) => React.ReactNode;
  renderComposer?: (api: ConversationComposerApi) => React.ReactNode;
}

function toDate(t: ConversationMessage["timestamp"]): Date | null {
  if (t == null) return null;
  const d = t instanceof Date ? t : new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDay(d: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return new Intl.DateTimeFormat("default", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() === today.getFullYear() ? undefined : "numeric",
  }).format(d);
}

function formatTime(d: Date): string {
  return new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

const STATUS_LABEL: Record<ConversationStatus, string> = {
  sending: "Sending…",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
};

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M10 2H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 16h8a1.5 1.5 0 0 0 1.5-1.5V6.5L10 2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M10 2v4.5h4.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function Attachment({ attachment }: { attachment: ConversationAttachment }) {
  const { kind, url, name, size } = attachment;

  if (kind === "image") {
    return (
      <a
        className="vyre-conversation__att vyre-conversation__att--image"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={url} alt={name ?? "image attachment"} loading="lazy" />
      </a>
    );
  }

  if (kind === "audio") {
    return (
      <audio
        className="vyre-conversation__att vyre-conversation__att--audio"
        src={url}
        controls
        preload="none"
      />
    );
  }

  if (kind === "video") {
    return (
      <video
        className="vyre-conversation__att vyre-conversation__att--video"
        src={url}
        controls
        preload="none"
      />
    );
  }

  return (
    <a
      className="vyre-conversation__att vyre-conversation__att--file"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={name}
    >
      <span className="vyre-conversation__att-icon">
        <FileIcon />
      </span>
      <span className="vyre-conversation__att-info">
        <span className="vyre-conversation__att-name">{name ?? "Attachment"}</span>
        {size && <span className="vyre-conversation__att-size">{size}</span>}
      </span>
    </a>
  );
}

export const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  (
    {
      value,
      currentUserId,
      composer = false,
      onSend,
      placeholder = "Write a message…",
      typing = false,
      allowAttachments = false,
      accept,
      renderMessage,
      renderComposer,
      className,
      ...props
    },
    ref
  ) => {
    const [draft, setDraft] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const send = () => {
      const text = draft.trim();
      if (!text && files.length === 0) return;
      onSend?.(text, files);
      setDraft("");
      setFiles([]);
    };

    // Precompute grouping + day separators in one pass.
    const rows = useMemo(() => {
      return value.map((msg, i) => {
        const prev = value[i - 1];
        const next = value[i + 1];
        const date = toDate(msg.timestamp);
        const prevDate = prev ? toDate(prev.timestamp) : null;

        const showDaySeparator =
          !!date && (!prevDate || !sameDay(date, prevDate));

        const isGroupStart =
          !prev || prev.authorId !== msg.authorId || showDaySeparator;
        const isGroupEnd = !next || next.authorId !== msg.authorId;

        const outgoing = msg.authorId === currentUserId;
        return { msg, date, showDaySeparator, isGroupStart, isGroupEnd, outgoing };
      });
    }, [value, currentUserId]);

    const composerApi: ConversationComposerApi = {
      value: draft,
      setValue: setDraft,
      files,
      setFiles,
      send,
    };

    return (
      <div
        ref={ref}
        className={cn("vyre-conversation", className)}
        {...props}
      >
        <div
          className="vyre-conversation__thread"
          role="log"
          aria-label="Conversation"
          aria-live="polite"
        >
          {rows.map(
            ({ msg, date, showDaySeparator, isGroupStart, isGroupEnd, outgoing }) => (
              <React.Fragment key={msg.id}>
                {showDaySeparator && date && (
                  <div className="vyre-conversation__day" role="separator">
                    <span>{formatDay(date)}</span>
                  </div>
                )}

                <div
                  className={cn(
                    "vyre-conversation__row",
                    outgoing
                      ? "vyre-conversation__row--out"
                      : "vyre-conversation__row--in",
                    isGroupEnd && "vyre-conversation__row--group-end"
                  )}
                >
                  <div className="vyre-conversation__avatar">
                    {!outgoing && isGroupEnd && (
                      <Avatar
                        size="sm"
                        src={msg.authorAvatar}
                        fallback={(msg.authorName ?? msg.authorId)
                          .slice(0, 1)
                          .toUpperCase()}
                        alt={msg.authorName ?? msg.authorId}
                      />
                    )}
                  </div>

                  <div className="vyre-conversation__stack">
                    {!outgoing && isGroupStart && msg.authorName && (
                      <span className="vyre-conversation__author">
                        {msg.authorName}
                      </span>
                    )}

                    <div className="vyre-conversation__bubble">
                      {renderMessage ? (
                        renderMessage(msg, {
                          outgoing,
                          isGroupStart,
                          isGroupEnd,
                        })
                      ) : (
                        <>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="vyre-conversation__attachments">
                              {msg.attachments.map((att, ai) => (
                                <Attachment key={ai} attachment={att} />
                              ))}
                            </div>
                          )}
                          {msg.text}
                        </>
                      )}
                    </div>

                    {isGroupEnd && (
                      <span className="vyre-conversation__meta">
                        {date && formatTime(date)}
                        {outgoing && msg.status && (
                          <span
                            className={cn(
                              "vyre-conversation__status",
                              `vyre-conversation__status--${msg.status}`
                            )}
                          >
                            {date ? " · " : ""}
                            {STATUS_LABEL[msg.status]}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )
          )}

          {typing && (
            <div className="vyre-conversation__row vyre-conversation__row--in">
              <div className="vyre-conversation__avatar" />
              <div className="vyre-conversation__stack">
                <div className="vyre-conversation__bubble vyre-conversation__bubble--typing">
                  <span className="vyre-conversation__dot" />
                  <span className="vyre-conversation__dot" />
                  <span className="vyre-conversation__dot" />
                  {typeof typing === "string" && (
                    <span className="vyre-conversation__typing-label">
                      {typing}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {renderComposer
          ? renderComposer(composerApi)
          : composer && (
              <form
                className="vyre-conversation__composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                {allowAttachments && files.length > 0 && (
                  <div className="vyre-conversation__staged">
                    {files.map((f, i) => (
                      <span key={i} className="vyre-conversation__chip">
                        <span className="vyre-conversation__chip-name">
                          {f.name}
                        </span>
                        <button
                          type="button"
                          className="vyre-conversation__chip-remove"
                          aria-label={`Remove ${f.name}`}
                          onClick={() =>
                            setFiles(files.filter((_, j) => j !== i))
                          }
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="vyre-conversation__composer-row">
                  {allowAttachments && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept={accept}
                        className="vyre-conversation__file-input"
                        onChange={(e) => {
                          const picked = Array.from(e.target.files ?? []);
                          if (picked.length) setFiles([...files, ...picked]);
                          e.target.value = "";
                        }}
                      />
                      <button
                        type="button"
                        className="vyre-conversation__attach"
                        aria-label="Attach files"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                          <path
                            d="M13.5 6.5l-5.6 5.6a2.5 2.5 0 0 1-3.5-3.5l6-6a3.5 3.5 0 0 1 5 5l-6 6"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                  <input
                    className="vyre-conversation__input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Message"
                  />
                  <button
                    type="submit"
                    className="vyre-conversation__send"
                    disabled={!draft.trim() && files.length === 0}
                    aria-label="Send message"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 8l12-5-4.5 12L7 9.5 2 8z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            )}
      </div>
    );
  }
);

Conversation.displayName = "VyreConversation";
