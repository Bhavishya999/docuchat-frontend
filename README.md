# DocuChat Frontend

A clean, responsive Single Page Application for uploading documents and chatting with them using AI — powered by the DocuChat backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev) |
| Build Tool | [Vite](https://vitejs.dev) |
| Language | TypeScript (strict mode) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| HTTP Client | Axios |
| Deployment | [Render](https://render.com) Static Site (free tier) |

## Features

- Drag-and-drop or click-to-upload PDF / text files
- Real-time document list with delete support
- Chat interface with message history
- Source citations shown below each AI answer
- Responsive design — works on mobile and desktop
- Loading states and error handling throughout

## Project Structure

```
src/
├── App.tsx                 # Root layout and state
├── main.tsx                # Entry point
├── index.css               # Tailwind base + custom tokens
├── components/
│   ├── FileUpload.tsx       # Upload dropzone component
│   ├── DocumentList.tsx     # Sidebar document list
│   ├── ChatInterface.tsx    # Chat panel with input
│   └── MessageBubble.tsx    # Individual message display
├── hooks/
│   └── useChat.ts           # Chat state and API calls
├── services/
│   └── api.ts               # Axios client + typed API methods
└── types/
    └── index.ts             # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 20+
- DocuChat backend running (locally or deployed)

### Installation

```bash
git clone https://github.com/Bhavishya999/docuchat-frontend.git
cd docuchat-frontend
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Deployment (Render)

1. Push to GitHub
2. Create a new **Static Site** on [Render](https://render.com)
3. Set **Build Command:** `npm install && npm run build`
4. Set **Publish Directory:** `dist`
5. Add `VITE_API_URL` pointing to your deployed backend URL

## License

MIT
