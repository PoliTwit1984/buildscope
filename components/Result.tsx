"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Spec } from "@/lib/spec-schema";
import { specToMarkdown } from "@/lib/markdown";

type Payload = {
  id: string;
  spec: Spec;
  answers: Record<string, unknown>;
  createdAt: string;
};

export default function Result() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [data, setData] = useState<Payload | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.push("/generator");
      return;
    }
    const raw = sessionStorage.getItem(`spec:${id}`);
    if (!raw) {
      router.push("/generator");
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.push("/generator");
    }
    if (sessionStorage.getItem("buildscope:email")) setUnlocked(true);
  }, [id, router]);

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="font-mono text-sm text-muted">Loading…</div>
      </div>
    );
  }

  const spec = data.spec;

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError("That doesn't look like an email.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          toolName: spec.toolName,
          sprintFit: spec.sprintFit.score,
        }),
      });
      sessionStorage.setItem("buildscope:email", email.trim());
      setUnlocked(true);
    } catch {
      setEmailError("Couldn't save your email. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadMarkdown = () => {
    const md = specToMarkdown(spec);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(spec.toolName)}-spec.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(spec.uiBrief.copyPastePrompt);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
        Your spec
      </div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-3">
        {spec.toolName}
      </h1>
      <p className="text-ink/75 text-lg leading-relaxed">
        {spec.problemStatement}
      </p>

      <ScoreCard score={spec.sprintFit.score} />

      <div className="prose-spec mt-12">
        <Section title="Target user">
          <p>{spec.targetUser}</p>
        </Section>

        <Section title="Inputs">
          <ul>
            {spec.inputs.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </Section>

        <Section title="Outputs">
          <ul>
            {spec.outputs.map((o, idx) => (
              <li key={idx}>{o}</li>
            ))}
          </ul>
        </Section>

        <Section title="Workflow">
          <ol>
            {spec.workflowSteps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </Section>

        {!unlocked ? (
          <EmailGate
            email={email}
            setEmail={setEmail}
            submitting={submitting}
            error={emailError}
            onSubmit={submitEmail}
          />
        ) : (
          <>
            <Section title="AI behavior">
              <p>{spec.aiBehavior}</p>
            </Section>

            <Section title="Human checkpoints">
              <ul>
                {spec.humanCheckpoints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </Section>

            <Section title="First ugly version">
              <p>{spec.firstUglyVersion}</p>
            </Section>

            <Section title="Success criteria">
              <ul>
                {spec.successCriteria.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </Section>

            <Section title="Tech path">
              <ul>
                {spec.techPath.stack.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
              <p className="text-muted">
                <strong className="text-ink">Why:</strong>{" "}
                {spec.techPath.rationale}
              </p>
            </Section>

            <Section title="UI brief">
              <h3>Layout</h3>
              <p>{spec.uiBrief.layout}</p>
              <h3>Key screens</h3>
              <ul>
                {spec.uiBrief.keyScreens.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
              <h3>Copy-paste prompt for v0 / Lovable / Cursor</h3>
              <pre>
                <code>{spec.uiBrief.copyPastePrompt}</code>
              </pre>
              <button
                onClick={copyPrompt}
                className="text-sm font-medium text-accent hover:text-accentHover"
              >
                Copy prompt
              </button>
            </Section>

            <Section title="Sprint fit — full breakdown">
              <h3>Why this works</h3>
              <ul>
                {spec.sprintFit.reasons.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
              {spec.sprintFit.risks.length > 0 && (
                <>
                  <h3>Risks to watch</h3>
                  <ul>
                    {spec.sprintFit.risks.map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </>
              )}
            </Section>

            <div className="mt-12 flex flex-wrap gap-3">
              <button
                onClick={downloadMarkdown}
                className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 rounded-full font-medium hover:bg-accent transition-colors"
              >
                Download spec.md
              </button>
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium border border-line hover:border-ink transition-colors"
              >
                Generate another
              </Link>
            </div>

            <SprintCTA score={spec.sprintFit.score} />
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ScoreCard({ score }: { score: number }) {
  const tier =
    score >= 80
      ? { label: "Strong fit", color: "bg-emerald-50 border-emerald-200 text-emerald-900" }
      : score >= 60
      ? { label: "Workable", color: "bg-amber-50 border-amber-200 text-amber-900" }
      : { label: "Sharpen first", color: "bg-rose-50 border-rose-200 text-rose-900" };

  return (
    <div className={`mt-8 rounded-2xl border ${tier.color} p-6 flex items-center gap-6`}>
      <div className="text-5xl font-semibold tabular-nums">{score}</div>
      <div>
        <div className="font-mono text-xs uppercase tracking-widest opacity-70">
          Sprint fit score
        </div>
        <div className="text-lg font-semibold">{tier.label}</div>
      </div>
    </div>
  );
}

function EmailGate({
  email,
  setEmail,
  submitting,
  error,
  onSubmit,
}: {
  email: string;
  setEmail: (e: string) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section className="mt-12 rounded-2xl border border-line bg-white p-8">
      <div className="font-mono text-xs uppercase tracking-widest text-muted mb-3">
        Unlock the full spec
      </div>
      <h2 className="text-2xl font-semibold mb-2 text-ink">
        Email to see the build plan, UI brief, and sprint breakdown.
      </h2>
      <p className="text-ink/70 mb-6 text-[15px]">
        We&apos;ll save your spec, send you a copy, and let you know when the next AI
        Builders Club sprint opens. No spam.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 p-3 rounded-xl border border-line focus:border-ink focus:outline-none text-[15px] bg-paper"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-ink text-paper px-6 py-3 rounded-xl font-medium hover:bg-accent disabled:opacity-50 transition-colors"
        >
          {submitting ? "Saving…" : "Unlock"}
        </button>
      </form>
      {error && (
        <div className="mt-3 text-sm text-red-600">{error}</div>
      )}
    </section>
  );
}

function SprintCTA({ score }: { score: number }) {
  const strong = score >= 80;
  return (
    <div className="mt-16 rounded-2xl bg-ink text-paper p-10">
      <div className="font-mono text-xs uppercase tracking-widest text-paper/60 mb-3">
        {strong ? "This is sprint material" : "Want help shaping it?"}
      </div>
      <h2 className="text-3xl font-semibold mb-4 leading-tight">
        {strong
          ? "Build this in the next 4-week sprint."
          : "Bring this into the next sprint and we'll sharpen it together."}
      </h2>
      <p className="text-paper/80 leading-relaxed mb-6 max-w-xl">
        AI Builders Club runs 4-week sprints capped at 8 builders. You ship a
        real internal AI tool — not a demo. Graduates get ongoing access to the
        community.
      </p>
      <a
        href="https://aibuildersclub.ai"
        className="inline-flex items-center gap-2 bg-paper text-ink px-5 py-2.5 rounded-full font-medium hover:bg-accent hover:text-paper transition-colors"
      >
        Apply for the next sprint →
      </a>
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
