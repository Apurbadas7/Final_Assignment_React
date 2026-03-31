const CryptoJS = require('crypto-js');

const SECRET_KEY = "a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=";
const PASS_KEY = "QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA";
// Use a fresh token from the user's curl command
const TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA4ZjFkYzczN2JjODBjOWFlM2RiNzYzYzExNWI0NmQ0IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2lkYmktYXV0aC1zdGFnZS5pc3VwYXkuaW4vYXBwbGljYXRpb24vby9pZGJpLyIsInN1YiI6ImRiNTE3MzRkZTcxNmNkNzdlYmFkZTkzYjdhZWRjZGEyZmFjMmEwNmExNGM1NDNhOWQ2N2MwZjc1YWJmYzQ3Y2EiLCJhdWQiOiJoMHhMRldxMUZTNnVIS1Z3ayIsImV4cCI6MTc3NDg5MDQ0OCwiaWF0IjoxNzc0ODg4NjQ4LCJhdXRoX3RpbWUiOjE3NzQ4NjQ5MTksImFjciI6ImdvYXV0aGVudGlrLmlvL3Byb3ZpZGVycy9vYXV0aDIvZGVmYXVsdCIsImFtciI6WyJwd2QiXSwic2lkIjoiOTg2YzIxZTBjMWU2MzZiY2I2MjRmM2ZlNTQ5MzMwZTBiNWI4Njg2ODEwZDRmYzg1YzJkZTg3ZTcyN2EzZWRkNSIsImFkbWluTmFtZSI6IklEQklBRE1JTiIsImF1dGhvcml0aWVzIjpbIlJPTEVfUkVUQUlMRVIiXSwiYmFua0NvZGUiOiJpZGJpIiwiY3JlYXRlZCI6MTc3NDg4ODY0OTAyMywiZW1haWwiOiJleGFtcGxlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwYXRoIjoidXNlcnMvbWVyY2hhbnRzLyIsInByaXZpbGVnZXMiOlsiUk9MRV9SRVRBSUxFUiIsInVzZXJzL21lcmNoYW50cy8iXSwibmFtZSI6IlRlc3QgVXNlciIsImdpdmVuX25hbWUiOiJUZXN0IFVzZXIiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI3MDA4NTMzMjQ3Iiwibmlja25hbWUiOiI3MDA4NTMzMjQ3IiwiZ3JvdXBzIjpbIlJPTEVfUkVUQUlMRVIiXSwidXNlcl9uYW1lIjoiNzAwODUzMzI0NyIsImF6cCI6ImgweExGV3ExRlM2dUhLVndrIiwidWlkIjoiNml3Q2MxcEE4OUJ4MERubXRNV2x1NGlMTE5iQ1FmbEhWZFo3UFc0TSJ9.mAYoVs40fLs1LvhAQoS3kaAWe8blx_q6_idcIQrLpql8WnD9DiwNsB_mGu1UiocSHpw_NSQSTiBodQ1DtKDANqFqwUka0P6EN0R33ZNStDPtSE5Ou25pFTwUT6e2oAvKlm8KrMXn6qfNrj25-zIBO-D29CikpDJT9xS7j6bljwZZcBz8EoKjxav75MvpwZlX_TaQ1vd2bOUP7aYzjEwqvczeuGqUt1ctB2PjKcbgkb_6Gh2pUB9yKKLAlv0KfX2TwQaEETYA9AV4ccyCg7Jl4BkgK1R54bWtDJfP0jaUp3EjsOH3J6bBJ6byJHQrmTz6qHtJ69jd0fj1IaGLyy8tqw";

// Encrypt
const encryptPayload = (plainText) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const decodedKey = CryptoJS.enc.Base64.parse(SECRET_KEY);
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    decodedKey,
    { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
  );
  const combined = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
};

// Decrypt
const decryptPayload = (encryptedString) => {
  const byteCipherText = CryptoJS.enc.Base64.parse(encryptedString);
  const iv = CryptoJS.lib.WordArray.create(byteCipherText.words.slice(0, 4), 16);
  const cipherText = CryptoJS.lib.WordArray.create(byteCipherText.words.slice(4), byteCipherText.sigBytes - 16);
  const decodedKey = CryptoJS.enc.Base64.parse(SECRET_KEY);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherText }, decodedKey, { iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

async function testQrApi() {
  const upiString = "upi://pay?pa=20250602000094-iserveuqrsbrp@indianbank&pn=Kripa%20Sindhu%20Paira&cu=INR&mode=01&purpose=00&mc=5411&tid=TXN001";
  const plainText = JSON.stringify({ qrString: upiString });

  console.log("Plain text payload:", plainText);

  const encrypted = encryptPayload(plainText);
  console.log("Encrypted payload:", encrypted);

  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://auth-dev-stage.iserveu.online/idbi/merchant/qr_convert_to_base64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pass_key': PASS_KEY,
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ RequestData: encrypted }),
    });

    const text = await response.text();
    console.log("HTTP Status:", response.status);
    console.log("Raw response (first 500 chars):", text.substring(0, 500));

    let result;
    try { result = JSON.parse(text); } catch { result = {}; }

    if (result.ResponseData) {
      const decrypted = decryptPayload(result.ResponseData);
      console.log("Decrypted response (first 300 chars):", decrypted.substring(0, 300));
    } else {
      console.log("Full parsed response:", JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

testQrApi();
