const { createHmac } = require("crypto");
const { existsSync, readFileSync } = require("fs");
const { exit } = require("process");

const clipboardy = require("clipboardy");
const base32Decode = require("base32-decode");

let errorMessage = null;
let secret = null;
if (existsSync("secret.raw")) {
  secret = readFileSync("secret.raw");
  if (secret.length !== 20) {
    errorMessage = "Secret key should be 20 bytes!";
  }
} else if (existsSync("secret.base64")) {
  const base64String = readFileSync("secret.base64", "utf8").trim();
  if (/^[A-Za-z0-9+/]{27}=?$/.test(base64String)) {
    secret = Buffer.from(base64String, "base64");
  } else {
    errorMessage = "Secret key should be 27 base-64 digits!";
  }
} else if (existsSync("secret.base32")) {
  const base32String = readFileSync("secret.base32", "utf8").trim();
  if (/^[A-Za-z2-7]{32}$/.test(base32String)) {
    secret = Buffer.from(base32Decode(base32String, "RFC4648"));
  } else {
    errorMessage = "Secret key should be 32 base-32 digits!";
  }
} else if (existsSync("secret.hex")) {
  const hexString = readFileSync("secret.hex", "utf8").trim();
  if (/^[0-9a-fA-F]{40}$/.test(hexString)) {
    secret = Buffer.from(hexString, "hex");
  } else {
    errorMessage = "Secret key should be 40 hex digits!";
  }
} else {
  errorMessage =
    "Please create a 'secret' file (secret.hex OR secret.base32 OR secret.raw)";
}

if (errorMessage) {
  console.error(errorMessage);
  setTimeout(() => exit(1), 5000);
} else {
  // initialize hmac of secret key
  const hmac = createHmac("sha1", secret);

  // calculate number of 30-second intervals since 1970-01-01
  const c = Buffer.alloc(8);
  c.writeBigInt64BE(BigInt(new Date().getTime()) / 30000n);

  // digest the payload
  hmac.update(c);

  // get hmac output
  const buf = hmac.digest();

  // the offset is the last 4 bits of the output
  const offset = buf.readUInt8(19) & 0xf;

  // get the integer result
  const n = buf.readUInt32BE(offset) & 0x7fffffff;

  // get the last 6 digits of integer result
  const sixDigits = (n % 1000000).toString().padStart(6, "0");

  // copy to clipboard
  clipboardy.writeSync(sixDigits);
  console.log("Copied to clipboard!");

  // keep window open for 1 second
  setTimeout(() => {}, 1000);
}
