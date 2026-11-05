import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, ExternalLink, Info } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { trackEvent } from "@/lib/analytics";
import { DAT_DASHBOARD_URL, DAT_ENTRY_URL } from "@/lib/datLinks";

export const Route = createFileRoute("/dat-tool")({
  head: () => ({
    meta: [
      { title: "DAT Tool — Shopper Cockpit" },
      {
        name: "description",
        content: "Open DAT Group and My-DAT to search Residual Values (RVs) and Guaranteed Future Values (GFVs):",
      },
      { property: "og:title", content: "DAT Tool — Shopper Cockpit" },
      {
        property: "og:description",
        content: "Open DAT Group and My-DAT to search residual values and guaranteed future values.",
      },
    ],
  }),
  component: DatTool,
});

const panelStyle = {
  backgroundColor: "var(--surface)",
  borderColor: "#E1E4EE",
  borderRadius: 4,
} as const;

const primaryButtonStyle = {
  backgroundColor: "var(--accent-blue)",
  borderRadius: 4,
} as const;

const secondaryButtonStyle = {
  borderColor: "#E1E4EE",
  borderRadius: 4,
} as const;

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

function DatTool() {
  const [copied, setCopied] = useState(false);

  const openEntryPage = () => {
    trackEvent("dat_tool_entry_opened", { url: DAT_ENTRY_URL });
  };

  const openDashboard = () => {
    trackEvent("dat_tool_dashboard_opened", { url: DAT_DASHBOARD_URL });
  };

  const copyDashboardUrl = async () => {
    const ok = await copyText(DAT_DASHBOARD_URL);
    if (!ok) return;
    setCopied(true);
    trackEvent("dat_tool_link_copied", { url: DAT_DASHBOARD_URL });
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell
      title="DAT Tool"
      subtitle="Access DAT Group to search residual values and guaranteed future values."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="border p-6" style={panelStyle}>
          <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">
            1. Open DAT Group
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Opens the DAT Group entry page in a new tab. From there, use the user menu
            (&ldquo;Área privada&rdquo;) to sign in and reach My-DAT. Navigating inside
            datgroup.com is allowed, so the private area loads normally.
          </p>
          <a
            href={DAT_ENTRY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openEntryPage}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={primaryButtonStyle}
          >
            Open DAT Group
            <ExternalLink className="w-4 h-4" aria-hidden />
          </a>
        </section>

        <section className="border p-6" style={panelStyle}>
          <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">
            2. Direct My-DAT dashboard link
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Copy this link and paste it in a new browser tab&rsquo;s address bar (or save it
            as a bookmark). A pasted URL is opened as a direct navigation, which DAT allows.
          </p>

          <label htmlFor="dat-dashboard-url" className="sr-only">
            My-DAT dashboard URL
          </label>
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <input
              id="dat-dashboard-url"
              type="text"
              readOnly
              value={DAT_DASHBOARD_URL}
              onFocus={(e) => e.currentTarget.select()}
              spellCheck={false}
              className="flex-1 min-w-0 border bg-white px-3 py-2 text-sm"
              style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
            />
            <button
              type="button"
              onClick={copyDashboardUrl}
              aria-label="Copy My-DAT dashboard link"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={primaryButtonStyle}
            >
              {copied ? (
                <Check className="w-4 h-4" aria-hidden />
              ) : (
                <Copy className="w-4 h-4" aria-hidden />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <a
            href={DAT_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openDashboard}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border hover:text-[color:var(--accent-blue)] transition-colors"
            style={secondaryButtonStyle}
          >
            Open direct link
            <ExternalLink className="w-4 h-4" aria-hidden />
          </a>

          <p
            className="mt-4 flex items-start gap-2 text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <Info className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
            <span>
              DAT blocks this exact URL when it is reached from a link click on another
              website, and answers with a blank &ldquo;ccc&rdquo; page. That is why the entry
              page above is the recommended route; use Copy to paste the link instead of
              clicking it.
            </span>
          </p>
        </section>
      </div>

      <div aria-live="polite" className="sr-only">
        {copied ? "My-DAT dashboard link copied to clipboard." : ""}
      </div>
    </PageShell>
  );
}
