import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/read-me")({
  head: () => ({
    meta: [
      { title: "Read Me — Shopper Cockpit" },
      { name: "description", content: "How to use each Shopper Cockpit tool." },
      { property: "og:title", content: "Read Me — Shopper Cockpit" },
      { property: "og:description", content: "How to use each Shopper Cockpit tool." },
    ],
  }),
  component: ReadMe,
});

const sections = [
  { title: "SMT", body: "Opens the data-checking website in a new tab." },
  { title: "360 Navigator", body: "Opens the client platform in a new tab." },
  { title: "LCV Graphs", body: "Opens one client dashboard in a new tab." },
  {
    title: "Matrix to Location",
    body: "Upload Matrix, choose month/year, download Location file.",
  },
  { title: "From Pricer to Matrix", body: "Opens the existing MatchWheels app." },
  { title: "Checking COM", body: "Upload Checking COM and download enhanced workbook." },
];

function ReadMe() {
  useEffect(() => trackEvent("read_me_opened", {}), []);
  return (
    <PageShell
      title="Read Me"
      subtitle="This hub centralises the daily project webs and Excel automation Shopper tools in one place."
    >
      <ol className="space-y-4">
        {sections.map((s, i) => (
          <li
            key={s.title}
            className="border p-5 bg-white"
            style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
          >
            <h2 className="text-sm uppercase tracking-widest font-semibold">
              {i + 1}. {s.title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {s.body}
            </p>
          </li>
        ))}
      </ol>
      <p
        className="mt-6 text-xs italic border-l-4 pl-4 py-2"
        style={{ borderColor: "var(--accent-blue)", color: "var(--text-secondary)" }}
      >
        Excel tools process a copy of the uploaded file; the original file is never overwritten.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-block px-5 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
        >
          Back to Dashboard
        </Link>
      </div>
    </PageShell>
  );
}
