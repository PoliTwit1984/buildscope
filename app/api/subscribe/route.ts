import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = String(body?.email || "").trim().toLowerCase();
  const toolName = String(body?.toolName || "").slice(0, 200);
  const sprintFit = Number(body?.sprintFit) || 0;

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const webhook = process.env.SUBSCRIBE_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          toolName,
          sprintFit,
          source: "buildscope",
          ts: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error("[subscribe] webhook failed:", e);
    }
  } else {
    console.log(
      `[subscribe] ${email} | tool=${toolName} | fit=${sprintFit}`
    );
  }

  return NextResponse.json({ ok: true });
}
