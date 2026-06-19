# AI Design System — Button Pilot

This repository demonstrates a token-driven UI system with zero drift.

---

## Core Principles

- No hardcoded values
- All styling must use tokens
- All tokens must map back to Figma
- Components must declare token usage explicitly
- All changes must pass validation

---

## Architecture

Figma → Tokens → Contract → Component → Validation → CI

---

## Repository Structure

### Tokens

- `/tokens/tokens.json` — canonical token registry
- `/tokens/tokens.schema.json` — validation schema

---

### Component: Button

- `/src/components/Button/Button.contract.json` — component definition
- `/src/components/Button/Button.tokens.json` — token mapping
- `/src/components/Button/Button.tsx` — implementation

---

### Styles

- `/src/styles/tokens.css` — runtime token output

---

### Validation

- `/scripts/validate-tokens.js`
- `/scripts/validate-contracts.js`

Run:

```bash
npm run validate