import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { trackEvent } from "@/lib/analytics";

interface OldLink {
  id: string;
  order: number;
  title: string;
  url: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const OLD_LINKS: OldLink[] = [
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
    title: "Usuario promoCAR Online",
    url: "https://ktglbuc.sharepoint.com/sites/promoCAR/Usuario%20promoCAR/Forms/AllItems.aspx?ovuser=1e355c04%2De0a4%2D42ed%2D8e2d%2D7351591f0ef1%2Cguillermo%2Esantiago%40kantar%2Ecom&OR=Teams%2DHL&CT=1669031350432&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIyNy8yMjEwMjgxMTQwMCIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D",
    notes: "Usuario promoCAR en web",
    createdAt: "2026-10-08",
    updatedAt: "2026-02-15",
  },
  {
    id: "3",
    order: 3,
    title: "Share Point Client",
    url: "https://ktglbuc.sharepoint.com/sites/cdp-promocar/spain/promocar/Pages/default.aspx",
    notes: "Documentation and reports for client (old)",
    createdAt: "2026-10-08",
    updatedAt: "2026-02-15",
  },
  {
    id: "4",
    order: 4,
    title: "SMT Desarrollo",
    url: "http://desarrollo.smt.promocar.es:8081/welcome_to_system.aspx",
    notes: "Shopper Management Tool (SMT) Desarrollo",
    createdAt: "2026-10-08",
    updatedAt: "2026-10-08",
  },
  {
    id: "5",
    order: 5,
    title: "Kantar IT Tickets",
    url: "https://kantarit.service-now.com/mykantarservices",
    notes: "My Kantar Services",
    createdAt: "2026-10-08",
    updatedAt: "2026-10-08",
  },
  {
    id: "6",
    order: 6,
    title: "Flashlight Analytics",
    url: "https://gcd.flashlight-analytics.com/usrtool/login/",
    notes: "Pricer - Flashlight Website",
    createdAt: "2026-10-08",
    updatedAt: "2026-10-08",
  },
  {
    id: "7",
    order: 7,
    title: "Time Camp",
    url: "https://app.timecamp.com/app#/timesheets/graphical",
    notes: "Tracking Working Hours",
    createdAt: "2026-10-08",
    updatedAt: "2026-10-08",
  },
  {
    id: "8",
    order: 8,
    title: "Model List",
    url: "https://ktglbuc.sharepoint.com/:x:/r/sites/cdp-promocar/spain/promocar/_layouts/15/Doc.aspx?sourcedoc=%7B2AAF4C4D-2F0A-4C0C-92DB-22119B698CBF%7D&file=Models%20List%20(Codes).xlsx&action=default&mobileredirect=true",
    notes: "List with promoCAR models, make (brand), segment, code, etc.",
    createdAt: "2026-10-08",
    updatedAt: "2026-10-08",
  },
  {
    id: "8",
    order: 8,
    title: "Kantar RRHH Tickets",
    url: "https://kantarit.service-now.com/mykantarservices?id=sc_cat_item&sys_id=710615cb2be60f507ea3f45bce91bf15",
    notes: "My Kantar Services for HHRR",
    createdAt: "2026-10-08",
    updatedAt: "2026-10-08",
  },
];

function OldLinks() {
  return (
    <PageShell title="Old Links" subtitle="Legacy links kept for reference.">
      {OLD_LINKS.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No old links added yet.</p>
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
