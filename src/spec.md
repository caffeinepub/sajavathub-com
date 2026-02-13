# Specification

## Summary
**Goal:** Expand the automatically seeded product catalog so /products includes comprehensive room-wise furniture categories plus new Furnishing and Decor categories, all populated with products using free external sample image URLs.

**Planned changes:**
- Expand backend-seeded room-wise categories (Living Room, Bedroom, Dining Room, Home Office, Kids Room) so each includes multiple furniture products and is available on fresh deploy without manual/admin setup.
- Add new seeded product categories named exactly “Furnishing” and “Decor”, each with multiple products (e.g., curtains/rugs/cushions/bedding; wall art/lamps/mirrors/vases) using external (http/https) free sample image URLs.
- Ensure the UI remains resilient when external product images fail to load by continuing to render grids with the existing SafeExternalImage fallback behavior.

**User-visible outcome:** Visiting /products shows more categories (including Furnishing and Decor), and each category page displays a non-empty product grid sourced from automatically seeded backend data, even if some external images fail to load.
