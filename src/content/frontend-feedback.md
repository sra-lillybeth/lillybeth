## 9. Language consistency issues

Current issue:
- In several places labels like “guests”, “rooms”, etc. are still shown in English even when HU or DE is selected.

Required behavior:
- ALL user-facing texts must be translated based on the selected language.
- This includes:
  - Form labels (guests, rooms, dates, booking, etc.)
  - Buttons
  - Section titles
  - Helper texts
  - Empty states
- There must be no hardcoded English strings left in UI components.
- All frontend static texts must come from the contents folder (per-language files).

---

## 10. Footer cleanup

Current behavior:
- Footer contains “Quick links” and “Address” sections.

Required change:
- Remove:
  - Quick links section
  - Address section
- Keep only:
  - Logo
  - Basic navigation
  - Copyright

---

## 11. Header booking button route

Current behavior:
- Header “Booking” button behavior is inconsistent.

Required behavior:
- Clicking the header “Booking” button must always navigate to:
  - `/booking`
- The booking page must open with the search form visible.

---

## 12. Date picker restriction

Current behavior:
- Users can select today’s date.

Required behavior:
- Today’s date must NOT be selectable.
- The earliest selectable date must always be:
  - Tomorrow
- This rule must apply to:
  - Homepage search
  - Accommodation page search
  - Booking page search
