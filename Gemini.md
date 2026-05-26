# Gemini.md — Zakat Calculator Web App (Frontend Rules)

> **Purpose of this file**: This document is the authoritative source of truth for any AI agent (Claude, Gemini, or otherwise) building, extending, or maintaining the FRONTEND of this codebase. Read this file fully before writing any UI or client-side code. Every decision made here has a reason — do not deviate unless explicitly instructed.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | Kalkulator Zakat Amwal |
| **Type** | Web Application (Frontend Focus) |
| **Primary Language** | Bahasa Indonesia (UI), English (code) |
| **Styling Approach** | STRICTLY Mobile-First with Tailwind CSS |
| **Goal** | Build pixel-perfect, responsive, and seamless UI interfaces for zakat calculation based on provided designs. |

---

## 2. Scope Constraints (MVP)

### ✅ IN SCOPE
- UI Form Zakat Penghasilan (Income Zakat)
- UI Form Zakat Emas & Logam Mulia (Gold Zakat)
- UI Form Zakat Perusahaan (Business Zakat)
- UI Form Zakat Pertanian (Agricultural Zakat)
- Halaman Beranda (Dashboard / Home)
- Halaman Onboarding & Auth flow (UI only)
- State management for forms & calculator logic (use client components)

### ❌ OUT OF SCOPE — Do NOT implement
- Backend API routes (`app/api/*`)
- Database connections or schemas (Prisma/Supabase)
- Authentication logic (only build the forms)
- Multi-user dashboard or history
- Any server-side data fetching for MVP

> **Agent instruction**: If a user asks to add anything from the OUT OF SCOPE list, respond with: *"This feature is outside MVP Frontend scope as defined in Gemini.md."*

---

## 3. Core Principles — Enforce These Everywhere

### 3.1 Strict Mobile-First Layout
Construction of ANY layout must prioritize the base mobile view (e.g., `flex-col`, `w-full`, `px-4`). Use breakpoints (`md:`, `lg:`) strictly to expand or modify layout for larger screens (e.g., `md:flex-row`). Never construct a full-width desktop layout without constructing the mobile layout first.

### 3.2 Design System (GSM)
Always use the designated Amwal design system configured in `globals.css` and `tailwind.config`.

**Border Radius:**
- `rounded-amwal-sm` (5px) ➡️ Badges, tags, small elements.
- `rounded-amwal-md` (10px) ➡️ Primary buttons, form inputs, medium areas.
- `rounded-amwal-lg` (12px) ➡️ Cards, modals, large containers, main content areas.

**Typography:**
- Header/Decorative: `font-yeseva`
- Body/Paragraph: `font-jakarta`

---

## 4. Agent Behaviour Rules

1. **Read this file first.** Confirm you have read Gemini.md in full.
2. **No scope creep.** No backend, no API. Frontend only.
3. **Strict Mobile-First.** Validate your construction against mobile views first.
4. **Respect Design System.** Only use approved border-radius, font, and color variables.
5. **Polished Finish.** Pad and align all elements professionally before delivering the code.
6. **Use Bahasa Indonesia for UI.** All labels, errors, tooltips, and explanations must be in Natural Bahasa Indonesia.