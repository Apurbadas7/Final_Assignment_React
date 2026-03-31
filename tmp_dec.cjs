const CryptoJS = require("crypto-js");
const fs = require("fs");

const SECRET_KEY = "a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=";
const getDecodedKey = () => CryptoJS.enc.Base64.parse(SECRET_KEY);
const removeNoise = (v = "") => Array.from(v).filter(c => c.charCodeAt(0) > 31).join("").trim();

const decrypt = (enc) => {
  const bytes = CryptoJS.enc.Base64.parse(enc);
  const iv = CryptoJS.lib.WordArray.create(bytes.words.slice(0, 4), 16);
  const cipher = CryptoJS.lib.WordArray.create(bytes.words.slice(4), bytes.sigBytes - 16);
  const dec = CryptoJS.AES.decrypt({ ciphertext: cipher }, getDecodedKey(), { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
  return removeNoise(dec.toString(CryptoJS.enc.Utf8));
};

// Decrypt update_language request body
const updateReq = "sW3jHfISG6YPjrWDKzguVZdXf+He++zoTk+VnBO47YaAotmOPatPrUp6XoU6BmVZkLUNNR/VN7+4stHcJAi1xaU2JNLvaeFR8g7IKAzWICY=";
console.log("update_language RequestData decrypted:", decrypt(updateReq));
