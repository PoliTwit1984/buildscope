"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, type Answers, type Question } from "@/lib/questions";

export default function Generator() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = QUESTIONS.length;
  const q = QUESTIONS[stepIndex];
  const value = answers[q.id];
  const isLast = stepIndex === total - 1;

  const canAdvance = (() => {
    if (!q.required) return true;
    if (q.type === "multi") return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.trim().length > 0;
  })();

  const setValue = (val: string | string[]) =>
    setAnswers((a) => ({ ...a, [q.id]: val }));

  const toggleMulti = (opt: string) => {
    const current = (answers[q.id] as string[]) || [];
    if (current.includes(opt)) {
      setValue(current.filter((x) => x !== opt));
    } else {
      setValue([...current, opt]);
    }
  };

  const next = async () => {
    setError(null);
    if (!canAdvance) return;
    if (!isLast) {
      setStepIndex(stepIndex + 1);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${res.status})`);
      }
      const data = await res.json();
      sessionStorage.setItem(`spec:${data.id}`, JSON.stringify(data));
      router.push(`/result?id=${data.id}`);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Try again.");
      setSubmitting(false);
    }
  };

  const back = () => {
    setError(null);
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Progress current={stepIndex + 1} total={total} />

      <div className="mt-10">
        <div className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
          Step {q.step} of {total}
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-3">
          {q.title}
        </h1>
        {q.subtitle && (
          <p className="text-ink/70 leading-relaxed mb-8">{q.subtitle}</p>
        )}

        <Field q={q} value={value} setValue={setValue} toggleMulti={toggleMulti} />

        {error && (
          <div className="mt-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={back}
            disabled={stepIndex === 0 || submitting}
            className="text-sm text-muted hover:text-ink disabled:opacity-30 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={!canAdvance || submitting}
            className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded-full font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting
              ? "Generating your spec..."
              : isLast
              ? "Generate spec →"
              : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < current ? "bg-ink" : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}

function Field({
  q,
  value,
  setValue,
  toggleMulti,
}: {
  q: Question;
  value: string | string[] | undefined;
  setValue: (val: string | string[]) => void;
  toggleMulti: (opt: string) => void;
}) {
  if (q.type === "textarea") {
    const v = (value as string) || "";
    return (
      <div>
        <textarea
          autoFocus
          value={v}
          onChange={(e) => setValue(e.target.value)}
          placeholder={q.placeholder}
          maxLength={q.maxLength}
          rows={5}
          className="w-full p-4 rounded-xl border border-line focus:border-ink focus:outline-none text-[15px] leading-relaxed resize-none bg-white"
        />
        {q.maxLength && (
          <div className="mt-2 text-xs text-muted text-right font-mono">
            {v.length} / {q.maxLength}
          </div>
        )}
      </div>
    );
  }

  if (q.type === "text") {
    return (
      <input
        autoFocus
        type="text"
        value={(value as string) || ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder={q.placeholder}
        maxLength={q.maxLength}
        className="w-full p-4 rounded-xl border border-line focus:border-ink focus:outline-none text-[15px] bg-white"
      />
    );
  }

  if (q.type === "single") {
    const v = value as string | undefined;
    return (
      <div className="space-y-2">
        {q.options!.map((opt) => {
          const selected = v === opt;
          return (
            <button
              key={opt}
              onClick={() => setValue(opt)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-white hover:border-ink"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === "multi") {
    const v = (value as string[]) || [];
    return (
      <div>
        <div className="flex flex-wrap gap-2">
          {q.options!.map((opt) => {
            const selected = v.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleMulti(opt)}
                className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-white hover:border-ink"
                }`}
              >
                {selected && <span className="mr-1">✓</span>}
                {opt}
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-muted font-mono">
          {v.length} selected
        </div>
      </div>
    );
  }

  return null;
}
