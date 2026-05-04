import Link from "next/link";
import { Suspense } from "react";
import Result from "@/components/Result";

export const metadata = {
  title: "Your AI tool spec — BuildScope",
};

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm tracking-tight">
          <span className="font-semibold">BuildScope</span>
          <span className="text-muted"> · by AI Builders Club</span>
        </Link>
        <Link
          href="/generator"
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Start over
        </Link>
      </header>
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto px-6 py-24 text-center">
            <div className="font-mono text-sm text-muted">Loading…</div>
          </div>
        }
      >
        <Result />
      </Suspense>
    </main>
  );
}
