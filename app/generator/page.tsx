import Link from "next/link";
import Generator from "@/components/Generator";

export const metadata = {
  title: "Generate your AI tool spec — BuildScope",
};

export default function GeneratorPage() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm tracking-tight">
          <span className="font-semibold">BuildScope</span>
          <span className="text-muted"> · by AI Builders Club</span>
        </Link>
      </header>
      <Generator />
    </main>
  );
}
