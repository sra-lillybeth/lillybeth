## 11. Group booking edit bug + custom final amount display

### 11.1 "Edit full group booking" not loading

Problem:
- In Calendar view, when clicking on one room of a group booking,
  the "Edit full group booking" button appears.
- Clicking it should open the group booking edit view.
- Currently, it does not load.
- Only loader spins indefinitely.

Expected behavior:
- Clicking "Edit full group booking" must:
  - Navigate to the correct group booking edit route.
  - Load full group booking data.
  - Populate all rooms inside the group.
- Loader must stop when data is loaded.
- Proper error handling if API fails.

Check:
- Routing parameter (groupBookingId)
- API endpoint correctness
- Loading state handling
- Infinite loading condition

---

### 11.2 Custom Final amount not reflected in bookings list

Problem:
- In group booking, when overriding the Final amount (custom price),
  the value is saved.
- However, in the bookings list, the Amount column does NOT show
  this overridden value.
- Single booking already behaves correctly.

Expected behavior:
- If group booking has custom Final amount:
  - That value must be displayed in the bookings list Amount column.
- If no custom override:
  - Display calculated amount.
- Behavior must match single booking logic.

Rules:
- No fallback to calculated price if custom price exists.
- Ensure correct field mapping in API response and frontend list view.