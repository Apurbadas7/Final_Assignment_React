import { encryptPayload, decryptPayload } from "../utils/crypto";

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
const PASS_KEY = import.meta.env.VITE_PASS_KEY;

/**
 * Fetches VPA list for a user by mobile number.
 * - Encrypts the request body: { mobile_number: "..." }
 * - Uses the Bearer token from localStorage for authorization
 * - The API response data may also be encrypted; we attempt to decrypt it.
 */
export const fetchByMobileNumber = async (mobileNumber) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("No access token found. Please login again.");
  }

  // Encrypt → JSON.stringify({ mobile_number: "7008533247" })
  const plainText = JSON.stringify({ mobile_number: mobileNumber });
  const encryptedPayload = encryptPayload(plainText);

  const response = await fetch(`${BASE_URL}/idbi/fetch/fetchById`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "pass_key": PASS_KEY,
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ RequestData: encryptedPayload }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to fetch VPA list (${response.status}): ${errText}`);
  }

  const responseJson = await response.json();

  // If the response has an encrypted ResponseData field, decrypt it
  if (responseJson?.ResponseData) {
    try {
      const decrypted = decryptPayload(responseJson.ResponseData);
      const parsed = JSON.parse(decrypted);
      // parsed could be an array of VPAs or an object with a data/list property
      if (Array.isArray(parsed)) {
        return { data: parsed };
      }
      if (Array.isArray(parsed?.data)) {
        return { data: parsed.data };
      }
      if (Array.isArray(parsed?.list)) {
        return { data: parsed.list };
      }
      // If it's a single object, wrap it
      return { data: [parsed] };
    } catch {
      // Fall through to treat raw response as the data
    }
  }

  // If the response already has a data array directly
  if (Array.isArray(responseJson?.data)) {
    return { data: responseJson.data };
  }

  // Last resort: wrap the whole response
  return { data: [responseJson] };
};
