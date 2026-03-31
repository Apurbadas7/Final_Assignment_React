const CryptoJS = require('crypto-js');

const SECRET_KEY = "a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=";
const cipherTextBase64 = "MtBrLPOdMbPCLKvQQ4YQY4bpEjH8Xq1KTvJDd2pSpKSQwW4QfmbHBk4gcgkw2xiDUsw3CWScR+pjhpNYLYDO4AhQ4iaGo6WLqJfijKV5yKF62Cm/r4kYWr8wBdZ+PoiOtsrTJqpy4dmuVVVUF/9MDJHXmSNGmjkmZZekzJtW8FI=";

try {
    const byteCipherText = CryptoJS.enc.Base64.parse(cipherTextBase64);

    const iv = CryptoJS.lib.WordArray.create(
      byteCipherText.words.slice(0, 4),
      16
    );

    const cipherText = CryptoJS.lib.WordArray.create(
      byteCipherText.words.slice(4),
      byteCipherText.sigBytes - 16
    );

    const decodedKey = CryptoJS.enc.Base64.parse(SECRET_KEY);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: cipherText },
      decodedKey,
      { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted Content:", decryptedString);
} catch (e) {
    console.error("Decryption failed:", e);
}
