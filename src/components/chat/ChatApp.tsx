import { useCallback, useRef, useState } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

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
import { DEFAULT_THEME, type ChatThemeId } from "./themes";
import avatarUrl from "@/assets/assistant-avatar.png";
import { extractAnswer } from "@/lib/chat-response";
import {
  ASSISTANT_NAME,
  ASSISTANT_SYSTEM_INSTRUCTIONS,
  CHAT_WEBHOOK_URL,
  SUGGESTED_PROMPTS,
  WELCOME_MESSAGE,
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
  const lastUserMessage = useRef<string | null>(null);

  const send = useCallback(async (text: string, isRetry = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    lastUserMessage.current = trimmed;
    setIsSending(true);

    setMessages((prev) => {
      const base = isRetry ? prev.filter((m) => !m.error) : prev;
      return isRetry
        ? base
        : [...base, { id: newId(), role: "user" as Role, text: trimmed }];
    });

    try {
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          systemInstructions: ASSISTANT_SYSTEM_INSTRUCTIONS,
        }),
      });

      if (!response.ok) {
        throw new Error(`The assistant service replied with ${response.status}.`);
      }

      const raw = await response.text();
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "assistant", text: extractAnswer(raw) },
      ]);
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          error: true,
          text: `I'm terribly sorry — I couldn't reach the assistant service. ${reason}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }, []);

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

  const showSuggestions = messages.length === 1 && !isSending;

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
            <AssistantAvatar className="animate-bob size-10 sm:size-11" />
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold tracking-tight sm:text-lg">
                {ASSISTANT_NAME}
                <span className="text-gradient-brand"> · Assistant</span>
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                {isSending ? "Composing a reply…" : "Always polite. Always here to help."}
              </p>
            </div>
          </div>
          <ThemeSwitcher value={theme} onChange={setTheme} />
        </header>

        {/* Transcript */}
        <div className="glass-panel relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl">
          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-5 p-4 sm:p-6">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  from={message.role}
                  className="animate-rise-in items-start gap-3"
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
                <Message from="assistant" className="animate-rise-in items-start gap-3">
                  <AssistantAvatar />
                  <MessageContent className="rounded-2xl border border-glass-border bg-glass px-4 py-3">
                    <Shimmer>{ASSISTANT_NAME} is typing…</Shimmer>
                  </MessageContent>
                </Message>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        {/* Suggestions */}
        {showSuggestions && (
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
              aria-label="Message the assistant"
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              placeholder="Type your message… (Enter to send, Shift + Enter for a new line)"
              className="bg-transparent text-foreground placeholder:text-muted-foreground"
            />
            <PromptInputFooter className="justify-between border-0 px-2 pb-1">
              <span className="text-[11px] text-muted-foreground">
                Enter to send · Shift + Enter for a new line
              </span>
              <PromptInputSubmit
                aria-label="Send message"
                status={isSending ? "submitted" : undefined}
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
