import { useCallback, useRef, useState } from "react";
import { RefreshCw, AlertTriangle, Scissors, CheckCircle2 } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

import { ThemeSwitcher } from "./ThemeSwitcher";
import { ServiceCards } from "./ServiceCards";
import { DEFAULT_THEME, type ChatThemeId } from "./themes";
import avatarUrl from "@/assets/assistant-avatar.png";
import { extractAnswer } from "@/lib/chat-response";
import { extractGuestDetails } from "@/lib/guest-details";
import {
  ASSISTANT_NAME,
  CHAT_WEBHOOK_URL,
  SALON_NAME,
  SALON_TAGLINE,
  SUGGESTED_PROMPTS,
  WELCOME_MESSAGE,
  type SalonService,
} from "@/config/chat";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  error?: boolean;
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function describeError(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "the request timed out. Please try again in a moment.";
  }
  if (error instanceof TypeError) {
    return (
      "the request was blocked by the browser (network or CORS). Please check that the " +
      `booking service at ${CHAT_WEBHOOK_URL} is running and allows requests from this page.`
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "an unexpected error occurred.";
}

function AssistantAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-9 shrink-0 place-items-center rounded-full bg-gradient-brand p-[2px] shadow-[var(--shadow-glow)]",
        className,
      )}
    >
      <img
        src={avatarUrl}
        alt=""
        aria-hidden="true"
        width={512}
        height={512}
        className="size-full rounded-full bg-background/40 object-cover"
      />
    </span>
  );
}

export function ChatApp() {
  const [theme, setTheme] = useState<ChatThemeId>(DEFAULT_THEME);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const lastUserMessage = useRef<string | null>(null);

  const send = useCallback(
    async (text: string, isRetry = false) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      lastUserMessage.current = trimmed;
      setIsSending(true);

      // Pick up a name / phone number the guest typed naturally in chat.
      const detected = extractGuestDetails(trimmed);
      const guestName = name || detected.name || "";
      const guestPhone = phone || detected.phone || "";
      if (!name && detected.name) setName(detected.name);
      if (!phone && detected.phone) setPhone(detected.phone);

      setMessages((prev) => {
        const base = isRetry ? prev.filter((m) => !m.error) : prev;
        return isRetry
          ? base
          : [...base, { id: newId(), role: "user" as Role, text: trimmed }];
      });

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45_000);

        let response: Response;
        try {
          response = await fetch(CHAT_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: trimmed,
              name: guestName,
              phone: guestPhone,
            }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
        }

        if (!response.ok) {
          throw new Error(
            `the booking service answered with status ${response.status} (${response.statusText || "error"}).`,
          );
        }

        const raw = await response.text();
        setMessages((prev) => [
          ...prev,
          { id: newId(), role: "assistant", text: extractAnswer(raw) },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            error: true,
            text: `I'm terribly sorry — I couldn't reach the booking service: ${describeError(error)}`,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [name, phone],
  );

  const handleSubmit = useCallback(
    (_message: unknown, event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSending) return;
      const text = input;
      setInput("");
      void send(text);
    },
    [input, isSending, send],
  );

  const retry = useCallback(() => {
    if (isSending || !lastUserMessage.current) return;
    void send(lastUserMessage.current, true);
  }, [isSending, send]);

  const bookService = useCallback(
    (service: SalonService) => {
      void send(
        `I'd like to book ${service.name} (${service.duration}, ${service.price}). What times are available?`,
      );
    },
    [send],
  );

  const isFresh = messages.length === 1 && !isSending;

  return (
    <div
      data-theme={theme}
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-background font-sans text-foreground antialiased"
    >
      {/* Ambient depth */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-orb absolute -left-24 -top-32 size-[26rem] rounded-full bg-brand opacity-30 blur-[110px]" />
        <div
          className="animate-float-orb absolute -right-32 top-1/3 size-[30rem] rounded-full bg-brand-2 opacity-25 blur-[130px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-float-orb absolute bottom--20 left-1/3 size-[22rem] rounded-full bg-brand opacity-20 blur-[120px]"
          style={{ animationDelay: "-11s" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col px-3 pb-3 pt-3 sm:px-6 sm:pb-6 sm:pt-5">
        {/* Header */}
        <header className="glass-panel mb-3 flex items-center justify-between gap-3 rounded-3xl px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-[var(--shadow-glow)] sm:size-11">
              <Scissors className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold tracking-tight sm:text-lg">
                {SALON_NAME}
                <span className="text-gradient-brand"> · Bookings</span>
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {isSending ? `${ASSISTANT_NAME} is checking the diary…` : SALON_TAGLINE}
              </p>
            </div>
          </div>
          <ThemeSwitcher value={theme} onChange={setTheme} />
        </header>

        {/* Services & prices */}
        <ServiceCards onSelect={bookService} disabled={isSending} />

        {/* Guest details */}
        <div className="glass-panel mb-3 flex flex-col gap-2 rounded-2xl px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {name && phone ? (
              <CheckCircle2 className="size-3.5 text-brand" aria-hidden="true" />
            ) : null}
            Your details
          </span>
          <div className="flex flex-1 gap-2">
            <label className="flex-1">
              <span className="sr-only">Your name</span>
              <input
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
                placeholder="Name"
                autoComplete="name"
                className="w-full rounded-xl border border-glass-border bg-glass px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="flex-1">
              <span className="sr-only">Your phone number</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.currentTarget.value)}
                placeholder="Phone"
                inputMode="tel"
                autoComplete="tel"
                className="w-full rounded-xl border border-glass-border bg-glass px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          </div>
        </div>

        {/* Transcript */}
        <div className="glass-panel relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl">
          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-5 p-4 sm:p-6">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  from={message.role}
                  className="animate-rise-in items-start gap-3"
                  style={{ flexDirection: "row" }}
                >
                  {message.role === "assistant" && <AssistantAvatar />}
                  <MessageContent
                    className={cn(
                      "leading-relaxed",
                      message.role === "user" &&
                        "rounded-2xl bg-gradient-brand px-4 py-3 text-primary-foreground shadow-[var(--shadow-glow)] group-[.is-user]:bg-transparent group-[.is-user]:text-primary-foreground",
                      message.role === "assistant" &&
                        "rounded-2xl border border-glass-border bg-glass px-4 py-3 shadow-[var(--shadow-soft)]",
                      message.error &&
                        "border-destructive/50 bg-destructive/15 text-foreground",
                    )}
                  >
                    {message.error ? (
                      <div className="space-y-3">
                        <p className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                          <span>{message.text}</span>
                        </p>
                        <button
                          type="button"
                          onClick={retry}
                          disabled={isSending}
                          className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                          <RefreshCw className="size-3.5" />
                          Retry
                        </button>
                      </div>
                    ) : (
                      <MessageResponse>{message.text}</MessageResponse>
                    )}
                  </MessageContent>
                </Message>
              ))}

              {isSending && (
                <Message
                  from="assistant"
                  className="animate-rise-in items-start gap-3"
                  style={{ flexDirection: "row" }}
                >
                  <AssistantAvatar />
                  <MessageContent className="rounded-2xl border border-glass-border bg-glass px-4 py-3">
                    <Shimmer>{`${ASSISTANT_NAME} is typing…`}</Shimmer>
                  </MessageContent>
                </Message>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        {/* Suggestions */}
        {isFresh && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void send(prompt)}
                className="glass-panel animate-rise-in rounded-full px-3.5 py-2 text-xs font-medium text-foreground/90 transition-transform duration-200 hover:-translate-y-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <div className="glass-panel mt-3 rounded-3xl p-2">
          <PromptInput onSubmit={handleSubmit} className="border-0 bg-transparent shadow-none">
            <PromptInputTextarea
              aria-label="Message the booking assistant"
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Tell me the service, day and your name & number…"
              className="bg-transparent text-foreground placeholder:text-muted-foreground"
            />
            <PromptInputFooter className="justify-between border-0 px-2 pb-1">
              <span className="text-[11px] text-muted-foreground">
                Enter to send · Shift + Enter for a new line
              </span>
              <PromptInputSubmit
                aria-label="Send message"
                {...(isSending ? { status: "submitted" as const } : {})}
                disabled={isSending || input.trim().length === 0}
                className="bg-gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]"
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
