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

---

## Token Usage Rules

AI agents must NOT infer or construct token names.

Only tokens explicitly defined in `/tokens/tokens.json` may be used.

If a required token is missing, the agent must:
1. Stop
2. Propose a new token explicitly
3. Wait for approval