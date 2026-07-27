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

const colLetter = (n: number): string => {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

function getCellText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "object" && v !== null && "text" in (v as Record<string, unknown>)) {
    return String((v as { text: unknown }).text ?? "");
  }
  if (typeof v === "object" && v !== null && "result" in (v as Record<string, unknown>)) {
    return String((v as { result: unknown }).result ?? "");
  }
  return String(v);
}

function getCellNumber(v: unknown): number {
  const s = getCellText(v).trim();
  if (s === "") return 0;
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}

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

  const ws = wb.worksheets[0];

  // Delete all other sheets
  for (const other of [...wb.worksheets]) {
    if (other.id !== ws.id) wb.removeWorksheet(other.id);
  }

  const yy = year.slice(-2);
  const mesRaw = month.replace(/^0+/, "") || "0"; // "1".."12"
  const mesForm = ["10", "11", "12"].includes(month) ? month : mesRaw;

  // Filter rows: column 8 must match month
  const lastRow = ws.actualRowCount;
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

  // Check any rows remain
  let dataRows = 0;
  ws.eachRow((_row, idx) => {
    if (idx > 1) dataRows++;
  });
  if (dataRows === 0) {
    throw new Error(`No data found for the selected month (${month}).`);
  }

  const paisCompleto = getCellText(ws.getCell(2, 10).value);

  // Insert LOCATION column at position 89 (before old col 89 -> new col 89)
  let ubiIni = 89;
  ws.spliceColumns(ubiIni, 0, []); // insert empty col
  ws.getCell(1, ubiIni).value = "LOCATION";

  const paisRaw = paisCompleto.toUpperCase().includes("ISLAND")
    ? paisCompleto.substring(0, 3) + "C"
    : paisCompleto.substring(0, 3);

  ubiIni = ubiIni + 1;

  // Column at ubiIni should be "THEORETICAL NUMBER OF VISITS"
  const theoreticalHeader = getCellText(ws.getCell(1, ubiIni).value).toUpperCase();
  if (!theoreticalHeader.includes("THEORETICAL NUMBER OF VISITS")) {
    throw new Error(
      "The file doesn't have the correct format. The column with the Total visits must be 'CK' column.",
    );
  }

  // Duplicate rows per visits, fill LOCATION column
  let x = 2;
  while (getCellText(ws.getCell(x, 2).value) !== "") {
    const repeticiones = getCellNumber(ws.getCell(x, ubiIni).value);
    if (repeticiones === 0) {
      ws.spliceRows(x, 1);
      continue;
    }

    // Snapshot row values before duplicating
    const rowRef = ws.getRow(x);
    const rowValues: unknown[] = [];
    // ExcelJS row.values is 1-indexed array
    const raw = rowRef.values as unknown[];
    for (let c = 1; c < raw.length; c++) rowValues[c] = raw[c];

    // Insert (repeticiones - 1) duplicates below
    for (let i = 1; i < repeticiones; i++) {
      ws.spliceRows(x + 1, 0, []);
      const newRow = ws.getRow(x + 1);
      for (let c = 1; c < rowValues.length; c++) {
        if (rowValues[c] !== undefined) newRow.getCell(c).value = rowValues[c] as ExcelJS.CellValue;
      }
    }

    // Fill LOCATION column
    let fila = x;
    let placed = 0;
    for (let i = 1; i <= 20; i++) {
      const cellV = ws.getCell(x, ubiIni + i).value;
      const cellStr = getCellText(cellV);
      if (cellStr === "") continue;
      const num = Number(cellStr);
      if (isNaN(num)) continue;
      let count = num;
      while (count > 0) {
        const ciudad = i < 10 ? `0${i}` : `${i}`;
        ws.getCell(fila, ubiIni - 1).value = ciudad;
        // BEL special rule: col 25 = Electric, col 32 < 40000 -> col 70 = 5000
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

  // Delete columns CM (91) onwards to remove notes/regions
  // Excel col CM = 91
  const currentColCount = ws.columnCount;
  if (currentColCount >= 91) {
    ws.spliceColumns(91, currentColCount - 90);
  }

  // Client type trimming: only first 3 per model retain #04L#/#05L#/#06L#
  let modelOld = getCellText(ws.getCell(2, 2).value);
  let cont04L = 0,
    cont05L = 0,
    cont06L = 0;
  let i = 2;
  while (getCellText(ws.getCell(i, 2).value) !== "") {
    const modelNew = getCellText(ws.getCell(i, 2).value);
    if (modelNew !== modelOld) {
      cont04L = 0;
      cont05L = 0;
      cont06L = 0;
      modelOld = modelNew;
    }
    let clienttype = getCellText(ws.getCell(i, 57).value); // BE = 57
    const marker = clienttype.replace(/#/g, "@");

    if (marker.includes("@04L@")) {
      cont04L++;
      if (cont04L > 3) clienttype = clienttype.replace("#04L#", "#");
    }
    if (marker.includes("@05L@")) {
      cont05L++;
      if (cont05L > 3) clienttype = clienttype.replace("#05L#", "#");
    }
    if (marker.includes("@06L@")) {
      cont06L++;
      if (cont06L > 3) clienttype = clienttype.replace("#06L#", "#");
    }
    ws.getCell(i, 57).value = clienttype;
    i++;
  }

  // Delete column CL (90)
  ws.spliceColumns(90, 1);

  // Determine country classification (post-column-shift)
  const paisAfter = paisCompleto.toUpperCase().includes("ISLAND")
    ? paisCompleto.substring(0, 3) + "C"
    : paisCompleto.substring(0, 3);
  const esEuropeo = EUROPE.includes(paisAfter);
  let esOverseas = OVERSEAS.includes(paisAfter);
  if (!esOverseas && !esEuropeo) esOverseas = true;

  // Assign IDs: YYMM### in column 1
  let contador = 1;
  x = 2;
  while (getCellText(ws.getCell(x, ubiIni - 1).value) !== "") {
    const mm = month;
    ws.getCell(x, 1).value = `${yy}${mm}${String(contador).padStart(3, "0")}`;
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
    // Fill BQ (69), BS (71), BT (72), and UAE price update
    // Note: after deletion of CL, columns shifted. CJ=88, CK=89, CF=84, but we work with original mapping.
    // Post-deletion of col 90, "CK" (col 89 originally) is now at col 89 still (we deleted col 90).
    // Ranges: BQ=69, BS=71, BT=72, CJ=88, CK=89, CF=84, J=10, AI=35, AF=32
    x = 2;
    while (getCellText(ws.getCell(x, ubiIni - 1).value) !== "") {
      if (esOverseas && getCellText(ws.getCell(x, 88).value) !== "") {
        ws.getCell(x, 69).value = getCellText(ws.getCell(x, 1).value);
      } else {
        ws.getCell(x, 69).value = getCellText(ws.getCell(x - 1, 69).value);
      }

      if (isLcv && getCellText(ws.getCell(x, 84).value) !== "") {
        ws.getCell(x, 69).value = getCellText(ws.getCell(x, 1).value);
      } else if (isLcv) {
        ws.getCell(x, 69).value = getCellText(ws.getCell(x - 1, 69).value);
      }

      if (esOverseas) {
        const ckVal = getCellText(ws.getCell(x, 89).value);
        const bqVal = getCellText(ws.getCell(x, 69).value);
        let prefijo = "";
        if (paisAfter === "KSA") {
          prefijo = ckVal === "01" ? "JD" : ckVal === "02" ? "RD" : ckVal === "03" ? "DM" : "";
          ws.getCell(x, 71).value = prefijo + bqVal;
        } else if (paisAfter === "UAE") {
          prefijo = ckVal === "01" ? "DB" : ckVal === "02" ? "AD" : "";
          ws.getCell(x, 71).value = prefijo + bqVal;
        } else if (paisAfter === "KUW") {
          ws.getCell(x, 71).value = "KW" + bqVal;
        } else if (!esEuropeo) {
          ws.getCell(x, 71).value = paisAfter + bqVal;
          ws.getCell(x, 72).value = bqVal;
        }
        ws.getCell(x, 72).value = bqVal;
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
  }

  // Return new bytes; original file bytes were never mutated (ExcelJS loaded a copy).
  const out = await wb.xlsx.writeBuffer();
  const arr = out as ArrayBuffer;
  return { outputBytes: arr };
}

// Suppress unused-let lint by referencing colLetter (kept for debugging)
void colLetter;
