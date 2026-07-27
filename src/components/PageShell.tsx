import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "./Header";
import type { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showBack?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        {showBack && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-6 hover:text-[color:var(--accent-blue)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden /> Back to Dashboard
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </p>
        )}
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
