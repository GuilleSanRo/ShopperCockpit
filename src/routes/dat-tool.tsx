import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { trackEvent } from "@/lib/analytics";
import { DAT_ENTRY_URL } from "@/lib/datLinks";

export const Route = createFileRoute("/dat-tool")({
  head: () => ({
    meta: [
      { title: "DAT TOOL — Shopper Cockpit" },
      {
        name: "description",
        content:
          "Step-by-step guide to log into DAT, open SilverDAT valuateFinance and extract or estimate Residual Values (RV).",
      },
      { property: "og:title", content: "DAT TOOL — Shopper Cockpit" },
      {
        property: "og:description",
        content:
          "Step-by-step guide to log into DAT, open SilverDAT valuateFinance and extract or estimate Residual Values (RV).",
      },
    ],
  }),
  component: DatTool,
});

const panelStyle = {
  backgroundColor: "var(--surface)",
  borderColor: "#E1E4EE",
  borderRadius: 6,
} as const;

const credentials = [
  { id: "client", label: "Client Number", value: "1320645" },
  { id: "user", label: "User", value: "tanjaott" },
  { id: "password", label: "Password", value: "tanjaott2016" },
] as const;

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard API can be unavailable (permissions, non-secure context); fall back.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function Bullets({ children, nested = false }: { children: ReactNode; nested?: boolean }) {
  return (
    <ul
      className={`space-y-1.5 border-l pl-4 ${nested ? "mt-1.5" : "mt-2.5"}`}
      style={{ borderColor: "#E5E8F1" }}
    >
      {children}
    </ul>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="relative pl-3.5">
      <span
        aria-hidden
        className="absolute left-0 top-[0.6em] h-1 w-1 rounded-full"
        style={{ backgroundColor: "#AEB6C8" }}
      />
      {children}
    </li>
  );
}

function Step({
  number,
  title,
  tone = "default",
  last = false,
  children,
}: {
  number: number;
  title: ReactNode;
  tone?: "default" | "warning";
  last?: boolean;
  children: ReactNode;
}) {
  const warning = tone === "warning";

  return (
    <li className={`relative pl-11 ${last ? "" : "pb-8"}`}>
      {!last && (
        <span
          aria-hidden
          className="absolute left-[15px] top-10 bottom-0 w-px"
          style={{ backgroundColor: "#E1E4EE" }}
        />
      )}
      <span
        aria-hidden
        className="absolute left-0 top-0 inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold"
        style={
          warning
            ? { backgroundColor: "#FFF4E3", borderColor: "#EBD19B", color: "#8A5B10" }
            : { backgroundColor: "#F1F4FB", borderColor: "#DDE3F0", color: "var(--accent-blue)" }
        }
      >
        {number}
      </span>
      <h2 className="pt-1.5 text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {children}
      </div>
    </li>
  );
}

function DatTool() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, value: string) => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopiedId(id);
    trackEvent("dat_tool_credentials_copied", { field: id });
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
  };

  return (
    <PageShell
      title="DAT TOOL"
      subtitle="Get Residual Values (RVs) and Guaranteed Future Values (GFVs)"
    >
      <p className="mb-7 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        From DAT Tool website, step-by-step:
      </p>

      <ol className="m-0 list-none p-0">
        <Step number={1} title="Log in">
          <Bullets>
            {/* 1.1 */}
            <Bullet>
              Link:{" "}
              <a
                href={DAT_ENTRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("dat_tool_entry_opened", { url: DAT_ENTRY_URL })}
                className="inline-flex items-center gap-1 underline decoration-1 underline-offset-2 hover:no-underline"
                style={{ color: "var(--accent-blue)" }}
              >
                {DAT_ENTRY_URL}
                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden />
              </a>{" "}
              (or click{" "}
              <a
                href={DAT_ENTRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("dat_tool_entry_opened", { url: DAT_ENTRY_URL })}
                className="font-semibold underline decoration-1 underline-offset-2 hover:no-underline"
                style={{ color: "var(--accent-blue)" }}
              >
                HERE
              </a>
              )
            </Bullet>
            {/* 1.1 */}
            <Bullet>
              Go to <strong className="text-foreground">“ACCESS CLIENTS”</strong> (top-right).
            </Bullet>
          </Bullets>

          {/* 1.2 – 1.4 */}
          <dl className="mt-3 max-w-xl overflow-hidden border text-sm" style={panelStyle}>
            {credentials.map((item, index) => (
              <div
                key={item.id}
                className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 ${
                  index > 0 ? "border-t" : ""
                }`}
                style={index > 0 ? { borderColor: "#E1E4EE" } : undefined}
              >
                <dt
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.label}
                </dt>
                <dd className="flex items-center gap-3">
                  <span className="select-all font-mono text-[13px] text-foreground">
                    {item.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(item.id, item.value)}
                    aria-label={`Copy ${item.label}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-[color:var(--accent-blue)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5" aria-hidden />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden />
                    )}
                    {copiedId === item.id ? "Copied" : "Copy"}
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </Step>

        <Step number={2} title="Open SilverDAT valuateFinance">
          Normally the last option/logo at the end of the page.
        </Step>

        <Step number={3} title="Start a new search">
          <Bullets>
            <Bullet>A new tab opens with a grid/table.</Bullet>
            <Bullet>At the top-right you can change the language.</Bullet>
            <Bullet>
              To start a new search, click the blue button with a green cross{" "}
              <span className="whitespace-nowrap">❎</span>.
            </Bullet>
          </Bullets>
        </Step>

        <Step number={4} title="Enter a procedure name">
          It can be any name, or even something used before.
          <Bullets>
            <Bullet>
              Click <strong className="text-foreground">New vehicle</strong> (in Vehicle data →
              Filter options).
            </Bullet>
            <Bullet>
              In <strong className="text-foreground">“Vehicle Selection”</strong> (grey, bottom),
              use the Classic or Interactive mode to find the version.
            </Bullet>
          </Bullets>
        </Step>

        <Step number={5} title="Press “Continue” 3 times">
          The orange button at the bottom-right <span className="whitespace-nowrap"> ⇨ </span> press
          it 3 times.
        </Step>

        <Step number={6} title="Get the RV estimate">
          You will arrive at{" "}
          <strong className="text-foreground">
            “&gt;&gt; ✥New vehicle residual value prediction”
          </strong>
          . Stop there. It should be:
          <Bullets>
            <Bullet>
              Price: <strong className="text-foreground">“Net”</strong>
            </Bullet>
            <Bullet>
              Output: <strong className="text-foreground">“Dealership purchasing value”</strong>
            </Bullet>
            <Bullet>
              Curve: <strong className="text-foreground">DAT</strong>
            </Bullet>
            <Bullet>
              Mileage: <strong className="text-foreground">Per year</strong>
            </Bullet>
            <Bullet>
              Representation: <strong className="text-foreground">in % (net)</strong>
            </Bullet>
          </Bullets>
          <p className="mt-3">
            Then, in the table, put the kms in the rows and the months in the columns:
          </p>
          <Bullets nested>
            <Bullet>
              Example: <strong className="text-foreground">20,000 km</strong> and{" "}
              <strong className="text-foreground">36 months</strong> → it gives{" "}
              <strong className="text-foreground">XX</strong> as RV.
            </Bullet>
          </Bullets>
        </Step>

        <Step
          number={7}
          tone="warning"
          last
          title="⚠️ Very important"
        >
          <div
            className="border px-4 py-3"
            style={{ backgroundColor: "#FFFBF1", borderColor: "#F0DFB8", borderRadius: 6 }}
          >
            Always run the query using the{" "}
            <strong className="text-foreground">Dealership purchasing value</strong>. This is the
            price a customer could get by selling the car to a dealer at the end of the contract.
          </div>
        </Step>
      </ol>

      <div aria-live="polite" className="sr-only">
        {copiedId ? `${copiedId} copied to clipboard.` : ""}
      </div>
    </PageShell>
  );
}
