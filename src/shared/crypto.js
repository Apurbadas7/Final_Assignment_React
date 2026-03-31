import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_AES_KEY || "";

const getDecodedKey = () => {
  if (!SECRET_KEY) {
    throw new Error("Missing VITE_AES_KEY in environment variables.");
  }
  return CryptoJS.enc.Base64.parse(SECRET_KEY);
};

const removeNoise = (value = "") =>
  Array.from(value)
    .filter((char) => char.charCodeAt(0) > 31)
    .join("")
    .trim();

export const encryptPayload = (plainText) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const decodedKey = getDecodedKey();

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    decodedKey,
    { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
  );

  const combined = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
};

export const decryptPayload = (encryptedString) => {
  const byteCipherText = CryptoJS.enc.Base64.parse(encryptedString);

  const iv = CryptoJS.lib.WordArray.create(
    byteCipherText.words.slice(0, 4),
    16
  );

  const cipherText = CryptoJS.lib.WordArray.create(
    byteCipherText.words.slice(4),
    byteCipherText.sigBytes - 16
  );

  const decodedKey = getDecodedKey();

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: cipherText },
    decodedKey,
    { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
  );

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  return removeNoise(decryptedString);
};
