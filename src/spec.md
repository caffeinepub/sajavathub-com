# Specification

## Summary
**Goal:** Enable users to search across all products and browse a dedicated Furniture category with subcategories from the Products by Category page.

**Planned changes:**
- Add a backend global product search API that matches case-insensitively on product name and description and returns matching products (empty/whitespace query returns an empty list).
- Extend backend catalog categories to include a Furniture parent category with subcategories: Sofa, Center Table, Dining Table, Corner Table, King Size Bed, Queen Size Bed, Bed Side Tables, Dressing Table, Study Table, Sofa Chairs, Recliners, and Crockery Unit, with at least one seeded product per subcategory.
- Add a frontend global product search UI in the Shop flow that displays results using existing product listing cards and supports loading/empty/error states.
- Add a React Query hook for global product search with stable query keys and debounced or explicit-submit behavior to avoid excessive requests while typing.
- Update the Products by Category page to include a Furniture section/menu linking to each furniture subcategory without removing access to existing non-furniture categories.

**User-visible outcome:** Users can search for products from the Shop area and see matching product cards, and can browse a Furniture menu on Products by Category to jump into each furniture subcategory and view its products.
