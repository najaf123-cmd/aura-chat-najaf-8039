import { createFileRoute } from "@tanstack/react-router";
import { ChatApp } from "@/components/chat/ChatApp";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Aura Beauty Salon — Book by Chat" },
      {
        name: "description",
        content:
          "Book hair, skin, nail and spa appointments at Aura Beauty Salon through a friendly AI chat assistant. See services, prices and live availability.",
      },
      { property: "og:title", content: "Aura Beauty Salon — Book by Chat" },
      {
        property: "og:description",
        content:
          "Chat with Aura to pick a service, share your name and number, and confirm your salon appointment in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatApp,
});
