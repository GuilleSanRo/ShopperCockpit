import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { useMemo, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { processMacroToLocation } from "@/lib/excel/macroToLocation";
import { downloadBlob, stripExt, validateExcelFile } from "@/lib/excel/download";

export const Route = createFileRoute("/macro-to-location")({
  head: () => ({
    meta: [
      { title: "Macro to Location — Shopper Cockpit" },
      {
        name: "description",
        content: "Upload a Matrix Excel file and download the generated Location file.",
      },
      { property: "og:title", content: "Macro to Location — Shopper Cockpit" },
      {
        property: "og:description",
        content: "Upload a Matrix Excel file and download the generated Location file.",
      },
    ],
  }),
  component: MacroToLocation;
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function defaults() {
  const now = new Date();
  const day = now.getDate();
  let m = now.getMonth() + 1;
  if (day > 25) m = m === 12 ? 1 : m + 1;
  const y = now.getFullYear();
  const year = y >= 2026 && y <= 2036 ? y : 2026;
  return { month: String(m).padStart(2, "0"), year: String(year) };
}

type Status = "idle" | "processing" | "success" | "error";

function MacroToLocation() {
  const defs = useMemo(defaults, []);
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState(defs.month);
  const [year, setYear] = useState(defs.year);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [output, setOutput] = useState<{ bytes: ArrayBuffer; filename: string } | null>(null);

  const busy = status === "processing";

  const clear = () => {
    setFile(null);
    setStatus("idle");
    setError("");
    setOutput(null);
    const d = defaults();
    setMonth(d.month);
    setYear(d.year);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOutput(null);
    if (!file) return setError("Please select a file.");
    const v = validateExcelFile(file);
    if (v) return setError(v);
    if (!month) return setError("Month is required.");
    if (!year) return setError("Year is required.");

    setStatus("processing");
    trackEvent("macro_processing_started", { fileName: file.name });
    try {
      const bytes = await file.arrayBuffer();
      // Work on a copy so original ArrayBuffer is untouched.
      const copy = bytes.slice(0);
      const { outputBytes } = await processMacroToLocation({
        fileBytes: copy,
        month,
        year,
      });
      const filename = `Location_${stripExt(file.name)}_${month}.xlsx`;
      setOutput({ bytes: outputBytes, filename });
      setStatus("success");
      trackEvent("macro_processing_success", { fileName: file.name });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error while processing.";
      setError(msg);
      setStatus("error");
      trackEvent("macro_processing_error", { message: msg });
    }
  };

  return (
    <PageShell
      title="Macro to Location"
      subtitle="Upload a Matrix Excel file, choose month and year, then download the generated Location file."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Matrix file</label>
          <FileDropzone
            file={file}
            onFile={(f) => {
              setFile(f);
              if (f) trackEvent("macro_file_selected", { name: f.name, size: f.size });
            }}
            disabled={busy}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium mb-2">Month</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              disabled={busy}
              className="w-full border bg-white px-3 py-2 text-sm"
              style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
            >
              {MONTHS.map((n, i) => {
                const mm = String(i + 1).padStart(2, "0");
                return (
                  <option key={mm} value={mm}>
                    {mm} {n}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium mb-2">Year</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              disabled={busy}
              className="w-full border bg-white px-3 py-2 text-sm"
              style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
            >
              {Array.from({ length: 11 }, (_, i) => 2026 + i).map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            {busy ? "Processing workbook…" : "Generate Location File"}
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium border"
            style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
          >
            Clear
          </button>
        </div>

        <div aria-live="polite">
          {status === "success" && output && (
            <div
              className="flex items-center justify-between border p-4 bg-white"
              style={{ borderColor: "var(--accent-blue)", borderRadius: 4 }}
            >
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5" style={{ color: "var(--accent-blue)" }} aria-hidden />
                Location file generated successfully.
              </div>
              <button
                type="button"
                onClick={() => downloadBlob(output.bytes, output.filename)}
                className="px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
              >
                Download Location file
              </button>
            </div>
          )}
          {status === "error" && (
            <div
              className="flex items-start gap-2 border p-4 text-sm"
              style={{
                borderColor: "var(--destructive)",
                borderRadius: 4,
                backgroundColor: "#FEF2F2",
                color: "var(--destructive)",
              }}
            >
              <AlertCircle className="w-5 h-5 mt-0.5" aria-hidden />
              <span>{error}</span>
            </div>
          )}
          {status === "idle" && error && (
            <div
              className="flex items-start gap-2 border p-4 text-sm"
              style={{
                borderColor: "var(--destructive)",
                borderRadius: 4,
                backgroundColor: "#FEF2F2",
                color: "var(--destructive)",
              }}
            >
              <AlertCircle className="w-5 h-5 mt-0.5" aria-hidden />
              <span>{error}</span>
            </div>
          )}
        </div>
      </form>
    </PageShell>
  );
}
