<div align="center">

# 🧰 BuildScope

**Turn one painful workflow into a buildable AI tool spec in 10 minutes.**

The AI Builders Club lead-magnet app. Answer 8 questions about a workflow eating your time → get a complete AI tool spec back, ready to ship.

[![Built_for](https://img.shields.io/badge/Built_for-AI_Builders_Club-d97757)](https://aibuildersclub.ai)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org)
[![Anthropic](https://img.shields.io/badge/Powered_by-Claude_Sonnet-d97757)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

</div>

---

## What it does

1. You answer **8 questions** about a workflow eating your time
2. **Claude turns the answers into a full spec**, including:
   - Tool name + problem statement
   - Inputs / outputs
   - Workflow steps + AI behavior + human checkpoints
   - First ugly version (what to ship in week 1)
   - Success criteria + sprint-fit score
   - Tech path + UI brief
3. You **download the spec as Markdown** and get routed toward the next AIBC sprint

## Quick start

```bash
git clone https://github.com/joewilsonai/buildscope
cd buildscope
cp .env.example .env.local   # add ANTHROPIC_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind**
- **Anthropic SDK** (Claude Sonnet 4.6 by default)
- **Zod** for response validation
- No database — session storage holds the spec until export

## Deploy (Vercel)

```bash
vercel
```

Required env vars:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Required — Claude generates the spec |
| `ANTHROPIC_MODEL` | Optional — defaults to `claude-sonnet-4-6` |
| `SUBSCRIBE_WEBHOOK_URL` | Optional — captures email opt-ins |

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/generator` | 8-step intake form |
| `/result?id=...` | Generated spec view (email gate before back half) |
| `/api/generate` | POST answers → returns spec |
| `/api/subscribe` | POST email → forwards to webhook or logs |

## Why it exists

[AI Builders Club](https://aibuildersclub.ai) runs 4-week sprints for non-engineers who want to ship real AI products. The hardest part is the first 10 minutes — *which workflow should I even build?*

BuildScope answers that question.

## License

MIT
