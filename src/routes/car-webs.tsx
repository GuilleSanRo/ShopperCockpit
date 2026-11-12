import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { trackEvent } from "@/lib/analytics";
import { EUROPE_CAR_WEBS, OVERSEAS_CAR_WEBS, type CarWeb } from "@/lib/carWebs";

export const Route = createFileRoute("/car-webs")({
  head: () => ({
    meta: [
      { title: "CAR WEBS — Shopper Cockpit" },
      {
        name: "description",
        content: "Car websites by country to consult vehicle information on the internet.",
      },
      { property: "og:title", content: "CAR WEBS — Shopper Cockpit" },
      {
        property: "og:description",
        content: "Car websites by country to consult vehicle information on the internet.",
      },
    ],
  }),
  component: CarWebs,
});

const panelStyle = {
  backgroundColor: "#FFFFFF",
  borderColor: "#E1E4EE",
  borderRadius: 4,
} as const;

const headStyle = {
  backgroundColor: "#F7F8FC",
  borderColor: "#E1E4EE",
} as const;

const thClass =
  "px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-foreground";

function CarWebsTable({ id, title, links }: { id: string; title: string; links: CarWeb[] }) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex h-full flex-col overflow-hidden border"
      style={panelStyle}
    >
      <h2
        id={`${id}-title`}
        className="border-b px-4 py-3 text-xs font-semibold uppercase tracking-widest text-foreground"
        style={headStyle}
      >
        {title}
      </h2>
      <table className="w-full flex-1 text-sm">
        <thead>
          <tr className="border-b" style={headStyle}>
            <th scope="col" className={`${thClass} w-[92px]`}>
              Country
            </th>
            <th scope="col" className={thClass}>
              Website
            </th>
            <th scope="col" className={thClass}>
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {links.map((item, index) => (
            <tr
              key={item.id}
              className={index > 0 ? "border-t align-top" : "align-top"}
              style={index > 0 ? { borderColor: "#E1E4EE" } : undefined}
            >
              <td className="px-3 py-3 align-top text-xs font-medium text-foreground">
                {item.country}
              </td>
              <td className="px-3 py-3 align-top">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("car_web_clicked", { id: item.id, url: item.url })}
                  className="break-words underline hover:no-underline"
                  style={{ color: "var(--accent-blue)" }}
                >
                  {item.name}
                </a>
              </td>
              <td className="px-3 py-3 align-top">
                <span
                  className="block break-all font-mono text-[11px] leading-snug select-all"
                  style={{ color: "var(--text-secondary)" }}
                  title={item.url}
                >
                  {item.url}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function CarWebs() {
  return (
    <PageShell
      title="CAR WEBS"
      subtitle="Car websites by country to consult vehicle information on the internet:"
    >
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <CarWebsTable id="overseas" title="OVERSEAS" links={OVERSEAS_CAR_WEBS} />
        <CarWebsTable id="europe" title="EUROPE" links={EUROPE_CAR_WEBS} />
      </div>
    </PageShell>
  );
}
