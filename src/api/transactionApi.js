import * as XLSX from "xlsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PASS_KEY = import.meta.env.VITE_PASS_KEY;

/**
 * STEP 1: Submit report query → returns query_id.
 */
export const submitTransactionQuery = async ({ startDate, endDate, vpa_id }) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token. Please login again.");

  const response = await fetch(`${BASE_URL}/idbi/sb/reports/querysubmit_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "pass_key": PASS_KEY,
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ startDate, endDate, vpa_id, mode: "excel" }),
  });

  if (!response.ok) {
    let msg = `Request failed (${response.status})`;
    try { const e = await response.json(); msg = e?.statusDescription || msg; } catch {}
    throw new Error(msg);
  }

  const data = await response.json();
  // Response contains query_id
  const queryId = data?.query_id || data?.data?.query_id;
  if (!queryId) throw new Error("No query_id returned from API.");
  return queryId;
};

/**
 * STEP 2: Poll until READY → returns signed_url.
 */
export const getReportStatus = async (queryId) => {
  const token = localStorage.getItem("access_token");
  const headers = { "pass_key": PASS_KEY };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}/idbi/sb/reports/get_report_status/${queryId}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    let msg = `Status check failed (${response.status})`;
    try { const e = await response.json(); msg = e?.statusDescription || msg; } catch {}
    throw new Error(msg);
  }

  const result = await response.json();
  // result.data = { query_id, status: "READY"|"PROCESSING"|"FAILED", signed_url, ... }
  return result?.data || {};
};

/**
 * STEP 3: Fetch the signed_url Excel file and parse rows.
 * Returns array of row objects.
 */
export const fetchExcelRows = async (signedUrl) => {
  const response = await fetch(signedUrl);
  if (!response.ok) throw new Error("Failed to download report file.");

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  return rows;
};

// Keep alias for backwards compatibility
export const fetchTransactionReports = submitTransactionQuery;
