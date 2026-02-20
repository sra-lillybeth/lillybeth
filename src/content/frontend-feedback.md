## 13. Thank you page after booking

Current issue:
- After completing a booking, the user is redirected back to the homepage.
- There is no dedicated Thank You page.

Required behavior:
- After successful booking submission, redirect to a dedicated Thank You page (e.g. `/booking/thank-you`).
- The Thank You page must display:
  - Thank you message (translated)
  - Booking reference / ID
  - Guest name
  - Check-in date
  - Check-out date
  - Arrival time (if provided)
  - Selected accommodation(s) and room type(s)
  - Final total amount (EUR + HUF if custom HUF price was set)
- The page must be responsive and styled consistently with the site design.
- Provide a clear CTA to go back to homepage or to view accommodations.

---

## 14. Header “Booking now” button routing

Current behavior:
- The “Booking now” button in the header does not point to the search page.

Required behavior:
- The header “Booking now” button must navigate to:
  - `/search`
- The search page must allow users to search available accommodations.

---

## 15. Google Maps marker on accommodations page

Current issue:
- Google Maps is rendered on the accommodations page.
- No marker is displayed for the accommodation location.

Required behavior:
- Display a visible marker for each accommodation on the map.
- Marker position must use:
  - Latitude & longitude from the building data (admin-provided)
- Marker should show accommodation name on hover / click.

---

## 16. Language selector contrast bug in header

Current issue:
- When the language selector dropdown is open in the header, the text is not visible (white text on white background).

Required behavior:
- Fix contrast so all language options are clearly readable when the dropdown is open.
- Ensure:
  - Proper background color
  - Proper text color
  - Hover and active states are visible
- Must work in all themes / screen sizes.