import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, X } from "lucide-react";

interface Props {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
  accept?: string;
}

export function FileDropzone({ file, onFile, disabled, accept = ".xlsx,.xlsm,.xls" }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  const sanitize = (name: string) => name.replace(/[<>]/g, "");

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className="border-2 border-dashed p-8 text-center cursor-pointer transition-colors"
        style={{
          borderColor: dragOver ? "var(--accent-blue)" : "#E1E4EE",
          backgroundColor: dragOver ? "var(--surface-hover)" : "var(--surface)",
          borderRadius: 4,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <UploadCloud
          className="mx-auto mb-3"
          style={{ color: "var(--accent-blue)" }}
          aria-hidden
        />
        <p className="text-sm text-foreground">
          Drag &amp; drop an Excel file here, or <span className="underline">browse</span>
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Accepts .xlsx, .xlsm, .xls · Max 25&nbsp;MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {file && (
        <div
          className="mt-3 flex items-center justify-between border px-4 py-2 text-sm"
          style={{ borderColor: "#E1E4EE", borderRadius: 4, backgroundColor: "#fff" }}
        >
          <div className="truncate">
            <span className="font-medium">{sanitize(file.name)}</span>
            <span className="ml-2" style={{ color: "var(--text-secondary)" }}>
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={() => onFile(null)}
              aria-label="Remove file"
              className="p-1 hover:text-[color:var(--accent-blue)]"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
