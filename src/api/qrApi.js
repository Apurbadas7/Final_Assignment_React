import { encryptPayload, decryptPayload } from "../utils/crypto";

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
const PASS_KEY = import.meta.env.VITE_PASS_KEY;

/**
 * Generates a base64 QR code image from a UPI string.
 * API URL: https://auth-dev-stage.iserveu.online/idbi/merchant/qr_convert_to_base64
 */
export const generateQrBase64 = async (text) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Missing authentication token. Please log in again.");
  }

  // Payload confirmed by decrypting working curl example: { qrString: "upi://..." }
  const plainText = JSON.stringify({ qrString: text });
  const encryptedPayload = encryptPayload(plainText);

  const response = await fetch(`${BASE_URL}/idbi/merchant/qr_convert_to_base64`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "pass_key": PASS_KEY,
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ RequestData: encryptedPayload }),
  });

  const rawText = await response.text();

  if (!response.ok) {
    const msg = response.status === 401
      ? "Session expired. Please log in again."
      : `QR generation failed (${response.status})`;
    console.error("QR API Error:", rawText);
    throw new Error(msg);
  }

  let result;
  try {
    result = JSON.parse(rawText);
  } catch {
    throw new Error("Invalid response from QR service.");
  }

  // Handle API-level errors in body (some APIs return 200 with error message)
  if (result?.message?.toLowerCase().includes("expired") || result?.statusCode === 401) {
    throw new Error("Session expired. Please log in again.");
  }

  if (!result?.ResponseData) {
    console.error("Unexpected QR API response:", result);
    throw new Error("QR service did not return image data.");
  }

  const decrypted = decryptPayload(result.ResponseData);

  // The decrypted value may be raw base64 or a JSON with a base64 field
  try {
    const parsed = JSON.parse(decrypted);
    
    // 1. Try exhaustive list of common top-level and nested field names
    const base64 = 
      parsed.base64 || 
      parsed.qrBase64 || 
      parsed.qrCodeBase64 ||
      parsed.qr_code || 
      parsed.qrCode || 
      parsed.image || 
      parsed.data || 
      parsed.response_data?.qr_code ||
      parsed.responseData?.qr_code ||
      parsed.response_data?.base64 ||
      parsed.responseData || 
      parsed.qr_base64 ||
      parsed.base64Data ||
      parsed.imageData;

    if (base64 && typeof base64 === 'string') return base64;
    
    // 2. Deep scan: If it's a JSON but no known key is found, 
    // find the longest string value in the object (usually the base64 image)
    let longestString = "";
    const findLongest = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      Object.values(obj).forEach(val => {
        if (typeof val === 'string' && val.length > longestString.length) {
          longestString = val;
        } else if (typeof val === 'object') {
          findLongest(val);
        }
      });
    };
    findLongest(parsed);
    
    if (longestString.length > 100) {
      console.warn("QR API: Using heuristic fallback (longest string) as base64 source.");
      return longestString;
    }

    console.error("QR API: JSON response missing any valid base64-like content", parsed);
    return null;
  } catch {
    // If not JSON, check if it looks like a valid base64 (or at least not a JSON-like string)
    const trimmed = decrypted.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      console.warn("QR API: Decrypted string is not a JSON object, attempting raw usage", trimmed);
      return trimmed;
    }
    return trimmed;
  }
};
