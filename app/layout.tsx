import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildScope — Turn a workflow into a buildable AI tool spec",
  description:
    "Answer 8 questions. Get a complete AI tool spec, build plan, and UI brief in 10 minutes. From AI Builders Club.",
  openGraph: {
    title: "BuildScope — Pain to spec. Spec to UI. UI to sprint.",
    description:
      "Turn one painful workflow into a buildable AI tool spec in 10 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
