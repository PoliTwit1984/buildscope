# BuildScope

The AI Builders Club lead-magnet app. Turns a painful workflow into a buildable AI tool spec in 10 minutes.

## What it does

1. User answers 8 questions about a workflow eating their time.
2. Claude turns those answers into a complete spec: tool name, problem statement, inputs/outputs, workflow steps, AI behavior, human checkpoints, first ugly version, success criteria, tech path, UI brief, and a sprint-fit score.
3. User downloads the spec as Markdown and gets routed toward applying for the next AIBC sprint.

## Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind
- Anthropic SDK (Claude Sonnet 4.6 by default)
- Zod for response validation
- No database — session storage holds the spec until export

## Run locally

```bash
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY
npm install
npm run dev
```

## Deploy (Vercel)

```bash
vercel
```

Set env vars in Vercel project settings:
- `ANTHROPIC_API_KEY` (required)
- `ANTHROPIC_MODEL` (optional, defaults to `claude-sonnet-4-6`)
- `SUBSCRIBE_WEBHOOK_URL` (optional)

## Routes

- `/` — landing page
- `/generator` — 8-step intake form
- `/result?id=...` — generated spec view (email gate before back half)
- `/api/generate` — POST answers → returns spec
- `/api/subscribe` — POST email → forwards to webhook or logs
