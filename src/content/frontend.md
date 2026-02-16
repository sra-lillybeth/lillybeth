# Accommodation Booking System – Frontend Brief

## 0. Purpose & Scope

This document describes the public-facing frontend of the accommodation booking system.

- Base URL: /frontend
- The existing landing page remains untouched for now
- This frontend will later replace the current landing page
- The frontend consumes data from the admin system
- Booking is done by Room Type (not individual rooms)

---

## 1. Tech Stack & Design Principles

### Tech
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fully responsive (mobile-first)
- Optimized for Vercel
- Uses existing Prisma-powered backend APIs

### Design
- Very modern, premium hotel-style UI
- Clean, elegant, spacious layout
- Smooth animations (fade, blur, subtle motion)
- Soft shadows, light backgrounds
- Reference design inspiration:
  https://themewant.com/products/wordpress/almaris/

---

## 2. Languages & Localization

### Supported Languages
- English (EN)
- Hungarian (HU)
- German (DE)

### Language Switcher
- Visible on all pages
- Switching language updates:
  - UI texts
  - URLs (slugs)
  - Content language

### Content Handling
- All frontend-only texts must be stored in:
  /frontend/contents/{lang}.ts

Examples:
- Button labels
- Section titles
- Hero texts
- Static descriptions

Admin-provided content (buildings, room types, descriptions) is multilingual and comes from the backend.

---

## 3. URL & Slug Rules (CRITICAL)

### Language-based root slugs
Each page slug must appear in the current language.

Examples:
- EN: /frontend/accommodation
- HU: /frontend/szallas
- DE: /frontend/unterkunft

### Building slug
- The building slug is language-independent
- Comes from the building title
- Example:
  villa-lillybeth

### Full example URLs
- EN: /frontend/accommodation/villa-lillybeth
- HU: /frontend/szallas/villa-lillybeth
- DE: /frontend/unterkunft/villa-lillybeth

### Search Results Page
- EN: /frontend/search?checkIn=...&checkOut=...&guests=...
- HU: /frontend/kereses?checkIn=...&checkOut=...&guests=...
- DE: /frontend/suche?checkIn=...&checkOut=...&guests=...
- Optional: accommodationId param to filter to single accommodation

---

## 4. Global Elements

### Logo
- File: /public/lillybeth_ico.webp
- Appears in header and footer

### Header
- Logo (left)
- Navigation
- Language selector
- Sticky on scroll

### Footer
- Logo
- Contact information
- Address
- Social links (optional)
- Copyright

---

## 5. Homepage Structure

### 5.1 Hero Section
- Full-width image slider
- Auto-rotating
- Manual navigation
- Smooth animation
- Overlay text (editable)
- Images defined in a separate config file

### 5.2 Search Section
- Check-in / Check-out date range picker
- Guest count selector
- Visually rich hotel-style date picker (Airbnb-like)
- Search button navigates to dedicated Search Results Page
- Search state stored in URL params

### 5.3 Our Properties (Accommodations)
- Displays all buildings
- Card layout with:
  - Image
  - Name
  - Short description
- Layout adapts:
  - 2 buildings → balanced layout
  - 3+ buildings → grid
- Cards are clickable → building detail page

### 5.4 About Section
- Short descriptive text
- Content aligned with existing landing page copy

### 5.5 Gallery
- Image grid
- Click → fullscreen gallery viewer
- Images managed from admin (Website Admin section)

### 5.6 Location Map
- Google Maps
- Markers based on building addresses
- Address text displayed below

---

## 6. Accommodations Listing Page (Buildings List)

Path examples:
- /frontend/accommodation
- /frontend/szallas
- /frontend/unterkunft

### Content
- List of all accommodations (buildings)
- Fully localized UI

### Building Card Content
Each building card must display:
- Cover image
- Building name
- Short basic info (capacity / short description)

### Building Card Image Slider
Each building card must contain a horizontal image slider:
- Maximum 10 images
- Swipeable / draggable on mobile
- After the last image, there must be a dedicated slide:
  - CTA: "Learn more" (label from i18n)
  - Clicking navigates to the building detail page

### Card Design Requirements
- Premium design
- Image-first layout
- Touch-friendly interactions
- Smooth slider transitions

### Responsive Layout
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 2–3 columns depending on width

---

## 7. Accommodation Detail Page (Building Page)

### 7.1 Hero Section
- Full-width image slider (building gallery)
- Touch & swipe supported
- Subtle animations allowed (fade / parallax)
- Overlay content:
  - Building name
  - Key info (location, capacity, short highlight text)

### 7.2 Booking Search (Filtered to Building)
- Same booking search UI as homepage:
  - Start date
  - End date
  - Guest number
- Search navigates to Search Results Page with accommodationId filter
- Visually overlaps the hero section slightly (premium hotel-style layout)

### 7.3 Description & Amenities
- Accommodation description from admin
- Amenities list from admin
- If long:
  - Collapsed by default
  - Expandable via "Show more" (label from i18n)

### 7.4 Gallery
- Accommodation images
- Swipeable / lightbox viewer

### 7.5 Rooms List
- Rooms displayed vertically
- Each room card contains:
  - Image slider
  - Room name
  - Capacity
  - Short description
  - "From" price (lowest available price, label from i18n)
  - Quantity selector (replaces book button)
- Layout:
  - Mobile-first stacked
  - Desktop: image left, content right

### 7.6 House Rules & Booking Conditions
- From admin
- Structured and readable

### 7.7 Map Section
- Embedded Google Map
- Exact building location
- Address displayed near map
- Premium map styling (minimal / grayscale if possible)

---

## 8. Room Types Section (on Accommodation Page)

For each room type:
- Name
- Short description
- Image carousel
- Capacity (prominently displayed)
- Key amenities (merged: room type + accommodation level, max 10, "+more" button)
- Available rooms count badge
- Price indication:
  - "From EUR X / night" (label from i18n)
- Quantity selector:
  - +/- buttons to select how many rooms
  - Max limited to available rooms count

---

## 9. Booking Cart (Fixed Position)

- Fixed position at bottom of screen
- Visible when items are in cart
- Shows:
  - Total rooms selected (prominent badge)
  - Total guest capacity
  - Total price per night
- Expandable to show item details
- "Book Now" CTA button
- Replaces old floating book button
- Smooth animations on updates
- Mobile: full-width bottom bar
- Desktop: centered max-width container

---

## 10. Search Results Page (Dedicated Page)

### 10.1 URL Structure
- Path: /frontend/search (language-independent for simplicity)
- Query params:
  - checkIn (required): YYYY-MM-DD
  - checkOut (required): YYYY-MM-DD
  - guests (required): number
  - accommodationId (optional): filter to single accommodation

### 10.2 Page Structure

**Header Section:**
- Search summary bar showing current search params
- "Modify Search" button to adjust dates/guests
- Back navigation

**Best Match Recommendation:**
- Single highlighted card at the top
- Shows the most efficient room combination
- Availability-aware
- Visual highlight (border, badge, background)
- "Select Best Match" button auto-fills cart with this combination
- Shows:
  - List of room types with quantities
  - Total capacity
  - Total price per night
  - "Best Match" badge

**Room Types Listing:**
- Grouped by accommodation (if searching all)
- Uses identical layout to accommodation detail page room types
- Each room type card has:
  - Image slider
  - Name, description, capacity badge
  - Amenities (merged, max 10, +more)
  - Available rooms count
  - Price indication
  - Quantity selector (+/- buttons)
- Quantity changes update cart in real-time

### 10.3 States

**Loading State:**
- Full-page skeleton with animated placeholders
- Search summary visible immediately

**Empty State:**
- Friendly message: no rooms available
- Suggestions: try different dates, adjust guest count
- Visual icon

**Results State:**
- Best Match card
- Room types list with quantity selectors
- Fixed booking cart at bottom

### 10.4 Responsive Behavior

**Mobile:**
- Stacked layout
- Best Match card full-width
- Room type cards stacked
- Cart fixed at bottom, full-width

**Desktop:**
- Best Match card prominent at top
- Room types in vertical list (image left, content right)
- Cart fixed at bottom, centered container

---

## 11. Booking UX Notes

- Booking is always done by room type
- Date selection uses range picker
- Availability & pricing comes from backend
- Clean, minimal flow
- Designed for trust and clarity
- Cart persists across page navigation
- Search state in URL allows sharing/bookmarking

---

## 12. Animations & Motion

- Page transitions: fade + slight blur
- Section reveal on scroll
- Image hover effects
- Smooth modal transitions
- Swipeable carousels on mobile
- Cart expand/collapse animations
- Quantity selector feedback
- No heavy or distracting animations

---

## 13. Accessibility & UX

- Keyboard navigable
- Proper contrast
- Clickable areas clearly indicated
- Mobile-friendly interactions
- Fast load times

---

## 14. Booking Page (Checkout Flow)

### 14.1 URL Structure
- Path: /frontend/booking
- Requires: items in cart with dates

### 14.2 Page Layout
Two-column layout (mobile: stacked):
- Left column: Guest information form
- Right column: Booking summary (sticky on desktop)

### 14.3 Guest Information Form
Fields:
- Guest Name (required)
- Email (required)
- Phone (optional)
- Arrival Time (optional, time picker)
- Special Notes (optional, textarea)

### 14.4 Booking Summary Section
Shows:
- Date range (check-in / check-out)
- Number of nights
- List of selected rooms with:
  - Room type name
  - Accommodation name
  - Quantity
  - Price per night
  - Remove button (X)
- Additional prices section:
  - Mandatory prices (auto-selected)
  - Optional prices (checkbox toggles)
  - Per-night and per-guest multipliers
- Price breakdown:
  - Accommodation total
  - Additional prices total
  - Grand total (sticky)

### 14.5 Booking Logic
- Single room → creates single Booking
- Multiple rooms → creates BookingGroup with child Bookings
- Source always set to "Website"
- Calculates prices based on:
  - Date range pricing rules
  - Calendar overrides
  - Additional prices (building + room type level)

### 14.6 States
- Loading: Show skeleton while calculating prices
- Error: Display validation/API errors
- Success: Show confirmation with booking reference

### 14.7 Responsive Behavior
Mobile:
- Stacked layout (form above, summary below)
- Summary becomes expandable accordion
- Sticky "Complete Booking" button at bottom

Desktop:
- Two-column layout
- Summary column sticky within viewport
- Form on left (wider), summary on right

---

## 15. Future Extensions

Planned later:
- Payment integration
- SEO optimization
- Replace existing landing page
- Analytics integration
- CMS-like website admin

---

## 15. Global Frontend Notes

### Performance
- SEO-friendly structure
- Lazy-loaded images
- Optimized sliders (avoid heavy libraries)

### Internationalization (i18n)
All UI labels must come from i18n files, including:
- "Learn more"
- "From"
- "Guests"
- "Show more"
- "Book"
- "View availability"
- "Select combination"
- "No rooms available"
- "Searching..."
- "Best Match"
- "Select Best Match"
- "Modify Search"
- All button texts
- All section titles

---

END OF FRONTEND BRIEF
