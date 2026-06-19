import fs from "fs";

// Load contract
const contract = JSON.parse(
  fs.readFileSync(
    "./src/components/Button/Button.contract.json",
    "utf-8"
  )
);

// Load tokens
const tokens = JSON.parse(
  fs.readFileSync("./tokens/tokens.json", "utf-8")
);

// Extract token names
const tokenNames = tokens.tokens.map((t) => t.name);

const allowedTokens = Object.values(contract.tokens)
  .flatMap((t) => t.allowed || []);

// Validate contract tokens
const missing = Object.values(contract.tokens)
  .flatMap((t) => t.allowed)
  .filter((token) => !tokenNames.includes(token));

if (missing.length > 0) {
  console.error("❌ Contract uses unknown tokens:");
  console.error(missing);
  process.exit(1);
}

console.log("✅ Contract tokens are valid");