// app/api/cryptoUtils.js
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(
  "a8b57a6acfd1244797478bb9e7acc7380cb0e642a13df4a25b80f397df073d92",
  "hex"
);
const iv = Buffer.from("c7c6f34f06049137b4f393e7411e6fb1", "hex");

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Test encryption and decryption
const cipherText = encrypt("Hi how are you");
console.log("Encrypted:", cipherText);

const decryptedText = decrypt(cipherText);
console.log("Decrypted:", decryptedText);

module.exports = { encrypt, decrypt };
