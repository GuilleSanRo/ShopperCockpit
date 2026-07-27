import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { DashboardCardTile } from "@/components/DashboardCardTile";
import { dashboardCards } from "@/lib/dashboardCards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shopper Cockpit — Kantar" },
      {
        name: "description",
        content:
          "Kantar Shopper Cockpit: SMT, 360 Navigator, LCV Graphs, Macro to Location, Pricer to Matrix, Checking COM.",
      },
      { property: "og:title", content: "Shopper Cockpit — Kantar" },
      {
        property: "og:description",
        content: "Internal productivity hub for Kantar Shopper project workflows.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header />
      <main
        className="grid gap-px border-t border-b"
        style={{
          borderColor: "#E1E4EE",
          backgroundColor: "#E1E4EE",
          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
        }}
      >
        <div className="contents md:hidden">
          {dashboardCards.map((c) => (
            <DashboardCardTile key={c.id} card={c} />
          ))}
        </div>
        <div className="hidden md:grid lg:hidden col-span-full grid-cols-2 gap-px" style={{ backgroundColor: "#E1E4EE" }}>
          {dashboardCards.map((c) => (
            <DashboardCardTile key={c.id} card={c} />
          ))}
        </div>
        <div className="hidden lg:grid col-span-full grid-cols-3 gap-px" style={{ backgroundColor: "#E1E4EE" }}>
          {dashboardCards.map((c) => (
            <DashboardCardTile key={c.id} card={c} />
          ))}
        </div>
      </main>
    </div>
  );
}
