import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <header className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="font-mono text-sm tracking-tight">
          <span className="font-semibold">BuildScope</span>
          <span className="text-muted"> · by AI Builders Club</span>
        </div>
        <Link
          href="/generator"
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Start →
        </Link>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <div className="text-xs font-mono uppercase tracking-widest text-muted mb-6">
          For operators who want to build, not just talk about building
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
          Turn one painful workflow
          <br />
          into a buildable AI tool spec.
          <br />
          <span className="text-muted">In ten minutes.</span>
        </h1>
        <p className="text-lg text-ink/80 leading-relaxed max-w-2xl mb-10">
          Answer 8 questions about a workflow that&apos;s eating your time. Get a
          complete tool spec, a build plan, a UI brief, and a sprint-fit score
          you can take to v0, Lovable, Cursor, or Claude Code and start
          shipping.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded-full font-medium hover:bg-accent transition-colors"
          >
            Generate my spec
            <span aria-hidden>→</span>
          </Link>
          <a
            href="#how"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium border border-line hover:border-ink transition-colors"
          >
            How it works
          </a>
        </div>

        <div className="border-t border-line pt-6 text-sm text-muted">
          Free. No login. Email only required to export your spec.
        </div>
      </section>

      <section id="how" className="max-w-3xl mx-auto px-6 py-16 border-t border-line">
        <h2 className="text-2xl font-semibold mb-8">The flow</h2>
        <ol className="space-y-6">
          {[
            ["01", "Pain", "Name the repeat workflow that's eating your time."],
            ["02", "Shape", "Pick the role, trigger, inputs, outputs, and human checkpoint."],
            ["03", "Spec", "Get a clean, scope-bound AI tool spec — not a vague idea."],
            ["04", "Plan", "Get a build plan with stack suggestions and a v1 you can actually ship."],
            ["05", "UI", "Get a UI brief and a copy-paste prompt for v0 / Lovable / Cursor."],
            ["06", "Score", "Get a sprint-fit score so you know if this is the right project to commit to."],
          ].map(([num, title, body]) => (
            <li key={num} className="flex gap-5">
              <div className="font-mono text-sm text-muted pt-1 w-8 shrink-0">{num}</div>
              <div>
                <div className="font-semibold mb-1">{title}</div>
                <div className="text-ink/75 text-[15px] leading-relaxed">{body}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-line">
        <div className="rounded-2xl bg-ink text-paper p-10">
          <div className="font-mono text-xs uppercase tracking-widest text-paper/60 mb-3">
            What this is for
          </div>
          <h2 className="text-3xl font-semibold mb-4 leading-tight">
            The bridge into AI Builders Club.
          </h2>
          <p className="text-paper/80 leading-relaxed mb-6">
            AI Builders Club runs 4-week sprints, capped at 8 builders per
            cohort. We help operators ship a real internal AI tool — not a demo,
            not a tutorial, not a course project. BuildScope is how you arrive
            with the right idea instead of the wrong one.
          </p>
          <Link
            href="/generator"
            className="inline-flex items-center gap-2 bg-paper text-ink px-5 py-2.5 rounded-full font-medium hover:bg-accent hover:text-paper transition-colors"
          >
            Generate my spec →
          </Link>
        </div>
      </section>

      <footer className="max-w-3xl mx-auto px-6 py-12 border-t border-line text-sm text-muted flex justify-between items-center">
        <div className="font-mono">aibuildersclub.ai</div>
        <div>© 2026</div>
      </footer>
    </main>
  );
}
