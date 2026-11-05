/**
 * Translation of the "Checking COM" VBA macro.
 * Uses ExcelJS. Original bytes are never mutated — we load into a new Workbook.
 */
import ExcelJS from "exceljs";

export interface CheckingComInput {
  /** Raw file bytes. Must originate from an .xlsx or .xlsm file. */
  fileBytes: ArrayBuffer;
  /** Original file name (used to reject legacy .xls input). */
  fileName?: string;
}
export interface CheckingComResult {
  outputBytes: ArrayBuffer;
}

const HIDE_RANGES: Array<[number, number]> = [
  [1, 3],    // A:C
  [5, 13],   // E:M
  [15, 20],  // O:T
  [22, 24],  // V:X
  [29, 31],  // AC:AE
  [37, 43],  // AK:AQ
  [83, 104], // CE:CZ
];
const UNHIDE_RANGES: Array<[number, number]> = [
  [58, 59], // BF:BG
];

/**
 * Deep-clone helper. ExcelJS shares style objects between cells, so a style
 * must never be mutated in place — clone it, change it, assign it back.
 */
const clone = <T>(value: T | null | undefined): T =>
  (value ? JSON.parse(JSON.stringify(value)) : {}) as T;

/** XML-illegal control characters (keeps \t, \n and \r). */
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
const cleanString = (value: string): string => value.replace(CONTROL_CHARS, "");

/** Strips control characters from every string carried by a cell value. */
function cleanValue(value: ExcelJS.CellValue): ExcelJS.CellValue {
  if (typeof value === "string") return cleanString(value);
  if (value && typeof value === "object") {
    if ("richText" in value) {
      const rich = value as ExcelJS.CellRichTextValue;
      return {
        richText: rich.richText.map((run) => ({ ...run, text: cleanString(run.text) })),
      };
    }
    if ("hyperlink" in value) {
      const link = value as ExcelJS.CellHyperlinkValue;
      return { ...link, text: cleanString(link.text) };
    }
    if ("formula" in value || "sharedFormula" in value) {
      const formula = value as ExcelJS.CellFormulaValue;
      return typeof formula.result === "string"
        ? { ...formula, result: cleanString(formula.result) }
        : value;
    }
  }
  return value;
}

function colLetter(col: number): string {
  let s = "";
  let n = col;
  while (n > 0) {
    s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/** Bold applied per cell (never through row.font, which shares style objects). */
function setBold(cell: ExcelJS.Cell): void {
  const style = clone(cell.style);
  style.font = { ...(style.font || {}), bold: true };
  cell.style = style;
}

/**
 * ExcelJS exposes `orderNo` at runtime (it drives the tab order) but it is
 * missing from the published typings, so widen the type explicitly.
 */
type OrderedWorksheet = ExcelJS.Worksheet & { orderNo: number };

function stddev(nums: number[]): number {
  if (nums.length < 2) return 0;
  const m = nums.reduce((a, b) => a + b, 0) / nums.length;
  const v = nums.reduce((s, n) => s + (n - m) ** 2, 0) / (nums.length - 1);
  return Math.sqrt(v);
}
function average(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function cellText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object" && v !== null) {
    if ("text" in v) return String((v as { text: unknown }).text ?? "");
    if ("result" in v) return String((v as { result: unknown }).result ?? "");
    if ("richText" in v)
      return ((v as { richText: Array<{ text: string }> }).richText || [])
        .map((r) => r.text)
        .join("");
  }
  return String(v);
}
function cellNum(v: unknown): number | null {
  const s = cellText(v).trim();
  if (s === "") return null;
  const n = Number(s);
  return isNaN(n) ? null : n;
}

function findHeader(ws: ExcelJS.Worksheet, headerLower: string): number {
  const row = ws.getRow(1);
  const last = ws.columnCount;
  for (let c = 1; c <= last; c++) {
    const t = cellText(row.getCell(c).value).trim().toLowerCase();
    if (t === headerLower) return c;
  }
  return -1;
}

/**
 * Returns the 1-based index of the last column in row 1 that has a non-empty
 * value. Falls back to ws.columnCount when no non-empty header is found.
 */
function getLastCol(ws: ExcelJS.Worksheet): number {
  const row = ws.getRow(1);
  const count = ws.columnCount;
  let last = 0;
  for (let c = 1; c <= count; c++) {
    if (cellText(row.getCell(c).value).trim() !== "") last = c;
  }
  return last > 0 ? last : count;
}

/**
 * Returns the last row index (1-based) whose Model column cell is non-empty.
 * Falls back to column A if the "Model" header is not found, and to
 * ws.actualRowCount as a final fallback.
 */
function getLastRow(ws: ExcelJS.Worksheet): number {
  const modelCol = findHeader(ws, "model");
  const col = modelCol !== -1 ? modelCol : 1;
  const total = ws.actualRowCount;
  for (let r = total; r >= 2; r--) {
    if (cellText(ws.getCell(r, col).value).trim() !== "") return r;
  }
  return total;
}

function buildSummary(
  wb: ExcelJS.Workbook,
  wsData: ExcelJS.Worksheet,
  sheetName: string,
  groupHeader: string,
  valueHeader: string,
  outLabel: string,
  agg: "stdev" | "average",
) {
  const groupCol = findHeader(wsData, groupHeader.toLowerCase());
  const valueCol = findHeader(wsData, valueHeader.toLowerCase());
  const sheet = wb.addWorksheet(sheetName);
  if (groupCol === -1 || valueCol === -1) {
    sheet.getCell(1, 1).value = "Row Labels";
    sheet.getCell(1, 2).value = outLabel;
    sheet.getCell(2, 1).value = `Column not found in data sheet.`;
    return;
  }

  const groups = new Map<string, number[]>();
  const lastRow = getLastRow(wsData);
  for (let r = 2; r <= lastRow; r++) {
    const raw = cellText(wsData.getCell(r, groupCol).value).trim();
    // Empty group key → "(blank)" to match VBA pivot behaviour
    const g = raw === "" ? "(blank)" : raw;
    const n = cellNum(wsData.getCell(r, valueCol).value);
    if (n == null) continue;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(n);
  }

  // A1 = "Row Labels", B1 = aggregation label (matches VBA pivot layout)
  sheet.getCell(1, 1).value = "Row Labels";
  sheet.getCell(1, 2).value = outLabel;
  setBold(sheet.getCell(1, 1));
  setBold(sheet.getCell(1, 2));

  // Sort groups case-insensitively, numeric-aware
  const sortedGroups = [...groups.keys()].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }),
  );

  // Accumulate all values for Grand Total
  const allValues: number[] = [];
  for (const arr of groups.values()) allValues.push(...arr);

  let r = 2;
  for (const g of sortedGroups) {
    const arr = groups.get(g)!;
    sheet.getCell(r, 1).value = g;
    if (agg === "stdev") {
      if (arr.length < 2) {
        sheet.getCell(r, 2).value = { error: "#DIV/0!" } as ExcelJS.CellErrorValue;
      } else {
        sheet.getCell(r, 2).value = stddev(arr);
      }
    } else {
      sheet.getCell(r, 2).value = average(arr);
    }
    r++;
  }

  // 3-color scale on B2:B<last data row> — excludes the Grand Total row
  if (sortedGroups.length > 0) {
    sheet.addConditionalFormatting({
      ref: `B2:B${r - 1}`,
      rules: [
        {
          type: "colorScale",
          priority: 1,
          cfvo: [
            { type: "min" },
            { type: "percentile", value: 50 },
            { type: "max" },
          ],
          color: [
            { argb: "FF63BE7B" }, // green (low)
            { argb: "FFFFEB84" }, // yellow (mid)
            { argb: "FFF8696B" }, // red (high)
          ],
        },
      ],
    });
  }

  // Grand Total row — stdev/average of ALL values across all groups
  const grandTotalRow = r;
  sheet.getCell(grandTotalRow, 1).value = "Grand Total";
  setBold(sheet.getCell(grandTotalRow, 1));
  setBold(sheet.getCell(grandTotalRow, 2));
  if (agg === "stdev") {
    if (allValues.length < 2) {
      sheet.getCell(grandTotalRow, 2).value = { error: "#DIV/0!" } as ExcelJS.CellErrorValue;
    } else {
      sheet.getCell(grandTotalRow, 2).value = stddev(allValues);
    }
  } else {
    sheet.getCell(grandTotalRow, 2).value = average(allValues);
  }

  sheet.getColumn(1).width = 24;
  sheet.getColumn(2).width = 32;
}

/**
 * Copies only the whitelisted content of the source sheet into the clean
 * workbook: cell values, cloned styles, row heights, column widths and hidden
 * state, merged ranges and worksheet views (frozen panes).
 */
function copySheet(src: ExcelJS.Worksheet, dst: ExcelJS.Worksheet): void {
  const columnCount = src.columnCount;
  for (let c = 1; c <= columnCount; c++) {
    const srcCol = src.getColumn(c);
    const dstCol = dst.getColumn(c);
    if (srcCol.width !== undefined) dstCol.width = srcCol.width;
    if (srcCol.hidden) dstCol.hidden = true;
  }

  const rowCount = src.rowCount;
  for (let r = 1; r <= rowCount; r++) {
    const srcRow = src.getRow(r);
    const dstRow = dst.getRow(r);
    const height = srcRow.height as number | undefined;
    if (height !== undefined) dstRow.height = height;
    srcRow.eachCell({ includeEmpty: true }, (srcCell, c) => {
      const dstCell = dstRow.getCell(c);
      dstCell.value = cleanValue(srcCell.value);
      dstCell.style = clone(srcCell.style);
    });
  }

  for (const range of src.model.merges) {
    dst.mergeCells(range);
  }

  dst.views = clone(src.views);
}

export async function processCheckingCom({
  fileBytes,
  fileName,
}: CheckingComInput): Promise<CheckingComResult> {
  // Reject legacy .xls files — ExcelJS only supports OOXML (.xlsx / .xlsm).
  if (fileName) {
    const ext = fileName.toLowerCase().split(".").pop();
    if (ext === "xls") {
      throw new Error(
        "Legacy .xls files are not supported. Please save the file as .xlsx or .xlsm and try again.",
      );
    }
  }

  const source = new ExcelJS.Workbook();
  await source.xlsx.load(fileBytes);

  if (source.worksheets.length === 0) throw new Error("Workbook has no worksheets.");

  const srcSheet = source.worksheets[0];

  // Clean output: build a brand-new workbook and copy only values + whitelisted
  // formatting. Conditional formatting, data validations, comments, defined
  // names, tables and autoFilters from the upload are intentionally dropped.
  const wb = new ExcelJS.Workbook();
  const wsData = wb.addWorksheet(srcSheet.name);
  copySheet(srcSheet, wsData);

  // Autofilter spanning all header columns (last non-empty cell in row 1)
  const lastCol = getLastCol(wsData);
  if (lastCol > 0) {
    wsData.autoFilter = `A1:${colLetter(lastCol)}1`;
  }

  // Hide/unhide columns (hide first, then explicitly reveal BF:BG)
  for (const [from, to] of HIDE_RANGES) {
    for (let c = from; c <= to; c++) wsData.getColumn(c).hidden = true;
  }
  for (const [from, to] of UNHIDE_RANGES) {
    for (let c = from; c <= to; c++) wsData.getColumn(c).hidden = false;
  }

  // Build summary "pivot" sheets.
  // Desired final tab order: Data, PivotModelMileage, PivotModelMonths,
  //   PivotBalloonMP, PivotLeasingMP, PivotEqTransPrice, PivotAnDSC.
  // We add them in that order then assign orderNo to match (Data sheet = 1).
  const blocks: Array<{
    name: string;
    group: string;
    value: string;
    label: string;
    agg: "stdev" | "average";
    order: number; // 1-based position; Data sheet = 1
  }> = [
    {
      name: "PivotModelMileage",
      group: "Model",
      value: "Balloon Finance (BF): Duration (km)",
      label: "Average of Balloon Finance (BF): Duration (km)",
      agg: "average",
      order: 2,
    },
    {
      name: "PivotModelMonths",
      group: "Model",
      value: "Balloon Finance (BF): Duration (Months)",
      label: "StandardDev of Balloon Finance (BF): Duration (Months)",
      agg: "stdev",
      order: 3,
    },
    {
      name: "PivotBalloonMP",
      group: "model",
      value: "Balloon Finance (BF): MP Equalized",
      label: "StandardDev of Balloon Finance (BF): MP Equalized",
      agg: "stdev",
      order: 4,
    },
    {
      name: "PivotLeasingMP",
      group: "model",
      value: "Leasing (LS): Monthly Payment (MP) incl. costs/services (MP1)",
      label:
        "StandardDev of Leasing (LS): Monthly Payment (MP) incl. costs/services (MP1)",
      agg: "stdev",
      order: 5,
    },
    {
      name: "PivotEqTransPrice",
      group: "model",
      value: "Equalized Transactional Price",
      label: "StandardDev of Equalized Transactional Price",
      agg: "stdev",
      order: 6,
    },
    {
      name: "PivotAnDSC",
      group: "model",
      value: "Announced DSC",
      label: "StandardDev of Announced DSC",
      agg: "stdev",
      order: 7,
    },
  ];
  for (const b of blocks) {
    buildSummary(wb, wsData, b.name, b.group, b.value, b.label, b.agg);
  }

  // Fix tab order: Data = 1, summary sheets follow in declared order.
  (wsData as OrderedWorksheet).orderNo = 1;
  for (const b of blocks) {
    const sheet = wb.getWorksheet(b.name);
    if (sheet) (sheet as OrderedWorksheet).orderNo = b.order;
  }

  // Model group separators — thick bottom border where consecutive Model values
  // differ, plus the last data row. Styles are cloned per cell because ExcelJS
  // shares style objects between cells.
  const modelCol = findHeader(wsData, "model");
  if (modelCol !== -1) {
    const lastRow = getLastRow(wsData);
    const lastColInSheet = getLastCol(wsData);
    for (let r = 2; r <= lastRow; r++) {
      if (r < lastRow) {
        const cur = cellText(wsData.getCell(r, modelCol).value);
        const nxt = cellText(wsData.getCell(r + 1, modelCol).value);
        if (cur === nxt) continue;
      }
      for (let c = 1; c <= lastColInSheet; c++) {
        const cell = wsData.getCell(r, c);
        const s = clone(cell.style);
        s.border = { ...(s.border || {}), bottom: { style: "thick" } };
        cell.style = s;
      }
    }
  }

  const out = await wb.xlsx.writeBuffer();
  return { outputBytes: out as ArrayBuffer };
}
