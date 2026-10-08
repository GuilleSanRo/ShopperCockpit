import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as CircleCheck, o as CircleAlert, r as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as trackEvent } from "./analytics-BWEQo677.mjs";
import { t as PageShell } from "./PageShell-DjMbovPC.mjs";
import { i as validateExcelFile, n as downloadBlob, r as stripExt, t as FileDropzone } from "./download-CjteLmYm.mjs";
import { t as require_excel } from "../_libs/exceljs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/macro-to-location-B1OWT9bn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_excel = /* @__PURE__ */ __toESM(require_excel());
/**
* Translation of the "Matrix to Location" VBA macro.
* Uses ExcelJS end-to-end. Original uploaded file bytes are never mutated —
* we load into a fresh Workbook and return new bytes.
*/
var EUROPE = [
	"GER",
	"SPA",
	"FRA",
	"GB ",
	"ITA",
	"CAN",
	"NET",
	"AUS",
	"BEL",
	"SWI",
	"NOR",
	"POL"
];
var OVERSEAS = [
	"IVO",
	"EGY",
	"TUN",
	"SAF",
	"REU",
	"MOR",
	"KSA",
	"ISR",
	"KUW",
	"UAE"
];
function getCellText(v) {
	if (v == null) return "";
	if (typeof v === "object" && v !== null && "text" in v) return String(v.text ?? "");
	if (typeof v === "object" && v !== null && "result" in v) return String(v.result ?? "");
	return String(v);
}
function getCellNumber(v) {
	const s = getCellText(v).trim();
	if (s === "") return 0;
	const n = Number(s);
	return isNaN(n) ? 0 : n;
}
async function processMacroToLocation({ fileBytes, month, year }) {
	const wb = new import_excel.default.Workbook();
	await wb.xlsx.load(fileBytes);
	if (wb.worksheets.length === 0) throw new Error("Workbook has no worksheets.");
	const ws = wb.worksheets[0];
	ws.eachRow((row) => {
		row.eachCell((cell) => {
			if (cell.type === import_excel.default.ValueType.Formula) {
				const val = cell.value;
				if (val && typeof val === "object" && "result" in val) cell.value = val.result !== void 0 && val.result !== null ? val.result : null;
			}
		});
	});
	for (const other of [...wb.worksheets]) if (other.id !== ws.id) wb.removeWorksheet(other.id);
	const yy = year.slice(-2);
	const mesRaw = month.replace(/^0+/, "") || "0";
	const mesForm = [
		"10",
		"11",
		"12"
	].includes(month) ? month : mesRaw;
	const lastRow = ws.actualRowCount;
	for (let r = lastRow; r >= 2; r--) {
		const val = ws.getCell(r, 8).value;
		if (val == null || val === "") {
			ws.spliceRows(r, 1);
			continue;
		}
		let s = getCellText(val);
		if (![
			"10",
			"11",
			"12"
		].includes(s)) s = s.replace(/0/g, "");
		if (s !== mesForm) ws.spliceRows(r, 1);
	}
	let dataRows = 0;
	ws.eachRow((_row, idx) => {
		if (idx > 1) dataRows++;
	});
	if (dataRows === 0) throw new Error(`No data found for the selected month (${month}).`);
	const paisCompleto = getCellText(ws.getCell(2, 10).value);
	let ubiIni = 89;
	ws.spliceColumns(ubiIni, 0, []);
	ws.getCell(1, ubiIni).value = "LOCATION";
	const paisRaw = paisCompleto.toUpperCase().includes("ISLAND") ? paisCompleto.substring(0, 3) + "C" : paisCompleto.substring(0, 3);
	ubiIni = ubiIni + 1;
	if (!getCellText(ws.getCell(1, ubiIni).value).toUpperCase().includes("THEORETICAL NUMBER OF VISITS")) throw new Error("The file doesn't have the correct format. The column with the Total visits must be 'CK' column.");
	let x = 2;
	while (getCellText(ws.getCell(x, 2).value) !== "") {
		const repeticiones = getCellNumber(ws.getCell(x, ubiIni).value);
		if (repeticiones === 0) {
			ws.spliceRows(x, 1);
			continue;
		}
		const rowRef = ws.getRow(x);
		const rowValues = [];
		const raw = rowRef.values;
		for (let c = 1; c < raw.length; c++) rowValues[c] = raw[c];
		for (let i = 1; i < repeticiones; i++) {
			ws.spliceRows(x + 1, 0, []);
			const newRow = ws.getRow(x + 1);
			for (let c = 1; c < rowValues.length; c++) if (rowValues[c] !== void 0) newRow.getCell(c).value = rowValues[c];
		}
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
				if (paisRaw === "BEL" && ciudad === "01") {
					const col25 = getCellText(ws.getCell(fila, 25).value);
					const col32 = getCellNumber(ws.getCell(fila, 32).value);
					if (col25 === "Electric" && col32 < 4e4) ws.getCell(fila, 70).value = 5e3;
				}
				fila++;
				placed++;
				count--;
			}
		}
		if (placed !== repeticiones) throw new Error("The total number of visits is different than the sum of visits introduced in region columns. Please check the number of visits.");
		x = x + repeticiones;
	}
	const currentColCount = ws.columnCount;
	if (currentColCount >= 91) ws.spliceColumns(91, currentColCount - 90);
	let modelOld = getCellText(ws.getCell(2, 2).value);
	let cont04L = 0, cont05L = 0, cont06L = 0;
	let i = 2;
	while (getCellText(ws.getCell(i, 2).value) !== "") {
		const modelNew = getCellText(ws.getCell(i, 2).value);
		if (modelNew !== modelOld) {
			cont04L = 0;
			cont05L = 0;
			cont06L = 0;
			modelOld = modelNew;
		}
		let clienttype = getCellText(ws.getCell(i, 57).value);
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
	ws.spliceColumns(90, 1);
	const paisAfter = paisCompleto.toUpperCase().includes("ISLAND") ? paisCompleto.substring(0, 3) + "C" : paisCompleto.substring(0, 3);
	const esEuropeo = EUROPE.includes(paisAfter);
	let esOverseas = OVERSEAS.includes(paisAfter);
	if (!esOverseas && !esEuropeo) esOverseas = true;
	let contador = 1;
	x = 2;
	while (getCellText(ws.getCell(x, ubiIni - 1).value) !== "") {
		const mm = month;
		ws.getCell(x, 1).value = `${yy}${mm}${String(contador).padStart(3, "0")}`;
		x++;
		contador++;
	}
	const isLcv = (/* @__PURE__ */ new Set([
		"NETHERLANDS (EUR) - LCV",
		"BELGIUM (EUR) - LCV",
		"FRANCE (EUR) - LCV",
		"ITALY (EUR) - LCV"
	])).has(paisCompleto);
	if (esOverseas || isLcv) {
		x = 2;
		while (getCellText(ws.getCell(x, ubiIni - 1).value) !== "") {
			if (esOverseas && getCellText(ws.getCell(x, 88).value) !== "") ws.getCell(x, 69).value = getCellText(ws.getCell(x, 1).value);
			else ws.getCell(x, 69).value = getCellText(ws.getCell(x - 1, 69).value);
			if (isLcv && getCellText(ws.getCell(x, 84).value) !== "") ws.getCell(x, 69).value = getCellText(ws.getCell(x, 1).value);
			else if (isLcv) ws.getCell(x, 69).value = getCellText(ws.getCell(x - 1, 69).value);
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
				} else if (paisAfter === "KUW") ws.getCell(x, 71).value = "KW" + bqVal;
				else if (!esEuropeo) {
					ws.getCell(x, 71).value = paisAfter + bqVal;
					ws.getCell(x, 72).value = bqVal;
				}
				ws.getCell(x, 72).value = bqVal;
			}
			const jVal = getCellText(ws.getCell(x, 10).value);
			const ckStr = getCellText(ws.getCell(x, 89).value);
			if (jVal.startsWith("UAE") && ckStr === "02") {
				const aiVal = getCellNumber(ws.getCell(x, 35).value);
				if (aiVal > 0) ws.getCell(x, 32).value = aiVal;
			}
			x++;
		}
	}
	return { outputBytes: await wb.xlsx.writeBuffer() };
}
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function defaults() {
	const now = /* @__PURE__ */ new Date();
	const day = now.getDate();
	let m = now.getMonth() + 1;
	if (day > 25) m = m === 12 ? 1 : m + 1;
	const y = now.getFullYear();
	const year = y >= 2026 && y <= 2036 ? y : 2026;
	return {
		month: String(m).padStart(2, "0"),
		year: String(year)
	};
}
function MacroToLocation() {
	const defs = (0, import_react.useMemo)(defaults, []);
	const [file, setFile] = (0, import_react.useState)(null);
	const [month, setMonth] = (0, import_react.useState)(defs.month);
	const [year, setYear] = (0, import_react.useState)(defs.year);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)("");
	const [output, setOutput] = (0, import_react.useState)(null);
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
	const onSubmit = async (e) => {
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
			const { outputBytes } = await processMacroToLocation({
				fileBytes: (await file.arrayBuffer()).slice(0),
				month,
				year
			});
			let baseName = stripExt(file.name);
			if (baseName.toUpperCase().startsWith("MATRIZ_")) baseName = baseName.substring(7);
			const filename = `Location_${baseName}_${month}.xlsx`;
			setOutput({
				bytes: outputBytes,
				filename
			});
			setStatus("success");
			trackEvent("macro_processing_success", { fileName: file.name });
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unexpected error while processing.";
			setError(msg);
			setStatus("error");
			trackEvent("macro_processing_error", { message: msg });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		title: "Matrix to Location",
		subtitle: "Upload a Matrix Excel file, choose month and year, then download the generated Location file.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-medium mb-2",
					children: "Matrix file"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDropzone, {
					file,
					onFile: (f) => {
						setFile(f);
						if (f) trackEvent("macro_file_selected", {
							name: f.name,
							size: f.size
						});
					},
					disabled: busy
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "month",
						className: "block text-sm font-medium mb-2",
						children: "Month"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "month",
						value: month,
						onChange: (e) => setMonth(e.target.value),
						disabled: busy,
						className: "w-full border bg-white px-3 py-2 text-sm",
						style: {
							borderColor: "#E1E4EE",
							borderRadius: 4
						},
						children: MONTHS.map((n, i) => {
							const mm = String(i + 1).padStart(2, "0");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: mm,
								children: [
									mm,
									" ",
									n
								]
							}, mm);
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "year",
						className: "block text-sm font-medium mb-2",
						children: "Year"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: "year",
						value: year,
						onChange: (e) => setYear(e.target.value),
						disabled: busy,
						className: "w-full border bg-white px-3 py-2 text-sm",
						style: {
							borderColor: "#E1E4EE",
							borderRadius: 4
						},
						children: Array.from({ length: 11 }, (_, i) => 2026 + i).map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: String(y),
							children: y
						}, y))
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: busy,
						className: "inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white disabled:opacity-60",
						style: {
							backgroundColor: "var(--accent-blue)",
							borderRadius: 4
						},
						children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							className: "w-4 h-4 animate-spin",
							"aria-hidden": true
						}), busy ? "Processing workbook…" : "Generate Location File"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: clear,
						disabled: busy,
						className: "inline-flex items-center gap-2 px-5 py-2 text-sm font-medium border",
						style: {
							borderColor: "#E1E4EE",
							borderRadius: 4
						},
						children: "Clear"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"aria-live": "polite",
					children: [
						status === "success" && output && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border p-4 bg-white",
							style: {
								borderColor: "var(--accent-blue)",
								borderRadius: 4
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									className: "w-5 h-5",
									style: { color: "var(--accent-blue)" },
									"aria-hidden": true
								}), "Location file generated successfully."]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => downloadBlob(output.bytes, output.filename),
								className: "px-4 py-2 text-sm font-medium text-white",
								style: {
									backgroundColor: "var(--accent-blue)",
									borderRadius: 4
								},
								children: "Download Location file"
							})]
						}),
						status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 border p-4 text-sm",
							style: {
								borderColor: "var(--destructive)",
								borderRadius: 4,
								backgroundColor: "#FEF2F2",
								color: "var(--destructive)"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
								className: "w-5 h-5 mt-0.5",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
						}),
						status === "idle" && error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 border p-4 text-sm",
							style: {
								borderColor: "var(--destructive)",
								borderRadius: 4,
								backgroundColor: "#FEF2F2",
								color: "var(--destructive)"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
								className: "w-5 h-5 mt-0.5",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { MacroToLocation as component };
