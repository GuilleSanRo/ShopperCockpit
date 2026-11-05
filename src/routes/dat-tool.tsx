import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { trackEvent } from "@/lib/analytics";
import { DAT_DASHBOARD_URL, DAT_ENTRY_URL } from "@/lib/datLinks";

export const Route = createFileRoute("/dat-tool")({
  head: () => ({
    meta: [
      { title: "DAT TOOL — Shopper Cockpit" },
      {
        name: "description",
<<<<<<< HEAD
        content: "Open DAT Group and My-DAT to search Residual Values (RVs) and Guaranteed Future Values (GFVs):",
=======
        content: "DAT Group and My-DAT links for residual values and guaranteed future values.",
>>>>>>> d732732c924aeacd15e54d414e0d1812dfd04011
      },
      { property: "og:title", content: "DAT TOOL — Shopper Cockpit" },
      {
        property: "og:description",
        content: "DAT Group and My-DAT links for residual values and guaranteed future values.",
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

const headStyle = {
  backgroundColor: "#F7F8FC",
  borderColor: "#E1E4EE",
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

const datLinks = [
  {
    id: "entry",
    name: "DAT Group",
    hint: "Homepage. Opens normally from a click.",
    url: DAT_ENTRY_URL,
    clickable: true,
  },
  {
    id: "dashboard",
    name: "My-DAT dashboard",
    hint: "Copy this one and paste it in a new tab.",
    url: DAT_DASHBOARD_URL,
    clickable: false,
  },
] as const;

function DatTool() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, url: string) => {
    const ok = await copyText(url);
    if (!ok) return;
    setCopiedId(id);
    trackEvent("dat_tool_link_copied", { url });
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
  };

  return (
    <PageShell
      title="DAT TOOL"
      subtitle="Residual values and guaranteed future values — open DAT Group, or copy the My-DAT link."
    >
      <div className="border overflow-hidden" style={panelStyle}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={headStyle}>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Tool
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                URL
              </th>
              <th scope="col" className="px-4 py-3 text-right w-px">
                <span className="sr-only">Copy</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {datLinks.map((item, index) => (
              <tr
                key={item.id}
                className={index > 0 ? "border-t align-top" : "align-top"}
                style={index > 0 ? { borderColor: "#E1E4EE" } : undefined}
              >
                <td className="px-4 py-4 align-top w-52">
                  <span className="font-semibold text-foreground block">{item.name}</span>
                  <span className="mt-1 block text-xs" style={{ color: "var(--text-secondary)" }}>
                    {item.hint}
                  </span>
                </td>
                <td className="px-4 py-4 align-top">
                  {item.clickable ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("dat_tool_entry_opened", { url: item.url })
                      }
                      className="inline-flex items-start gap-1 break-all font-mono text-[13px] hover:underline"
                      style={{ color: "var(--accent-blue)" }}
                    >
                      <span className="select-all break-all">{item.url}</span>
                      <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden />
                    </a>
                  ) : (
                    <span
                      className="block break-all font-mono text-[13px] select-all"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.url}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 align-top text-right w-px whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => copy(item.id, item.url)}
                    aria-label={`Copy ${item.name} URL`}
                    className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium hover:text-[color:var(--accent-blue)] transition-colors"
                    style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5" aria-hidden />
                    ) : (
                      <Copy className="w-3.5 h-3.5" aria-hidden />
                    )}
                    {copiedId === item.id ? "Copied" : "Copy"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        My-DAT refuses link clicks coming from another website and answers with a blank page,
        so paste that URL instead of clicking it.
      </p>

      <div aria-live="polite" className="sr-only">
        {copiedId ? `${copiedId} URL copied to clipboard.` : ""}
      </div>
    </PageShell>
  );
}
