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
  sheet.getRow(1).font = { bold: true };

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
  sheet.getRow(grandTotalRow).font = { bold: true };
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

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(fileBytes);

  if (wb.worksheets.length === 0) throw new Error("Workbook has no worksheets.");

  const wsData = wb.worksheets[0];

  // Hide/unhide columns
  for (const [from, to] of HIDE_RANGES) {
    for (let c = from; c <= to; c++) wsData.getColumn(c).hidden = true;
  }
  for (const [from, to] of UNHIDE_RANGES) {
    for (let c = from; c <= to; c++) wsData.getColumn(c).hidden = false;
  }

  // Autofilter spanning all header columns (last non-empty cell in row 1)
  const lastCol = getLastCol(wsData);
  if (lastCol > 0) {
    wsData.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: lastCol },
    };
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
  wsData.orderNo = 1;
  for (const b of blocks) {
    const sheet = wb.getWorksheet(b.name);
    if (sheet) sheet.orderNo = b.order;
  }

  // Model group separators — thick bottom border where consecutive Model values differ
  const modelCol = findHeader(wsData, "model");
  if (modelCol !== -1) {
    const lastRow = getLastRow(wsData);
    const lastColInSheet = getLastCol(wsData);
    for (let r = 2; r < lastRow; r++) {
      const cur = cellText(wsData.getCell(r, modelCol).value);
      const nxt = cellText(wsData.getCell(r + 1, modelCol).value);
      if (cur !== nxt) {
        for (let c = 1; c <= lastColInSheet; c++) {
          const cell = wsData.getCell(r, c);
          cell.border = { ...(cell.border || {}), bottom: { style: "thick" } };
        }
      }
    }
    for (let c = 1; c <= lastColInSheet; c++) {
      const cell = wsData.getCell(lastRow, c);
      cell.border = { ...(cell.border || {}), bottom: { style: "thick" } };
    }
  }

  const out = await wb.xlsx.writeBuffer();
  return { outputBytes: out as ArrayBuffer };
}
