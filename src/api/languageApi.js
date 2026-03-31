import { encryptPayload, decryptPayload } from "../utils/crypto";

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
const PASS_KEY = import.meta.env.VITE_PASS_KEY;

const authHeaders = () => ({
  "pass_key": PASS_KEY,
  "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
});

const parseEncryptedResponse = async (response) => {
  const json = await response.json();
  if (json?.ResponseData) {
    try {
      return JSON.parse(decryptPayload(json.ResponseData));
    } catch {
      return json;
    }
  }
  return json;
};

/**
 * FETCH ALL LANGUAGES
 * GET /idbi/isu_soundbox/lang/fetch_language
 * No request body — just auth headers
 */
export const fetchAllLanguages = async () => {
  const response = await fetch(
    `${BASE_URL}/idbi/isu_soundbox/lang/fetch_language`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );
  if (!response.ok) throw new Error(`Failed to fetch languages: ${response.status}`);
  return parseEncryptedResponse(response);
};

/**
 * FETCH CURRENT LANGUAGE
 * GET /idbi/isu_soundbox/user_api/current_language/{serial_number}
 * serial_number passed as URL path param — no body
 */
export const fetchCurrentLanguage = async (serialNumber) => {
  const response = await fetch(
    `${BASE_URL}/idbi/isu_soundbox/user_api/current_language/${serialNumber}`,
    {
      method: "GET",
      headers: authHeaders(),
    }
  );
  if (!response.ok) throw new Error(`Failed to fetch current language: ${response.status}`);
  return parseEncryptedResponse(response);
};

/**
 * UPDATE LANGUAGE
 * POST /idbi/isu_soundbox/lang/update_language
 * Body: { RequestData: encrypt({"tid":"38241108350403","update_language":"HINDI"}) }
 * Language code must be UPPERCASE (e.g. HINDI, ENGLISH, ODIA)
 */
export const updateLanguage = async (serialNumber, languageCode) => {
  const plainText = JSON.stringify({
    tid: serialNumber,
    update_language: languageCode.toUpperCase(),
  });
  const encryptedPayload = encryptPayload(plainText);

  const response = await fetch(
    `${BASE_URL}/idbi/isu_soundbox/lang/update_language`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ RequestData: encryptedPayload }),
    }
  );
  if (!response.ok) throw new Error(`Failed to update language: ${response.status}`);
  return parseEncryptedResponse(response);
};
