import { authConfig } from "../../pages/Auth/AuthCallback/AuthConfig";

const generateRandomString = (length = 64) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((value) => chars[value % chars.length])
    .join("");
};

const sha256 = async (plainText) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  return crypto.subtle.digest("SHA-256", data);
};

const base64UrlEncode = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const login = async () => {
  if (!authConfig.clientId) {
    throw new Error("Missing VITE_CLIENT_ID in environment variables.");
  }

  const codeVerifier = generateRandomString(64);
  const state = generateRandomString(16);
  const loginMobileNumber =
    import.meta.env.VITE_LOGIN_MOBILE_NUMBER || "7008533247";

  localStorage.setItem("code_verifier", codeVerifier);
  localStorage.setItem("auth_state", state);
  localStorage.setItem("login_mobile_number", loginMobileNumber);

  const hashedVerifier = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashedVerifier);

  const authUrl =
    `${authConfig.authorizationEndpoint}?` +
    `client_id=${encodeURIComponent(authConfig.clientId)}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(authConfig.redirectUri)}` +
    `&scope=${encodeURIComponent(authConfig.scopes.join(" "))}` +
    `&state=${encodeURIComponent(state)}` +
    `&code_challenge=${encodeURIComponent(codeChallenge)}` +
    `&code_challenge_method=S256`;

  window.location.href = authUrl;
};