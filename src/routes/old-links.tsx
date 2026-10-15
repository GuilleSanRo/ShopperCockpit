import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { trackEvent } from "@/lib/analytics";
import type { LinkItem } from "./other-links";

const OLD_LINKS: LinkItem[] = [
  {
    id: "1",
    order: 1,
    title: "Shopper Online",
    url: "https://shopperonline.promocar.es/",
    notes: "Client Shopper platform (old)",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "2",
    order: 2,
    title: "Share Point Client",
    url: "https://ktglbuc.sharepoint.com/sites/cdp-promocar/spain/promocar/Pages/default.aspx",
    notes: "Documentation and reports for client (old)",
    createdAt: "2026-10-08",
    updatedAt: "2026-02-15",
  },
];

export const Route = createFileRoute("/old-links")({
  head: () => ({
    meta: [
      { title: "Old Links — Shopper Cockpit" },
      { name: "description", content: "Historical external links and legacy client platforms kept for reference." },
      { property: "og:title", content: "Old Links — Shopper Cockpit" },
      { property: "og:description", content: "Historical external links and legacy client platforms kept for reference." },
    ],
  }),
  component: OldLinks,
});

function OldLinks() {
  return (
    <PageShell title="Old Links" subtitle="Historical external links and legacy platforms kept for reference.">
      {OLD_LINKS.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No old links found.</p>
      ) : (
        <div className="overflow-x-auto border" style={{ borderColor: "#E1E4EE", borderRadius: 4 }}>
          <table className="w-full text-sm bg-white">
            <thead style={{ backgroundColor: "var(--surface)" }}>
              <tr className="text-left">
                <th className="p-3 font-semibold w-12">#</th>
                <th className="p-3 font-semibold">Name / Title</th>
                <th className="p-3 font-semibold">Link</th>
                <th className="p-3 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {OLD_LINKS.map((l) => (
                <tr key={l.id} className="border-t" style={{ borderColor: "#E1E4EE" }}>
                  <td className="p-3">{l.order}</td>
                  <td className="p-3 font-medium">{l.title}</td>
                  <td className="p-3">
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("old_link_clicked", { id: l.id })}
                      style={{ color: "var(--accent-blue)" }}
                      className="underline hover:no-underline"
                    >
                      {l.title}
                    </a>
                  </td>
                  <td className="p-3" style={{ color: "var(--text-secondary)" }}>
                    {l.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          to="/"
          className="inline-block px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
        >
          Back to Dashboard
        </Link>
        <Link
          to="/other-links"
          className="inline-block px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
        >
          Back to Other Links
        </Link>
      </div>
    </PageShell>
  );
}
