## 16. Thank You Page, Font Fix, Max Guests, New Logo

### 16.1 Thank You page – "What's Next?" section removal

- Remove the entire "What's Next?" section.
- Instead, add a new section:
  - Title: "Kérdése van?" / "Have questions?" / "Haben Sie Fragen?"
  - Display contact methods:
    - Email
    - Phone
    - WhatsApp
- Remove "Contact our support team" link at bottom.

---

### 16.2 Thank You page – Show number of guests

- Clearly show how many guests the booking is for.
- Show this per room and as a total if it's a group booking.
- Label must include localized "max" prefix (e.g., "max 4 fő")

---

### 16.3 Fix font rendering (Birthstone)

- `font-serif` class still renders incorrect fonts.
- Replace all uses of `font-serif` with a new `font-birthstone` class.
- Ensure Google font **Birthstone** is imported and applied correctly.

---

### 16.4 Add "max" prefix for guests in Best Match section

- In the Best Match section, for each room, prefix the guest number with localized "max".
  - Examples:
    - EN: max 3 guests
    - HU: max 3 fő
    - DE: max 3 Gäste

---

### 16.5 Add "max" prefix in booking cart rooms

- In the booking cart, for each room shown:
  - Guest number label must include localized "max" prefix.

---

### 16.6 New logo

- New logo file is located at: `/lillybeth-logo.jpeg`
- If possible:
  - Convert it to a transparent `.png` version.
  - Replace current logo site-wide.
- If transparent version can't be made:
  - Use `/lillybeth-logo.jpeg` directly, despite black background.