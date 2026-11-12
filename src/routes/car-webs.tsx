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

const thClass =
  "pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em]";

const thStyle = { color: "var(--text-secondary)" } as const;

function CarWebsTable({ id, title, links }: { id: string; title: string; links: CarWeb[] }) {
  return (
    <section aria-labelledby={`${id}-title`} className="flex h-full flex-col">
      <h2
        id={`${id}-title`}
        className="mb-5 text-center text-sm font-bold uppercase tracking-[0.22em] text-foreground"
      >
        {title}
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th scope="col" className={`${thClass} pr-4`} style={thStyle}>
              Country
            </th>
            <th scope="col" className={`${thClass} pr-4`} style={thStyle}>
              Website
            </th>
            <th scope="col" className={thClass} style={thStyle}>
              URL
            </th>
          </tr>
        </thead>
        <tbody>
          {links.map((item) => {
            const shownUrl = item.displayUrl ?? item.url;

            return (
              <tr key={item.id} className="align-top">
                <td className="whitespace-nowrap py-2.5 pr-4 align-top text-xs font-semibold text-foreground">
                  {item.country}
                </td>
                <td className="py-2.5 pr-4 align-top">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("car_web_clicked", { id: item.id, url: item.url })}
                    className="break-words underline decoration-1 underline-offset-2 hover:no-underline"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    {item.name}
                  </a>
                </td>
                <td className="py-2.5 align-top">
                  <span
                    className="block break-all font-mono text-[11px] leading-snug select-all"
                    style={{ color: "#2C3243" }}
                    title={shownUrl}
                  >
                    {shownUrl}
                  </span>
                </td>
              </tr>
            );
          })}
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
      wide
    >
      <div className="grid items-stretch gap-10 lg:grid-cols-2 xl:gap-16">
        <CarWebsTable id="overseas" title="OVERSEAS" links={OVERSEAS_CAR_WEBS} />
        <CarWebsTable id="europe" title="EUROPE" links={EUROPE_CAR_WEBS} />
      </div>
    </PageShell>
  );
}

