## 9. Calendar booking bar rendering bug for ongoing bookings

Current behavior:
- In Calendar view, bookings are rendered as rectangles.
- Rectangle width equals the number of booked nights.
- If a booking started in the past and is still ongoing today:
  - The booking bar is rendered with full width (total nights),
  - But the start date is outside of the visible calendar range.
  - This causes the booking to appear shifted to the right and visually incorrect.

Example:
- Booking: Feb 20 – Feb 23 (3 nights)
- Today: Feb 21
- Current rendering makes it look like: Feb 21 – Feb 24
- This is incorrect.

Expected behavior:
- Booking bars must always be rendered based on real start and end dates.
- If the start date is outside of the current visible calendar range:
  - The bar must start at the first visible date,
  - The width must be clipped to only the visible portion.
- The booking duration must NOT be visually shifted.
- The bar should represent:
  max(booking.startDate, visibleRange.start) → min(booking.endDate, visibleRange.end)

---

## 10. Multi-image upload broken for buildings and room types

Current behavior:
- When selecting multiple images for upload (building or room type),
  only one image is uploaded.

Expected behavior:
- Multi-image selection must upload ALL selected images.
- The upload process must:
  - Preserve selection order
  - Show upload progress per image (if already supported)
  - Append images to existing gallery, not overwrite
- This must work for:
  - Building image upload
  - Room type image upload