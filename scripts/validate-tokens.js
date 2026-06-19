import fs from "fs";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

// Load schema
const schema = JSON.parse(
  fs.readFileSync("./tokens/tokens.schema.json", "utf-8")
);

// Load tokens
const data = JSON.parse(
  fs.readFileSync("./tokens/tokens.json", "utf-8")
);

// Validate
const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.error("❌ Token validation failed:");
  console.error(validate.errors);
  process.exit(1);
}

console.log("✅ Tokens are valid");