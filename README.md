# Aura Chat

Create a polished modern 3D chatbot web app. Requirements: 1) Full-screen responsive chat UI with a premium 3D/glassmorphism look, subtle depth, floating elements, soft shadows, smooth animations, and excellent mobile/desktop layout. 2) Include exactly 3 selectable color combinations/themes accessible from a compact theme switcher; make them visually distinct and attractive (for example: Indigo/Cyan, Purple/Pink, Emerald/Blue), while keeping text accessible. 3) Chat behavior: when the user submits a message, immediately add the user message to the chat, show a typing/loading state, POST the message to this webhook URL: http://localhost:5678/webhook/8039d74d-d0d0-4cc6-b147-b76b9f6bd804. Use JSON payload {"message":"<user message>"} and set Content-Type application/json. Handle JSON or text responses robustly; extract a sensible answer from common response shapes such as {answer}, {response}, {message}, or the first useful text field, and display it as the assistant reply. Preserve the conversation in local component state. 4) The assistant should have a friendly avatar and polite, mannered chat tone in the UI/system instructions. 5) Handle network errors gracefully with a helpful error bubble and retry option. Disable duplicate submits while a request is active but allow Enter to send and Shift+Enter for a newline. 6) Add welcome message and a few suggested prompt chips. 7) Do not add authentication or unnecessary backend/database; this app is a frontend that calls the supplied local n8n webhook directly. Make the webhook URL easy to change via a single constant/env-style config. 8) Use clean TypeScript/React/Tailwind and accessible buttons/labels. Build the complete working app, not just a mockup.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aura-chat-najaf-8039.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4797fc8e-45c4-4595-aaf1-49c15dc23c42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
