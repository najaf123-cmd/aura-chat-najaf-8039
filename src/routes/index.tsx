import { createFileRoute } from "@tanstack/react-router";
import { ChatApp } from "@/components/chat/ChatApp";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Aria — 3D Glass AI Chat Assistant" },
      {
        name: "description",
        content:
          "Chat with Aria, a polite AI assistant in a premium 3D glassmorphism interface with three switchable colour themes.",
      },
      { property: "og:title", content: "Aria — 3D Glass AI Chat Assistant" },
      {
        property: "og:description",
        content:
          "A polished, responsive 3D chatbot experience with glassmorphism depth and three colour themes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatApp,
});
