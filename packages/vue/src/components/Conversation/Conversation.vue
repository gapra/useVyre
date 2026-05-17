<script setup lang="ts">
/**
 * @usevyre/vue — Conversation
 *
 * AI CONTEXT:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Component:  Conversation (chat / inbox message thread)          │
 * │ Import:     import { Conversation } from "@usevyre/vue"          │
 * │                                                                  │
 * │ CONTROLLED & data-driven (like Kanban/DataGrid). No internal     │
 * │ message state — you own `value`, append in your @send handler.   │
 * │                                                                  │
 * │ Props:                                                           │
 * │   value         = ConversationMessage[]  (required)              │
 * │   currentUserId = string  (required — whose messages align right)│
 * │   composer?     = boolean (built-in input + Send; default false) │
 * │   placeholder?  = string                                         │
 * │   typing?       = boolean | string                               │
 * │   allowAttachments? = boolean (📎 button + staged-file chips)     │
 * │   accept?       = string (file input accept, e.g. "image/*")     │
 * │                                                                  │
 * │ Emits:                                                           │
 * │   send — (text: string, files: File[]) when composer submits     │
 * │                                                                  │
 * │ Slots:                                                           │
 * │   #message="{ message, meta }" — custom bubble body              │
 * │   #composer="{ value, setValue, files, setFiles, send }"         │
 * │                                                                  │
 * │ ConversationMessage = {                                          │
 * │   id; authorId; text?; authorName?; authorAvatar?;               │
 * │   timestamp?: Date|string|number;                                │
 * │   status?: "sending"|"sent"|"delivered"|"read";                  │
 * │   attachments?: ConversationAttachment[] }                       │
 * │ ConversationAttachment = { kind: "image"|"audio"|               │
 * │   "video"|"file"; url; name?; size? } → rendered in bubble       │
 * │                                                                  │
 * │ Consecutive messages from the same author are grouped. Day       │
 * │ separators inserted on date change. Outgoing = authorId ===      │
 * │ currentUserId (aligned right).                                   │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * @example
 * <Conversation
 *   :value="messages"
 *   current-user-id="me"
 *   composer
 *   @send="(t) => messages.push({ id: uid(), authorId: 'me', text: t })"
 * />
 */

import { computed, ref } from "vue";
import { cn } from "../../utils/cn";
import Avatar from "../Avatar/Avatar.vue";

export type ConversationStatus = "sending" | "sent" | "delivered" | "read";

export type ConversationAttachmentKind = "image" | "audio" | "video" | "file";

export interface ConversationAttachment {
  kind: ConversationAttachmentKind;
  url: string;
  name?: string;
  size?: string;
}

export interface ConversationMessage {
  id: string;
  authorId: string;
  text?: string;
  authorName?: string;
  authorAvatar?: string;
  timestamp?: Date | string | number;
  status?: ConversationStatus;
  attachments?: ConversationAttachment[];
}

export interface ConversationMessageMeta {
  outgoing: boolean;
  isGroupStart: boolean;
  isGroupEnd: boolean;
}

const props = withDefaults(
  defineProps<{
    value: ConversationMessage[];
    currentUserId: string;
    composer?: boolean;
    placeholder?: string;
    typing?: boolean | string;
    allowAttachments?: boolean;
    accept?: string;
    class?: string;
  }>(),
  {
    composer: false,
    placeholder: "Write a message…",
    typing: false,
    allowAttachments: false,
  }
);

const emit = defineEmits<{
  send: [text: string, files: File[]];
}>();

const draft = ref("");
const files = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);

function send() {
  const text = draft.value.trim();
  if (!text && files.value.length === 0) return;
  emit("send", text, files.value);
  draft.value = "";
  files.value = [];
}
function setValue(v: string) {
  draft.value = v;
}
function setFiles(f: File[]) {
  files.value = f;
}
function onPickFiles(e: Event) {
  const input = e.target as HTMLInputElement;
  const picked = Array.from(input.files ?? []);
  if (picked.length) files.value = [...files.value, ...picked];
  input.value = "";
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

const rows = computed(() =>
  props.value.map((msg, i) => {
    const prev = props.value[i - 1];
    const next = props.value[i + 1];
    const date = toDate(msg.timestamp);
    const prevDate = prev ? toDate(prev.timestamp) : null;
    const showDaySeparator =
      !!date && (!prevDate || !sameDay(date, prevDate));
    const isGroupStart =
      !prev || prev.authorId !== msg.authorId || showDaySeparator;
    const isGroupEnd = !next || next.authorId !== msg.authorId;
    const outgoing = msg.authorId === props.currentUserId;
    return { msg, date, showDaySeparator, isGroupStart, isGroupEnd, outgoing };
  })
);

const composerApi = computed(() => ({
  value: draft.value,
  setValue,
  files: files.value,
  setFiles,
  send,
}));
</script>

<template>
  <div :class="cn('vyre-conversation', props.class)">
    <div
      class="vyre-conversation__thread"
      role="log"
      aria-label="Conversation"
      aria-live="polite"
    >
      <template
        v-for="r in rows"
        :key="r.msg.id"
      >
        <div
          v-if="r.showDaySeparator && r.date"
          class="vyre-conversation__day"
          role="separator"
        >
          <span>{{ formatDay(r.date) }}</span>
        </div>

        <div
          :class="cn(
            'vyre-conversation__row',
            r.outgoing ? 'vyre-conversation__row--out' : 'vyre-conversation__row--in',
            r.isGroupEnd && 'vyre-conversation__row--group-end',
          )"
        >
          <div class="vyre-conversation__avatar">
            <Avatar
              v-if="!r.outgoing && r.isGroupEnd"
              size="sm"
              :src="r.msg.authorAvatar"
              :fallback="(r.msg.authorName ?? r.msg.authorId).slice(0, 1).toUpperCase()"
              :alt="r.msg.authorName ?? r.msg.authorId"
            />
          </div>

          <div class="vyre-conversation__stack">
            <span
              v-if="!r.outgoing && r.isGroupStart && r.msg.authorName"
              class="vyre-conversation__author"
            >
              {{ r.msg.authorName }}
            </span>

            <div class="vyre-conversation__bubble">
              <slot
                name="message"
                :message="r.msg"
                :meta="{ outgoing: r.outgoing, isGroupStart: r.isGroupStart, isGroupEnd: r.isGroupEnd }"
              >
                <div
                  v-if="r.msg.attachments && r.msg.attachments.length"
                  class="vyre-conversation__attachments"
                >
                  <template
                    v-for="(att, ai) in r.msg.attachments"
                    :key="ai"
                  >
                    <a
                      v-if="att.kind === 'image'"
                      class="vyre-conversation__att vyre-conversation__att--image"
                      :href="att.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img :src="att.url" :alt="att.name ?? 'image attachment'" loading="lazy" />
                    </a>
                    <audio
                      v-else-if="att.kind === 'audio'"
                      class="vyre-conversation__att vyre-conversation__att--audio"
                      :src="att.url"
                      controls
                      preload="none"
                    />
                    <video
                      v-else-if="att.kind === 'video'"
                      class="vyre-conversation__att vyre-conversation__att--video"
                      :src="att.url"
                      controls
                      preload="none"
                    />
                    <a
                      v-else
                      class="vyre-conversation__att vyre-conversation__att--file"
                      :href="att.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      :download="att.name"
                    >
                      <span class="vyre-conversation__att-icon">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                          <path
                            d="M10 2H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 16h8a1.5 1.5 0 0 0 1.5-1.5V6.5L10 2z"
                            stroke="currentColor"
                            stroke-width="1.3"
                            stroke-linejoin="round"
                          />
                          <path d="M10 2v4.5h4.5" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
                        </svg>
                      </span>
                      <span class="vyre-conversation__att-info">
                        <span class="vyre-conversation__att-name">{{ att.name ?? "Attachment" }}</span>
                        <span v-if="att.size" class="vyre-conversation__att-size">{{ att.size }}</span>
                      </span>
                    </a>
                  </template>
                </div>
                {{ r.msg.text }}
              </slot>
            </div>

            <span v-if="r.isGroupEnd" class="vyre-conversation__meta">
              {{ r.date ? formatTime(r.date) : "" }}
              <span
                v-if="r.outgoing && r.msg.status"
                :class="cn(
                  'vyre-conversation__status',
                  `vyre-conversation__status--${r.msg.status}`,
                )"
              >
                {{ r.date ? " · " : "" }}{{ STATUS_LABEL[r.msg.status] }}
              </span>
            </span>
          </div>
        </div>
      </template>

      <div
        v-if="typing"
        class="vyre-conversation__row vyre-conversation__row--in"
      >
        <div class="vyre-conversation__avatar" />
        <div class="vyre-conversation__stack">
          <div class="vyre-conversation__bubble vyre-conversation__bubble--typing">
            <span class="vyre-conversation__dot" />
            <span class="vyre-conversation__dot" />
            <span class="vyre-conversation__dot" />
            <span
              v-if="typeof typing === 'string'"
              class="vyre-conversation__typing-label"
            >
              {{ typing }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <slot name="composer" v-bind="composerApi">
      <form
        v-if="composer"
        class="vyre-conversation__composer"
        @submit.prevent="send"
      >
        <div
          v-if="allowAttachments && files.length"
          class="vyre-conversation__staged"
        >
          <span
            v-for="(f, i) in files"
            :key="i"
            class="vyre-conversation__chip"
          >
            <span class="vyre-conversation__chip-name">{{ f.name }}</span>
            <button
              type="button"
              class="vyre-conversation__chip-remove"
              :aria-label="`Remove ${f.name}`"
              @click="files = files.filter((_, j) => j !== i)"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
              </svg>
            </button>
          </span>
        </div>

        <div class="vyre-conversation__composer-row">
          <template v-if="allowAttachments">
            <input
              ref="fileInputRef"
              type="file"
              multiple
              :accept="accept"
              class="vyre-conversation__file-input"
              @change="onPickFiles"
            />
            <button
              type="button"
              class="vyre-conversation__attach"
              aria-label="Attach files"
              @click="fileInputRef?.click()"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M13.5 6.5l-5.6 5.6a2.5 2.5 0 0 1-3.5-3.5l6-6a3.5 3.5 0 0 1 5 5l-6 6"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </template>
          <input
            v-model="draft"
            class="vyre-conversation__input"
            :placeholder="placeholder"
            aria-label="Message"
          />
          <button
            type="submit"
            class="vyre-conversation__send"
            :disabled="!draft.trim() && files.length === 0"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 8l12-5-4.5 12L7 9.5 2 8z"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
    </slot>
  </div>
</template>
