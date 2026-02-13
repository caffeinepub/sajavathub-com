# Specification

## Summary
**Goal:** Add a Havenly-like “Shop” experience with backend-managed product categories and products, including admin-managed catalog APIs and public browsing pages.

**Planned changes:**
- Backend: Add ProductCategory and Product data types plus query APIs to list categories and products by category (optionally fetch product by id).
- Backend: Add admin-gated mutation APIs to create/update categories and products, following the existing admin authorization pattern.
- Backend: Add seed data (at least 6 categories, at least 3 products per category) using static imageUrl paths to frontend public assets and valid placeholder productUrl links.
- Frontend: Add React Query hooks to fetch all categories and products by category, using stable query keys and waiting until the backend actor is ready.
- Frontend: Add public routes for category browsing (e.g., /products) and category detail (e.g., /products/$categoryId) with loading/empty/error states and product cards linking out safely.
- Frontend: Add a new header navigation link (desktop + mobile) to the categories landing page with consistent styling and active state behavior.

**User-visible outcome:** Users can navigate to a new “Shop/Products” section from the site header, browse a list of product categories, open a category to see a grid of products, and click through to external product pages.
