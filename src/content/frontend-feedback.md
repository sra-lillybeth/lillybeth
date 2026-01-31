# Frontend Feedback – Slugs & Accommodation Listing

## 1. Slug-based Routing (CRITICAL)

Accommodation pages must be identified by **slug**, not by ID.

- URL example (EN):
    - `/frontend/accommodation/lake-house`
- The slug must be stored and managed per language.

---

## 2. Multilingual Slugs

Slugs must be **language-specific**.

Examples:
- EN: `/frontend/accommodation/lake-house`
- HU: `/frontend/szallas/tavi-haz`
- DE: `/frontend/unterkunft/see-haus`

Rules:
- Slugs must NOT fall back to English
- Each accommodation must have:
    - `slug_en`
    - `slug_hu`
    - `slug_de`
- Frontend routing must respect the selected language

---

## 3. Accommodation Listing Page

Under the **Accommodations (Szállások / Unterkünfte)** menu item:

- Display **all accommodations (buildings)**
- Each accommodation card must include:
    - Featured image
    - Accommodation name
    - Short description
    - Key info (e.g. location, number of room types)
    - CTA button: “View accommodation”

Layout requirements:
- Responsive grid
- Works well with:
    - 1 accommodation
    - 2 accommodations
    - 3+ accommodations
- Clicking a card navigates to the accommodation detail page using the correct language slug

---

## 4. Menu Label Localization

Menu labels must be localized:

- EN: Accommodations
- HU: Szállások
- DE: Unterkünfte

The URL segment must also be localized:
- EN: `/frontend/accommodation`
- HU: `/frontend/szallas`
- DE: `/frontend/unterkunft`

---

## 5. Data Consistency Rules

- Slug resolution must:
    - Work on direct page load (no client-only routing)
    - Support refresh and deep linking
- If a slug is not found:
    - Show a friendly 404 page
    - Do NOT silently redirect to another language
