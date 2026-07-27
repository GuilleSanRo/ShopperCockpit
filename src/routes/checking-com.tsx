import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FileDropzone } from "@/components/FileDropzone";
import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { processCheckingCom } from "@/lib/excel/checkingCom";
import { downloadBlob, stripExt, validateExcelFile } from "@/lib/excel/download";

export const Route = createFileRoute("/checking-com")({
  head: () => ({
    meta: [
      { title: "Checking COM — Shopper Cockpit" },
      {
        name: "description",
        content: "Upload a Checking COM Excel file and download the enhanced version.",
      },
      { property: "og:title", content: "Checking COM — Shopper Cockpit" },
      {
        property: "og:description",
        content: "Upload a Checking COM Excel file and download the enhanced version.",
      },
    ],
  }),
  component: CheckingCom,
});

type Status = "idle" | "processing" | "success" | "error";

function CheckingCom() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [output, setOutput] = useState<{ bytes: ArrayBuffer; filename: string } | null>(null);

  const busy = status === "processing";

  const clear = () => {
    setFile(null);
    setStatus("idle");
    setError("");
    setOutput(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOutput(null);
    if (!file) return setError("Please select a file.");
    const v = validateExcelFile(file);
    if (v) return setError(v);

    setStatus("processing");
    trackEvent("checking_com_processing_started", { fileName: file.name });
    try {
      const bytes = await file.arrayBuffer();
      const copy = bytes.slice(0);
      const { outputBytes } = await processCheckingCom({ fileBytes: copy });
      const filename = `Checking_COM_processed_${stripExt(file.name)}.xlsx`;
      setOutput({ bytes: outputBytes, filename });
      setStatus("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error while processing.";
      setError(msg);
      setStatus("error");
    }
  };

  return (
    <PageShell
      title="Checking COM"
      subtitle="Upload a Checking COM Excel file and download the enhanced version."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Checking COM file</label>
          <FileDropzone file={file} onFile={setFile} disabled={busy} />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            {busy ? "Applying workbook transformations…" : "Apply Checking COM Macro"}
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
                Checking COM processed successfully.
              </div>
              <button
                type="button"
                onClick={() => downloadBlob(output.bytes, output.filename)}
                className="px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
              >
                Download processed Checking COM
              </button>
            </div>
          )}
          {(status === "error" || (status === "idle" && error)) && (
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
