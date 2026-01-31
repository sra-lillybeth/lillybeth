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
- Leads to booking flow (detailed later)

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

## 6. Accommodations Listing Page

Path examples:
- /frontend/accommodation
- /frontend/szallas
- /frontend/unterkunft

Content:
- List of all accommodations (buildings)
- Image, name, key info
- Clickable cards
- Fully localized UI

---

## 7. Accommodation Detail Page (Building Page)

### Layout

#### Top Section
- Full-width image slider (same style as homepage)
- Title
- Booking widget (searches only within this accommodation)

#### Description
- Building description (from admin, multilingual)

#### Gallery
- Accommodation images
- Swipeable / lightbox viewer

#### Amenities
- List from admin
- Icons + labels
- Show more / show less if many items

#### House Rules & Booking Conditions
- From admin
- Structured and readable

#### Location
- Google Maps
- Address displayed

---

## 8. Room Types Section (on Accommodation Page)

For each room type:
- Name
- Short description
- Image carousel
- Capacity
- Key amenities
- Price indication:
  - “From EUR X / night”
- CTA button:
  - Book this room type

---

## 9. Floating Booking Button

- Fixed position (bottom-right)
- Visible on accommodation pages
- Scrolls to booking section
- Prominent but non-intrusive

---

## 10. Booking UX Notes

- Booking is always done by room type
- Date selection uses range picker
- Availability & pricing comes from backend
- Clean, minimal flow
- Designed for trust and clarity

---

## 11. Animations & Motion

- Page transitions: fade + slight blur
- Section reveal on scroll
- Image hover effects
- Smooth modal transitions
- No heavy or distracting animations

---

## 12. Accessibility & UX

- Keyboard navigable
- Proper contrast
- Clickable areas clearly indicated
- Mobile-friendly interactions
- Fast load times

---

## 13. Future Extensions

Planned later:
- Full booking checkout flow
- Payment integration
- SEO optimization
- Replace existing landing page
- Analytics integration
- CMS-like website admin

---

END OF FRONTEND BRIEF
