/**
 * Translation of the "Matrix to Location" VBA macro.
 * Uses ExcelJS end-to-end. Original uploaded file bytes are never mutated —
 * we load into a fresh Workbook and return new bytes.
 */
import ExcelJS from "exceljs";

const EUROPE = ["GER", "SPA", "FRA", "GB ", "ITA", "CAN", "NET", "AUS", "BEL", "SWI", "NOR", "POL"];
const OVERSEAS = ["IVO", "EGY", "TUN", "SAF", "REU", "MOR", "KSA", "ISR", "KUW", "UAE"];

export interface MacroToLocationInput {
  fileBytes: ArrayBuffer;
  month: string; // "01".."12"
  year: string; // "2026".."2036"
}

export interface MacroToLocationResult {
  outputBytes: ArrayBuffer;
}

// ── Req 0: deep-clone helper ──────────────────────────────────────────────────
// ExcelJS shares style objects between cells; shallow copies cause wrong formats.
const clone = (o: unknown) => (o ? JSON.parse(JSON.stringify(o)) : undefined);

// ── Utilities ─────────────────────────────────────────────────────────────────
const colLetter = (n: number): string => {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

/** Strip XML-illegal control chars (keeps \t \n \r) */
const sanitizeString = (s: string): string =>
  s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");

function getCellText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object" && v !== null && "text" in (v as Record<string, unknown>)) {
    return sanitizeString(String((v as { text: unknown }).text ?? ""));
  }
  if (typeof v === "object" && v !== null && "result" in (v as Record<string, unknown>)) {
    return sanitizeString(String((v as { result: unknown }).result ?? ""));
  }
  if (typeof v === "string") return sanitizeString(v);
  return String(v);
}

function getCellNumber(v: unknown): number {
  const s = getCellText(v).trim();
  if (s === "") return 0;
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}

// ── Req 5: snapshot / restore with deep-cloned styles ────────────────────────
interface CellSnapshot {
  col: number;
  value: ExcelJS.CellValue;
  style?: unknown; // stored as plain JSON
}

interface RowSnapshot {
  cells: CellSnapshot[];
  height?: number;
}

function snapshotRow(ws: ExcelJS.Worksheet, r: number, maxCol: number): RowSnapshot {
  const row = ws.getRow(r);
  const cells: CellSnapshot[] = [];
  for (let c = 1; c <= maxCol; c++) {
    const cell = row.getCell(c);
    cells.push({
      col: c,
      value: cell.value,
      style: clone(cell.style), // deep clone — always stored
    });
  }
  return { cells, height: row.height };
}

function restoreRow(ws: ExcelJS.Worksheet, r: number, snap: RowSnapshot) {
  const row = ws.getRow(r);
  if (snap.height !== undefined) row.height = snap.height;
  for (const c of snap.cells) {
    const cell = row.getCell(c.col);
    cell.value = c.value;
    // Req 5: always restore style (even if seemingly empty) so formatting moves with the row
    if (c.style !== undefined) {
      cell.style = c.style as ExcelJS.Style;
    }
  }
}

function getRowCellValue(row: RowSnapshot, colNumber: number): unknown {
  return row.cells.find((c) => c.col === colNumber)?.value;
}

function compareCellValues(a: unknown, b: unknown): number {
  const sa = getCellText(a).trim();
  const sb = getCellText(b).trim();
  if (sa === "" && sb === "") return 0;
  if (sa === "") return 1;
  if (sb === "") return -1;

  const na = Number(sa);
  const nb = Number(sb);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: "base" });
}

// ── Req 1: clean output workbook ──────────────────────────────────────────────
async function buildCleanWorkbook(
  ws: ExcelJS.Worksheet,
  sheetName: string,
): Promise<ExcelJS.Buffer> {
  const outWb = new ExcelJS.Workbook();
  const outWs = outWb.addWorksheet(sheetName);

  // Copy column widths
  const srcColCount = ws.columnCount;
  for (let c = 1; c <= srcColCount; c++) {
    const srcCol = ws.getColumn(c);
    const dstCol = outWs.getColumn(c);
    if (srcCol.width !== undefined) dstCol.width = srcCol.width;
  }

  // Copy frozen panes / views
  if (ws.views && ws.views.length > 0) {
    outWs.views = clone(ws.views) as ExcelJS.WorksheetView[];
  }

  // Copy every row: value + style + height
  const rowCount = ws.rowCount;
  for (let r = 1; r <= rowCount; r++) {
    const srcRow = ws.getRow(r);
    const dstRow = outWs.getRow(r);

    if (srcRow.height !== undefined) dstRow.height = srcRow.height;

    for (let c = 1; c <= srcColCount; c++) {
      const srcCell = srcRow.getCell(c);
      const dstCell = dstRow.getCell(c);

      // Copy value — hyperlinks as {text, hyperlink}
      let val = srcCell.value;
      if (
        val !== null &&
        val !== undefined &&
        typeof val === "object" &&
        "hyperlink" in (val as Record<string, unknown>)
      ) {
        const hv = val as { text?: unknown; hyperlink?: unknown };
        dstCell.value = {
          text: String(hv.text ?? ""),
          hyperlink: String(hv.hyperlink ?? ""),
        } as ExcelJS.CellHyperlinkValue;
      } else {
        if (typeof val === "string") val = sanitizeString(val) as ExcelJS.CellValue;
        dstCell.value = val;
      }

      // Deep-clone style
      if (srcCell.style) {
        dstCell.style = clone(srcCell.style) as ExcelJS.Style;
      }
    }

    dstRow.commit();
  }

  return outWb.xlsx.writeBuffer();
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function processMacroToLocation({
  fileBytes,
  month,
  year,
}: MacroToLocationInput): Promise<MacroToLocationResult> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(fileBytes);

  if (wb.worksheets.length === 0) {
    throw new Error("Workbook has no worksheets.");
  }

  // Req 0: always use worksheets[0]
  const ws = wb.worksheets[0];
  const sheetName = ws.name;

  // Flatten formula cells to static values
  ws.eachRow((row) => {
    row.eachCell((cell) => {
      if (cell.type === ExcelJS.ValueType.Formula) {
        const val = cell.value as { result?: unknown };
        cell.value = val?.result !== undefined && val.result !== null
          ? (val.result as ExcelJS.CellValue)
          : null;
      }
    });
  });

  const yy = year.slice(-2);
  const mesRaw = month.replace(/^0+/, "") || "0"; // "1".."12"
  const mesForm = ["10", "11", "12"].includes(month) ? month : mesRaw;

  // ── Req 2: filter by month, loop from ws.rowCount down ───────────────────
  const lastRow = ws.rowCount; // not actualRowCount
  for (let r = lastRow; r >= 2; r--) {
    const val = ws.getCell(r, 8).value;
    if (val == null || val === "") {
      ws.spliceRows(r, 1);
      continue;
    }
    let s = getCellText(val);
    if (!["10", "11", "12"].includes(s)) s = s.replace(/0/g, "");
    if (s !== mesForm) ws.spliceRows(r, 1);
  }

  // Delete rows below the last non-empty cell in column B
  {
    let lastBRow = 1;
    for (let r = 2; r <= ws.rowCount; r++) {
      const bVal = getCellText(ws.getCell(r, 2).value);
      if (bVal !== "") lastBRow = r;
    }
    const totalRows = ws.rowCount;
    if (totalRows > lastBRow) {
      ws.spliceRows(lastBRow + 1, totalRows - lastBRow);
    }
  }

  // Check any rows remain
  let dataRows = 0;
  ws.eachRow((_row, idx) => { if (idx > 1) dataRows++; });
  if (dataRows === 0) {
    throw new Error(`No data found for the selected month (${month}).`);
  }

  const paisCompleto = getCellText(ws.getCell(2, 10).value);

  // ── Insert LOCATION column at 89 ─────────────────────────────────────────
  const ubiIni = 89;
  ws.spliceColumns(ubiIni, 0, []);
  ws.getCell(1, ubiIni).value = "LOCATION";

  const paisRaw = paisCompleto.toUpperCase().includes("ISLAND")
    ? paisCompleto.substring(0, 3) + "C"
    : paisCompleto.substring(0, 3);

  // col 90 is now "THEORETICAL NUMBER OF VISITS"
  const ubiVisits = ubiIni + 1; // 90
  const theoreticalHeader = getCellText(ws.getCell(1, ubiVisits).value).toUpperCase();
  if (!theoreticalHeader.includes("THEORETICAL NUMBER OF VISITS")) {
    throw new Error(
      "The file doesn't have the correct format. The column with the Total visits must be 'CK' column.",
    );
  }

  // ── Req 4: LOCATION column (89) style = clone of col 90 style; width = col 90 width ──
  {
    const col90Width = ws.getColumn(90).width;
    if (col90Width !== undefined) ws.getColumn(ubiIni).width = col90Width;
  }

  // ── Req 3: duplicate rows with full style copy ────────────────────────────
  let x = 2;
  while (getCellText(ws.getCell(x, 2).value) !== "") {
    const repeticiones = getCellNumber(ws.getCell(x, ubiVisits).value);
    if (repeticiones === 0) {
      ws.spliceRows(x, 1);
      continue;
    }

    // Snapshot source row (value + deep-cloned style + height)
    const maxSnapCol = ws.columnCount;
    const srcSnap = snapshotRow(ws, x, maxSnapCol);

    // Insert (repeticiones - 1) duplicates below
    for (let i = 1; i < repeticiones; i++) {
      ws.spliceRows(x + i, 0, []);
      restoreRow(ws, x + i, srcSnap); // exact copy: value + clone(style) + height
    }

    // Req 4: for every row in this group, copy style from col 90 of that row
    for (let i = 0; i < repeticiones; i++) {
      const col90Style = clone(ws.getRow(x + i).getCell(90).style);
      if (col90Style) ws.getRow(x + i).getCell(ubiIni).style = col90Style;
    }

    // Fill LOCATION column
    let fila = x;
    let placed = 0;
    for (let i = 1; i <= 20; i++) {
      const cellV = ws.getCell(x, ubiVisits + i).value;
      const cellStr = getCellText(cellV);
      if (cellStr === "") continue;
      const num = Number(cellStr);
      if (isNaN(num)) continue;
      let count = num;
      while (count > 0) {
        const ciudad = i < 10 ? `0${i}` : `${i}`; // Req 6: stays text
        ws.getCell(fila, ubiIni).value = ciudad;
        // BEL special rule
        if (paisRaw === "BEL" && ciudad === "01") {
          const col25 = getCellText(ws.getCell(fila, 25).value);
          const col32 = getCellNumber(ws.getCell(fila, 32).value);
          if (col25 === "Electric" && col32 < 40000) {
            ws.getCell(fila, 70).value = 5000;
          }
        }
        fila++;
        placed++;
        count--;
      }
    }

    if (placed !== repeticiones) {
      throw new Error(
        "The total number of visits is different than the sum of visits introduced in region columns. Please check the number of visits.",
      );
    }

    x = x + repeticiones;
  }

  // Delete columns CM (91) onwards
  const currentColCount = ws.columnCount;
  if (currentColCount >= 91) {
    ws.spliceColumns(91, currentColCount - 90);
  }

  // Client type trimming: only first 3 per model retain #04L#/#05L#/#06L#
  let modelOld = getCellText(ws.getCell(2, 2).value);
  let cont04L = 0, cont05L = 0, cont06L = 0;
  let i = 2;
  while (getCellText(ws.getCell(i, 2).value) !== "") {
    const modelNew = getCellText(ws.getCell(i, 2).value);
    if (modelNew !== modelOld) {
      cont04L = 0; cont05L = 0; cont06L = 0;
      modelOld = modelNew;
    }
    let clienttype = getCellText(ws.getCell(i, 57).value);
    const marker = clienttype.replace(/#/g, "@");
    if (marker.includes("@04L@")) { cont04L++; if (cont04L > 3) clienttype = clienttype.replace("#04L#", "#"); }
    if (marker.includes("@05L@")) { cont05L++; if (cont05L > 3) clienttype = clienttype.replace("#05L#", "#"); }
    if (marker.includes("@06L@")) { cont06L++; if (cont06L > 3) clienttype = clienttype.replace("#06L#", "#"); }
    ws.getCell(i, 57).value = clienttype;
    i++;
  }

  // Delete column CL (90) — "THEORETICAL NUMBER OF VISITS"
  ws.spliceColumns(90, 1);

  // Determine country classification
  const paisAfter = paisCompleto.toUpperCase().includes("ISLAND")
    ? paisCompleto.substring(0, 3) + "C"
    : paisCompleto.substring(0, 3);
  const esEuropeo = EUROPE.includes(paisAfter);
  let esOverseas = OVERSEAS.includes(paisAfter);
  if (!esOverseas && !esEuropeo) esOverseas = true;

  // ── Req 6: Assign IDs — column A as Number ────────────────────────────────
  // After spliceColumns(90,1) LOCATION is still at col 89 (= ubiIni).
  let contador = 1;
  x = 2;
  while (getCellText(ws.getCell(x, ubiIni).value) !== "") {
    const mm = month;
    // e.g. 2609001 as a Number
    ws.getCell(x, 1).value = Number(`${yy}${mm}${String(contador).padStart(3, "0")}`);
    x++;
    contador++;
  }

  const LCV_COUNTRIES = new Set([
    "NETHERLANDS (EUR) - LCV",
    "BELGIUM (EUR) - LCV",
    "FRANCE (EUR) - LCV",
    "ITALY (EUR) - LCV",
  ]);
  const isLcv = LCV_COUNTRIES.has(paisCompleto);

  if (esOverseas || isLcv) {
    const maxCol = Math.max(ws.columnCount, 89);
    let lastDataRow = 2;
    while (getCellText(ws.getCell(lastDataRow, ubiIni).value) !== "") {
      lastDataRow++;
    }
    const totalDataRows = lastDataRow - 2;

    // 1. Initial sort by LOCATION (col 89) ascending
    if (totalDataRows > 1) {
      const rows: RowSnapshot[] = [];
      for (let r = 2; r < lastDataRow; r++) rows.push(snapshotRow(ws, r, maxCol));
      rows.sort((r1, r2) =>
        compareCellValues(getRowCellValue(r1, ubiIni), getRowCellValue(r2, ubiIni))
      );
      for (let idx = 0; idx < rows.length; idx++) restoreRow(ws, idx + 2, rows[idx]);
    }

    // 2. Fill BQ (69), BS (71), BT (72), UAE price update
    // ── Req 7: declare prefijo once before the row loop ──────────────────────
    let prefijo = "";
    x = 2;
    while (getCellText(ws.getCell(x, ubiIni).value) !== "") {
      if (esOverseas) {
        // Req 6: BQ (69) = raw value of A (or previous BQ), not String
        if (getCellText(ws.getCell(x, 88).value) !== "") {
          // raw value of column A (already a Number)
          ws.getCell(x, 69).value = ws.getCell(x, 1).value;
        } else {
          // carry forward previous BQ raw value
          ws.getCell(x, 69).value = ws.getCell(x - 1, 69).value;
        }
      } else if (isLcv) {
        if (getCellText(ws.getCell(x, 84).value) !== "") {
          ws.getCell(x, 69).value = ws.getCell(x, 1).value;
        } else {
          ws.getCell(x, 69).value = ws.getCell(x - 1, 69).value;
        }
      }

      if (esOverseas) {
        const ckVal = getCellText(ws.getCell(x, 89).value);
        // BQ val: read the raw numeric value we just stored
        const bqRaw = ws.getCell(x, 69).value; // Number | null
        const bqVal = getCellText(bqRaw); // string for BS concatenation

        // Req 7: prefijo declared before loop; only reset when there IS a rule for this region
        if (paisAfter === "KSA") {
          if (ckVal === "01") prefijo = "JD";
          else if (ckVal === "02") prefijo = "RD";
          else if (ckVal === "03") prefijo = "DM";
          // else: keep previous prefix (as in VBA)
          ws.getCell(x, 71).value = prefijo + bqVal; // BS stays text
        } else if (paisAfter === "UAE") {
          if (ckVal === "01") prefijo = "DB";
          else if (ckVal === "02") prefijo = "AD";
          // else: keep previous prefix
          ws.getCell(x, 71).value = prefijo + bqVal; // BS stays text
        } else if (paisAfter === "KUW") {
          ws.getCell(x, 71).value = "KW" + bqVal; // BS stays text
          ws.getCell(x, 72).value = bqRaw as ExcelJS.CellValue; // BT = BQ as Number
        } else if (!esEuropeo) {
          ws.getCell(x, 71).value = paisAfter + bqVal; // BS stays text
          ws.getCell(x, 72).value = bqRaw as ExcelJS.CellValue; // BT = BQ as Number
        }

        // Req 6: BT (72) = BQ as Number (for all overseas cases)
        ws.getCell(x, 72).value = bqRaw as ExcelJS.CellValue;
      }

      // UAE region "02" price update
      const jVal = getCellText(ws.getCell(x, 10).value);
      const ckStr = getCellText(ws.getCell(x, 89).value);
      if (jVal.startsWith("UAE") && ckStr === "02") {
        const aiVal = getCellNumber(ws.getCell(x, 35).value);
        if (aiVal > 0) ws.getCell(x, 32).value = aiVal;
      }
      x++;
    }

    // 3. Final double-criteria sort
    if (totalDataRows > 1) {
      const rows: RowSnapshot[] = [];
      for (let r = 2; r < lastDataRow; r++) rows.push(snapshotRow(ws, r, maxCol));

      const hasBqData = rows.some((r) => getCellText(getRowCellValue(r, 69)).trim() !== "");

      if (hasBqData) {
        rows.sort((r1, r2) => {
          const cmpBq = compareCellValues(getRowCellValue(r1, 69), getRowCellValue(r2, 69));
          if (cmpBq !== 0) return cmpBq;
          return compareCellValues(getRowCellValue(r1, 89), getRowCellValue(r2, 89));
        });
      } else {
        rows.sort((r1, r2) =>
          compareCellValues(getRowCellValue(r1, 1), getRowCellValue(r2, 1))
        );
      }

      for (let idx = 0; idx < rows.length; idx++) restoreRow(ws, idx + 2, rows[idx]);
    }
  }

  // ── Req 1: build a clean output workbook ─────────────────────────────────
  const buf = await buildCleanWorkbook(ws, sheetName);
  return { outputBytes: buf as ArrayBuffer };
}

// Suppress unused-let lint by referencing colLetter (kept for debugging)
void colLetter;
