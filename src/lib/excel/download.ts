export function downloadBlob(bytes: ArrayBuffer, filename: string) {
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function stripExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.substring(0, i) : name;
}

export function validateExcelFile(file: File): string | null {
  const ext = file.name.toLowerCase().split(".").pop();
  if (!ext || !["xlsx", "xlsm"].includes(ext)) {
    return "File must be .xlsx or .xlsm. Legacy .xls files are not supported.";
  }
  if (file.size > 25 * 1024 * 1024) return "File exceeds 25 MB.";
  return null;
}
