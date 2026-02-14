# Frontend Feedback – Search & Smart Room Combination

## Search Behavior

1. Homepage search:
   - If the search form is filled on the homepage, the system must search for available room types across ALL accommodations (buildings).
   - Results must be grouped by accommodation.
   - The result layout must be the same as on the accommodation detail page (room types list with images, amenities, guest capacity, availability, price from).

2. Accommodation page search:
   - If the search form is filled on a specific accommodation page, the search must be limited to that accommodation only.
   - Result layout is identical to the homepage search result layout.

## Smart Guest Distribution (Room Combination Suggestions)

When searching with a given guest count, the result list must prioritize room type combinations that best match the guest number.

Example for 8 guests:

Priority order:
1. 2 × 4-person room (if available)
2. 2 × 3-person room + 1 × 2-person room (if available)
3. 4 × 2-person room (if available)

Rules:
- The system must generate and rank valid room type combinations that sum up to the selected guest number.
- Combinations must only include room types that are actually available for the selected date range.
- The UI must clearly present these combinations as selectable options for the user.
- The user can choose which combination they prefer.
- After selecting a combination, the selected room types and quantities must be added to the booking cart.

## Availability Logic

- Availability must respect:
   - Date range
   - Guest capacity per room type
   - Actual free rooms per room type in the selected date range
- If availability changes (date change, guest count change), the result list and combinations must update instantly.

## UX Requirements

- Searching must show a loading state.
- Empty state:
   - Show a friendly message if no matching room combinations are found.
- Mobile UX:
   - Combination cards must be swipeable.
- Desktop UX:
   - Combination cards must be displayed as selectable cards or tiles.
