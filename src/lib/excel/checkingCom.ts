/**
 * Translation of the "Checking COM" VBA macro.
 * Uses ExcelJS. Original bytes are never mutated — we load into a new Workbook.
 */
import ExcelJS from "exceljs";

export interface CheckingComInput {
  fileBytes: ArrayBuffer;
}
export interface CheckingComResult {
  outputBytes: ArrayBuffer;
}

const HIDE_RANGES: Array<[number, number]> = [
  [1, 3], // A:C
  [5, 13], // E:M
  [15, 20], // O:T
  [22, 24], // V:X
  [29, 31], // AC:AE
  [37, 43], // AK:AQ
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
    sheet.getCell(1, 1).value = groupHeader;
    sheet.getCell(1, 2).value = outLabel;
    sheet.getCell(2, 1).value = `Column not found in data sheet.`;
    return;
  }

  const groups = new Map<string, number[]>();
  const lastRow = wsData.actualRowCount;
  for (let r = 2; r <= lastRow; r++) {
    const g = cellText(wsData.getCell(r, groupCol).value).trim();
    if (!g) continue;
    const n = cellNum(wsData.getCell(r, valueCol).value);
    if (n == null) continue;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(n);
  }

  sheet.getCell(1, 1).value = groupHeader;
  sheet.getCell(1, 2).value = outLabel;
  sheet.getRow(1).font = { bold: true };

  const rows: Array<{ group: string; val: number }> = [];
  for (const [g, arr] of groups) {
    rows.push({ group: g, val: agg === "stdev" ? stddev(arr) : average(arr) });
  }
  rows.sort((a, b) => a.group.localeCompare(b.group));
  let r = 2;
  for (const { group, val } of rows) {
    sheet.getCell(r, 1).value = group;
    sheet.getCell(r, 2).value = val;
    r++;
  }

  // 3-color scale conditional formatting on the value column
  if (rows.length > 0) {
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

  sheet.getColumn(1).width = 24;
  sheet.getColumn(2).width = 32;
}

export async function processCheckingCom({
  fileBytes,
}: CheckingComInput): Promise<CheckingComResult> {
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

  // Add autofilter on first row
  const lastCol = wsData.columnCount;
  if (lastCol > 0) {
    wsData.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: lastCol },
    };
  }

  // Build summary "pivot" sheets
  const blocks: Array<{
    name: string;
    group: string;
    value: string;
    label: string;
    agg: "stdev" | "average";
  }> = [
    {
      name: "PivotAnDSC",
      group: "model",
      value: "Announced DSC",
      label: "StandardDev of Announced DSC",
      agg: "stdev",
    },
    {
      name: "PivotEqTransPrice",
      group: "model",
      value: "Equalized Transactional Price",
      label: "StandardDev of Equalized Transactional Price",
      agg: "stdev",
    },
    {
      name: "PivotLeasingMP",
      group: "model",
      value: "Leasing (LS): Monthly Payment (MP) incl. costs/services (MP1)",
      label:
        "StandardDev of Leasing (LS): Monthly Payment (MP) incl. costs/services (MP1)",
      agg: "stdev",
    },
    {
      name: "PivotBalloonMP",
      group: "model",
      value: "Balloon Finance (BF): MP Equalized",
      label: "StandardDev of Balloon Finance (BF): MP Equalized",
      agg: "stdev",
    },
    {
      name: "PivotModelMonths",
      group: "Model",
      value: "Balloon Finance (BF): Duration (Months)",
      label: "StandardDev of Balloon Finance (BF): Duration (Months)",
      agg: "stdev",
    },
    {
      name: "PivotModelMileage",
      group: "Model",
      value: "Balloon Finance (BF): Duration (km)",
      label: "Average of Balloon Finance (BF): Duration (km)",
      agg: "average",
    },
  ];
  for (const b of blocks) {
    buildSummary(wb, wsData, b.name, b.group, b.value, b.label, b.agg);
  }

  // Model group separators — thick bottom border where consecutive Model values differ
  const modelCol = findHeader(wsData, "model");
  if (modelCol !== -1) {
    const lastRow = wsData.actualRowCount;
    const lastColInSheet = wsData.columnCount;
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

  // Deposit columns
  const insertDepositCheck = (depositHeader: string, pct: number, calcLabel: string, gapLabel: string) => {
    const depositCol = findHeader(wsData, depositHeader.toLowerCase());
    if (depositCol === -1) return;
    // Insert 2 columns after depositCol
    wsData.spliceColumns(depositCol + 1, 0, [], []);
    const newCol1 = depositCol + 1;
    const newCol2 = depositCol + 2;
    wsData.getCell(1, newCol1).value = calcLabel;
    wsData.getCell(1, newCol2).value = gapLabel;
    const msrpCol = findHeader(wsData, "msrp");
    if (msrpCol === -1) return;
    const lastRow = wsData.actualRowCount;
    for (let r = 2; r <= lastRow; r++) {
      const msrp = cellNum(wsData.getCell(r, msrpCol).value);
      const dep = cellNum(wsData.getCell(r, depositCol).value);
      if (msrp != null) {
        const calc = msrp * pct;
        wsData.getCell(r, newCol1).value = calc;
        if (dep != null) wsData.getCell(r, newCol2).value = dep - calc;
      }
    }
  };

  insertDepositCheck(
    "Balloon Finance (BF): Deposit",
    0.3,
    "30% of MSRP calculated",
    "GAP between deposit (obtained) and 30% of MSRP (requested)",
  );
  insertDepositCheck(
    "Classic Credit (CC): Deposit",
    0.25,
    "25% of MSRP calculated",
    "GAP between deposit (obtained) and 25% of MSRP (requested)",
  );

  const out = await wb.xlsx.writeBuffer();
  return { outputBytes: out as ArrayBuffer };
}
