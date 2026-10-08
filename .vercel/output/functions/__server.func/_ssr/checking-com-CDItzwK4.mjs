import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as CircleCheck, o as CircleAlert, r as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as trackEvent } from "./analytics-BWEQo677.mjs";
import { t as PageShell } from "./PageShell-DjMbovPC.mjs";
import { i as validateExcelFile, n as downloadBlob, r as stripExt, t as FileDropzone } from "./download-CjteLmYm.mjs";
import { t as require_excel } from "../_libs/exceljs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checking-com-CDItzwK4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_excel = /* @__PURE__ */ __toESM(require_excel());
/**
* Translation of the "Checking COM" VBA macro.
* Uses ExcelJS. Original bytes are never mutated — we load into a new Workbook.
*/
var HIDE_RANGES = [
	[1, 3],
	[5, 13],
	[15, 20],
	[22, 24],
	[29, 31],
	[37, 43]
];
var UNHIDE_RANGES = [[58, 59]];
function stddev(nums) {
	if (nums.length < 2) return 0;
	const m = nums.reduce((a, b) => a + b, 0) / nums.length;
	const v = nums.reduce((s, n) => s + (n - m) ** 2, 0) / (nums.length - 1);
	return Math.sqrt(v);
}
function average(nums) {
	if (!nums.length) return 0;
	return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function cellText(v) {
	if (v == null) return "";
	if (typeof v === "object" && v !== null) {
		if ("text" in v) return String(v.text ?? "");
		if ("result" in v) return String(v.result ?? "");
		if ("richText" in v) return (v.richText || []).map((r) => r.text).join("");
	}
	return String(v);
}
function cellNum(v) {
	const s = cellText(v).trim();
	if (s === "") return null;
	const n = Number(s);
	return isNaN(n) ? null : n;
}
function findHeader(ws, headerLower) {
	const row = ws.getRow(1);
	const last = ws.columnCount;
	for (let c = 1; c <= last; c++) if (cellText(row.getCell(c).value).trim().toLowerCase() === headerLower) return c;
	return -1;
}
function buildSummary(wb, wsData, sheetName, groupHeader, valueHeader, outLabel, agg) {
	const groupCol = findHeader(wsData, groupHeader.toLowerCase());
	const valueCol = findHeader(wsData, valueHeader.toLowerCase());
	const sheet = wb.addWorksheet(sheetName);
	if (groupCol === -1 || valueCol === -1) {
		sheet.getCell(1, 1).value = groupHeader;
		sheet.getCell(1, 2).value = outLabel;
		sheet.getCell(2, 1).value = `Column not found in data sheet.`;
		return;
	}
	const groups = /* @__PURE__ */ new Map();
	const lastRow = wsData.actualRowCount;
	for (let r = 2; r <= lastRow; r++) {
		const g = cellText(wsData.getCell(r, groupCol).value).trim();
		if (!g) continue;
		const n = cellNum(wsData.getCell(r, valueCol).value);
		if (n == null) continue;
		if (!groups.has(g)) groups.set(g, []);
		groups.get(g).push(n);
	}
	sheet.getCell(1, 1).value = groupHeader;
	sheet.getCell(1, 2).value = outLabel;
	sheet.getRow(1).font = { bold: true };
	const rows = [];
	for (const [g, arr] of groups) rows.push({
		group: g,
		val: agg === "stdev" ? stddev(arr) : average(arr)
	});
	rows.sort((a, b) => a.group.localeCompare(b.group));
	let r = 2;
	for (const { group, val } of rows) {
		sheet.getCell(r, 1).value = group;
		sheet.getCell(r, 2).value = val;
		r++;
	}
	if (rows.length > 0) sheet.addConditionalFormatting({
		ref: `B2:B${r - 1}`,
		rules: [{
			type: "colorScale",
			priority: 1,
			cfvo: [
				{ type: "min" },
				{
					type: "percentile",
					value: 50
				},
				{ type: "max" }
			],
			color: [
				{ argb: "FF63BE7B" },
				{ argb: "FFFFEB84" },
				{ argb: "FFF8696B" }
			]
		}]
	});
	sheet.getColumn(1).width = 24;
	sheet.getColumn(2).width = 32;
}
async function processCheckingCom({ fileBytes }) {
	const wb = new import_excel.default.Workbook();
	await wb.xlsx.load(fileBytes);
	if (wb.worksheets.length === 0) throw new Error("Workbook has no worksheets.");
	const wsData = wb.worksheets[0];
	for (const [from, to] of HIDE_RANGES) for (let c = from; c <= to; c++) wsData.getColumn(c).hidden = true;
	for (const [from, to] of UNHIDE_RANGES) for (let c = from; c <= to; c++) wsData.getColumn(c).hidden = false;
	const lastCol = wsData.columnCount;
	if (lastCol > 0) wsData.autoFilter = {
		from: {
			row: 1,
			column: 1
		},
		to: {
			row: 1,
			column: lastCol
		}
	};
	for (const b of [
		{
			name: "PivotAnDSC",
			group: "model",
			value: "Announced DSC",
			label: "StandardDev of Announced DSC",
			agg: "stdev"
		},
		{
			name: "PivotEqTransPrice",
			group: "model",
			value: "Equalized Transactional Price",
			label: "StandardDev of Equalized Transactional Price",
			agg: "stdev"
		},
		{
			name: "PivotLeasingMP",
			group: "model",
			value: "Leasing (LS): Monthly Payment (MP) incl. costs/services (MP1)",
			label: "StandardDev of Leasing (LS): Monthly Payment (MP) incl. costs/services (MP1)",
			agg: "stdev"
		},
		{
			name: "PivotBalloonMP",
			group: "model",
			value: "Balloon Finance (BF): MP Equalized",
			label: "StandardDev of Balloon Finance (BF): MP Equalized",
			agg: "stdev"
		},
		{
			name: "PivotModelMonths",
			group: "Model",
			value: "Balloon Finance (BF): Duration (Months)",
			label: "StandardDev of Balloon Finance (BF): Duration (Months)",
			agg: "stdev"
		},
		{
			name: "PivotModelMileage",
			group: "Model",
			value: "Balloon Finance (BF): Duration (km)",
			label: "Average of Balloon Finance (BF): Duration (km)",
			agg: "average"
		}
	]) buildSummary(wb, wsData, b.name, b.group, b.value, b.label, b.agg);
	const modelCol = findHeader(wsData, "model");
	if (modelCol !== -1) {
		const lastRow = wsData.actualRowCount;
		const lastColInSheet = wsData.columnCount;
		for (let r = 2; r < lastRow; r++) if (cellText(wsData.getCell(r, modelCol).value) !== cellText(wsData.getCell(r + 1, modelCol).value)) for (let c = 1; c <= lastColInSheet; c++) {
			const cell = wsData.getCell(r, c);
			cell.border = {
				...cell.border || {},
				bottom: { style: "thick" }
			};
		}
		for (let c = 1; c <= lastColInSheet; c++) {
			const cell = wsData.getCell(lastRow, c);
			cell.border = {
				...cell.border || {},
				bottom: { style: "thick" }
			};
		}
	}
	const insertDepositCheck = (depositHeader, pct, calcLabel, gapLabel) => {
		const depositCol = findHeader(wsData, depositHeader.toLowerCase());
		if (depositCol === -1) return;
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
	insertDepositCheck("Balloon Finance (BF): Deposit", .3, "30% of MSRP calculated", "GAP between deposit (obtained) and 30% of MSRP (requested)");
	insertDepositCheck("Classic Credit (CC): Deposit", .25, "25% of MSRP calculated", "GAP between deposit (obtained) and 25% of MSRP (requested)");
	return { outputBytes: await wb.xlsx.writeBuffer() };
}
function CheckingCom() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)("");
	const [output, setOutput] = (0, import_react.useState)(null);
	const busy = status === "processing";
	const clear = () => {
		setFile(null);
		setStatus("idle");
		setError("");
		setOutput(null);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setOutput(null);
		if (!file) return setError("Please select a file.");
		const v = validateExcelFile(file);
		if (v) return setError(v);
		setStatus("processing");
		trackEvent("checking_com_processing_started", { fileName: file.name });
		try {
			const { outputBytes } = await processCheckingCom({ fileBytes: (await file.arrayBuffer()).slice(0) });
			const filename = `Checking_COM_processed_${stripExt(file.name)}.xlsx`;
			setOutput({
				bytes: outputBytes,
				filename
			});
			setStatus("success");
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unexpected error while processing.";
			setError(msg);
			setStatus("error");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		title: "Checking COM",
		subtitle: "Upload a Checking COM Excel file and download the enhanced version.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-medium mb-2",
					children: "Checking COM file"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDropzone, {
					file,
					onFile: setFile,
					disabled: busy
				})] }),
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
						}), busy ? "Applying workbook transformations…" : "Apply Checking COM Macro"]
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
					children: [status === "success" && output && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							}), "Checking COM processed successfully."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => downloadBlob(output.bytes, output.filename),
							className: "px-4 py-2 text-sm font-medium text-white",
							style: {
								backgroundColor: "var(--accent-blue)",
								borderRadius: 4
							},
							children: "Download processed Checking COM"
						})]
					}), (status === "error" || status === "idle" && error) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					})]
				})
			]
		})
	});
}
//#endregion
export { CheckingCom as component };
