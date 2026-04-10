const crypto = require("crypto");

function generateHash(...parts) {
  const key = parts.join("|");
  return crypto.createHash("sha256").update(key).digest("hex");
}

module.exports = { generateHash };
