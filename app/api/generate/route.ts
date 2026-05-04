import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { SpecSchema } from "@/lib/spec-schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const answers = body?.answers;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json({ error: "Missing answers." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(answers) }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Empty response from model." },
        { status: 502 }
      );
    }

    const raw = textBlock.text.trim();
    const jsonText = extractJson(raw);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Model returned non-JSON output.", raw: raw.slice(0, 400) },
        { status: 502 }
      );
    }

    const result = SpecSchema.safeParse(parsed);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Spec failed validation.",
          issues: result.error.issues.slice(0, 5),
        },
        { status: 502 }
      );
    }

    const id = newId();
    return NextResponse.json({
      id,
      spec: result.data,
      answers,
      createdAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Generation failed." },
      { status: 500 }
    );
  }
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text;
}
