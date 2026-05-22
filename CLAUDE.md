@AGENTS.md

# CLAUDE.md — Zakat Calculator Web App

> **Purpose of this file**: This document is the authoritative source of truth for any AI agent (Claude or otherwise) building, extending, or maintaining this codebase. Read this file fully before writing any code. Every decision made here has a reason — do not deviate unless explicitly instructed.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | Kalkulator Zakat |
| **Type** | Web Application (MVP) |
| **Primary Language** | Bahasa Indonesia (UI), English (code) |
| **Goal** | Help users calculate zakat obligations quickly, transparently, and correctly per syariah principles |

---

## 2. Scope Constraints (MVP)

### ✅ IN SCOPE
- Zakat Penghasilan (Income Zakat)
- Zakat Emas & Logam Mulia (Gold Zakat)
- Zakat Perusahaan (Business Zakat)
- Zakat Hasil Pertanian (Agricultural Zakat)

### ❌ OUT OF SCOPE — Do NOT implement
- Payment gateway / zakat disbursement
- Multi-user dashboard or authentication
- Transaction history
- AI recommendations
- Zakat saham (stocks) or crypto
- API auto-fetch for gold/rice prices (future feature)

> **Agent instruction**: If a user asks you to add anything from the OUT OF SCOPE list, respond with: *"This feature is outside MVP scope as defined in CLAUDE.md."*

---

## 3. Core Principles — Enforce These Everywhere

### 3.1 Transparency
Every result screen **must** show:
1. Whether the user is **obligated** (wajib) to pay zakat and **why**
2. The **nisab threshold** used and how it was calculated
3. The **formula applied** in plain language

### 3.2 Fiqih Accuracy
- Do NOT hardcode a single scholarly opinion where disagreement exists
- Provide toggles/options where ulama differ (see: Gold section)
- Never calculate `total revenue * 2.5%` for business zakat — this is fiqih error

### 3.3 Modularity
Each zakat type is a **completely independent module** with its own:
- `calculator` — pure function, no side effects
- `validator` — input validation, returns typed errors
- `nisabEngine` — determines eligibility threshold
- `resultGenerator` — formats output for display

> **Agent instruction**: Never mix logic across modules. `income.ts` must not import from `gold.ts`, etc.

---

## 4. Tech Stack

> If a stack is not specified by the user, default to **Next.js + TypeScript**.

```
Frontend:   Next.js (App Router) + TypeScript
Styling:    Tailwind CSS
Validation: Zod (runtime schema validation)
Testing:    Vitest (unit tests for all calculator functions)
```

---

## 5. Folder Structure

```
src/
├── modules/
│   └── zakat/
│       ├── calculators/
│       │   ├── income.ts         # Zakat Penghasilan
│       │   ├── gold.ts           # Zakat Emas
│       │   ├── business.ts       # Zakat Perusahaan
│       │   └── agriculture.ts    # Zakat Pertanian
│       ├── validators/
│       │   ├── income.schema.ts
│       │   ├── gold.schema.ts
│       │   ├── business.schema.ts
│       │   └── agriculture.schema.ts
│       ├── nisab/
│       │   └── engine.ts         # Shared nisab calculation logic
│       ├── types/
│       │   └── index.ts          # All TypeScript types
│       └── constants/
│           └── index.ts          # NISAB_GOLD_GRAM, NISAB_RICE_KG, etc.
├── app/
│   └── api/
│       └── zakat/
│           ├── income/route.ts
│           ├── gold/route.ts
│           ├── business/route.ts
│           └── agriculture/route.ts
└── components/
    └── zakat/
        ├── IncomeForm.tsx
        ├── GoldForm.tsx
        ├── BusinessForm.tsx
        └── AgricultureForm.tsx
```

---

## 6. Global Configuration

```typescript
// src/modules/zakat/types/index.ts

type GlobalConfig = {
  goldPricePerGram: number   // Current gold price in IDR per gram
  ricePricePerKg: number     // Current rice price in IDR per kg (future use)
}
```

**Default values (update when price changes):**
```typescript
// src/modules/zakat/constants/index.ts

export const NISAB_GOLD_GRAM = 85          // grams — fixed by syariah
export const NISAB_RICE_KG = 653           // kg — fixed by syariah
export const ZAKAT_RATE = 0.025            // 2.5% — standard kadar
export const ZAKAT_RATE_NATURAL = 0.10     // 10% — rain-fed agriculture
export const ZAKAT_RATE_IRRIGATED = 0.05   // 5% — paid irrigation
```

> **Agent instruction**: Never hardcode numeric constants inline. Always reference these named constants.

---

## 7. Module: Zakat Penghasilan (Income)

### Syariah Basis
- Nisab = 85 grams of gold
- Kadar = 2.5%
- Supports two calculation modes (scholars differ): **monthly** and **yearly**

### Input Type
```typescript
type IncomeZakatInput = {
  monthlyIncome: number          // Gross monthly income in IDR
  monthlyExpense: number         // Essential monthly expenses in IDR
  calculationMode: "monthly" | "yearly"
  goldPricePerGram: number       // Current gold price in IDR/gram
}
```

### Formulas

```
nisab              = goldPricePerGram × 85
netMonthlyIncome   = monthlyIncome − monthlyExpense
annualIncome       = netMonthlyIncome × 12

// Yearly mode:
isEligible         = annualIncome >= nisab
zakatAmount        = annualIncome × 0.025

// Monthly mode:
monthlyNisab       = nisab / 12
isEligible         = netMonthlyIncome >= monthlyNisab
zakatAmount        = netMonthlyIncome × 0.025   (if eligible, else 0)
```

### Output Type
```typescript
type IncomeZakatResult = {
  isEligible: boolean
  nisab: number            // Annual nisab threshold in IDR
  annualIncome: number     // Calculated annual net income in IDR
  zakatAmount: number      // Zakat payable in IDR
  calculationMode: "monthly" | "yearly"
  breakdown: {
    netMonthlyIncome: number
    monthlyNisab: number
  }
}
```

---

## 8. Module: Zakat Emas & Logam Mulia (Gold)

### Syariah Basis
- Nisab = 85 grams (minimum ownership)
- Haul = owned for minimum 1 lunar year
- Kadar = 2.5%

### Scholarly Disagreement — MUST expose to user
> Majority opinion: gold worn daily (perhiasan) is NOT subject to zakat.
> Minority opinion: all gold is subject to zakat.

**Implementation rule**: Show a `goldType` toggle. When `goldType === "jewelry"`, display a disclaimer explaining the scholarly difference. Do NOT silently exclude jewelry from zakat.

### Input Type
```typescript
type GoldZakatInput = {
  totalGoldGram: number
  goldPricePerGram: number
  ownedForOneYear: boolean        // haul requirement
  goldType: "investment" | "jewelry"
}
```

### Formulas
```
nisabGram   = 85
goldValue   = totalGoldGram × goldPricePerGram

isEligible  = (totalGoldGram >= 85) AND (ownedForOneYear === true)
zakatAmount = goldValue × 0.025   (if eligible, else 0)
```

### Output Type
```typescript
type GoldZakatResult = {
  isEligible: boolean
  goldValue: number           // Total value in IDR
  nisabGram: number           // Always 85
  zakatAmount: number         // Zakat payable in IDR
  scholarlyNote?: string      // Populated when goldType === "jewelry"
}
```

---

## 9. Module: Zakat Perusahaan (Business)

### Syariah Basis
- Analogous to zakat on liquid wealth
- Nisab = equivalent of 85 grams of gold
- Kadar = 2.5%
- Base = **net working capital** (current assets minus short-term liabilities)

### ⚠️ Critical Fiqih Warning
```
WRONG:  totalRevenue × 2.5%
RIGHT:  (cash + inventory + receivables − shortTermDebt) × 2.5%
```
> **Agent instruction**: If you ever see `revenue` used as the zakat base in business zakat, flag it as a fiqih error and correct it.

### Input Type
```typescript
type BusinessZakatInput = {
  cash: number               // Cash and bank balances
  inventory: number          // Inventory value at current market price
  receivables: number        // Accounts receivable (collectible)
  shortTermDebt: number      // Current liabilities / short-term debt
  goldPricePerGram: number
}
```

### Formulas
```
netAssets   = cash + inventory + receivables − shortTermDebt
nisab       = goldPricePerGram × 85

isEligible  = netAssets >= nisab
zakatAmount = netAssets × 0.025   (if eligible, else 0)
```

### Output Type
```typescript
type BusinessZakatResult = {
  isEligible: boolean
  netAssets: number          // Net working capital in IDR
  nisab: number              // Nisab threshold in IDR
  zakatAmount: number        // Zakat payable in IDR
  breakdown: {
    totalAssets: number      // cash + inventory + receivables
    totalDebt: number        // shortTermDebt
  }
}
```

---

## 10. Module: Zakat Hasil Pertanian (Agriculture)

### Syariah Basis
- Zakat paid **at harvest** — no haul (1-year) requirement
- Nisab = 653 kg of grain (gabah)
- Kadar depends on water source:
  - **10%** → rain-fed / natural water (no cost)
  - **5%** → paid irrigation

### Input Type
```typescript
type AgricultureZakatInput = {
  harvestKg: number
  irrigationType: "natural" | "paid"
}
```

### Formulas
```
nisabKg     = 653

isEligible  = harvestKg >= 653
rate        = irrigationType === "natural" ? 0.10 : 0.05
zakatAmountKg = harvestKg × rate   (if eligible, else 0)
```

### Output Type
```typescript
type AgricultureZakatResult = {
  isEligible: boolean
  nisabKg: number             // Always 653
  rate: number                // 0.10 or 0.05
  zakatAmountKg: number       // Zakat in kg of grain
  irrigationType: "natural" | "paid"
}
```

> **Note**: Result is in **kilograms**, not IDR. UI may optionally convert using `ricePricePerKg` from GlobalConfig.

---

## 11. Validation Rules

All input fields must pass these checks **before** reaching the calculator:

| Rule | Description |
|---|---|
| No negative numbers | All numeric inputs must be `>= 0` |
| No NaN | Reject non-numeric input |
| No empty required fields | All required fields must be present |
| goldPricePerGram > 0 | Must be positive to avoid division errors |
| monthlyIncome >= monthlyExpense | Warn if expense > income (net negative) |

### Error Response Shape
```typescript
type ValidationError = {
  success: false
  error: {
    field: string
    message: string   // In Bahasa Indonesia for user-facing messages
  }[]
}
```

**Example:**
```json
{
  "success": false,
  "error": [
    { "field": "monthlyIncome", "message": "Penghasilan bulanan harus lebih dari 0" }
  ]
}
```

---

## 12. API Design

### Endpoints
```
POST /api/zakat/income
POST /api/zakat/gold
POST /api/zakat/business
POST /api/zakat/agriculture
```

### Response Envelope — Always use this shape
```typescript
// Success
type ApiSuccess<T> = {
  success: true
  data: T
}

// Error
type ApiError = {
  success: false
  error: { field: string; message: string }[]
}
```

### Example: Income Zakat

**Request:**
```json
{
  "monthlyIncome": 10000000,
  "monthlyExpense": 3000000,
  "calculationMode": "yearly",
  "goldPricePerGram": 1008069
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isEligible": false,
    "nisab": 85685865,
    "annualIncome": 84000000,
    "zakatAmount": 0,
    "calculationMode": "yearly",
    "breakdown": {
      "netMonthlyIncome": 7000000,
      "monthlyNisab": 7140488
    }
  }
}
```

> Note: `annualIncome` (84,000,000) < `nisab` (85,685,865), so `isEligible: false`.

---

## 13. UI Requirements

### Per Calculator Screen — Required Elements
1. **Form** — All inputs with labels in Bahasa Indonesia
2. **Result card** — Shows `isEligible`, zakat amount, and nisab
3. **Explanation section** — Plain-language breakdown of calculation
4. **Disclaimer** — Where scholarly disagreement exists (Gold only in MVP)

### Gold Type Toggle — Required UI
```
[ Emas Investasi ]  [ Emas Perhiasan ]

// When "Emas Perhiasan" is selected, show:
ℹ️ Catatan: Mayoritas ulama tidak mewajibkan zakat emas perhiasan
   yang digunakan sehari-hari. Namun sebagian ulama tetap mewajibkannya.
   Pilih sesuai keyakinan Anda.
```

### Calculation Mode Toggle (Income) — Required UI
```
[ Hitung Tahunan ]  [ Hitung Bulanan ]
```

---

## 14. Testing Requirements

Every calculator function **must** have unit tests covering:

1. ✅ Happy path — eligible, correct amount
2. ✅ Below nisab — not eligible, amount = 0
3. ✅ Exactly at nisab — eligible
4. ✅ Zero income/harvest — not eligible
5. ✅ Negative input — validation error
6. ✅ Missing required field — validation error

```typescript
// Example test structure (Vitest)
describe("incomeZakatCalculator", () => {
  it("should return eligible when annualIncome >= nisab", () => { ... })
  it("should return zakatAmount = 0 when not eligible", () => { ... })
  it("should throw validation error on negative income", () => { ... })
})
```

---

## 15. Agent Behaviour Rules

> These rules govern how an AI agent should behave when working on this codebase.

1. **Read this file first.** Before writing any code, confirm you have read CLAUDE.md in full.
2. **No scope creep.** Do not add features outside Section 2's IN SCOPE list.
3. **Respect module boundaries.** Calculators must not cross-import.
4. **Constants over literals.** Never write `85` or `0.025` inline — use named constants.
5. **Validate before calculating.** Validator runs before any calculator function is called.
6. **Preserve fiqih accuracy.** When in doubt about a syariah rule, flag it as a comment — do not guess silently.
7. **Use the response envelope.** All API responses must follow the `ApiSuccess<T> | ApiError` shape.
8. **Bahasa Indonesia for users.** All user-facing strings (labels, errors, explanations) must be in Bahasa Indonesia. Code, types, and comments in English.
9. **Test your calculators.** Any calculator function you write or modify must have corresponding tests per Section 14.
10. **Do not store state in calculators.** All calculator functions must be pure functions.

---

## 16. Glossary

| Term | Meaning |
|---|---|
| Nisab | Minimum threshold of wealth that triggers zakat obligation |
| Haul | One lunar year of continuous ownership |
| Kadar | Zakat rate (percentage) |
| Wajib | Obligatory |
| Gabah | Unhusked rice / paddy |
| Penghasilan | Income / earnings |
| Logam Mulia | Precious metals (gold, silver) |
| Aset Lancar | Current assets |
| Piutang | Accounts receivable |
| Hutang Jangka Pendek | Short-term liabilities |

---

*Last updated: 2026 — Maintained as part of Kalkulator Zakat MVP*
